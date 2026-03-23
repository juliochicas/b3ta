import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { z } from "zod";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Validación de formulario con Zod
const contactFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  email: z.string()
    .trim()
    .email("Email inválido")
    .max(255, "El email es demasiado largo"),
  company: z.string()
    .trim()
    .max(100, "El nombre de la empresa es demasiado largo")
    .optional(),
  phone: z.string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        // Validar formato internacional E.164
        return /^\+[1-9]\d{1,14}$/.test(val);
      },
      { message: "Número de teléfono inválido" }
    ),
  service_interest: z.string().optional(),
  message: z.string()
    .trim()
    .max(2000, "El mensaje es demasiado largo")
    .optional()
});

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service_interest: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar datos del formulario
    try {
      contactFormSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Error de validación",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('save-lead', {
        body: { ...formData, source: 'contact-form' }
      });

      if (error) throw error;

      toast({
        title: "¡Gracias por contactarnos!",
        description: "Nos comunicaremos contigo en menos de 24 horas.",
      });

      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        service_interest: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el formulario. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Agenda tu Consultoría
            </h2>
            <p className="text-xl text-muted-foreground">
              Primera sesión sin costo. Análisis de necesidades y roadmap personalizado.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="md:col-span-2 p-8 bg-card border-border">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    placeholder="Nombre completo *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email corporativo *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    placeholder="Empresa"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                  <PhoneInput
                    international
                    defaultCountry="GT"
                    value={formData.phone}
                    onChange={(value) => setFormData({ ...formData, phone: value || "" })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:text-foreground [&_.PhoneInputInput]:placeholder:text-muted-foreground [&_.PhoneInputCountryIcon]:bg-transparent [&_.PhoneInputCountryIconImg]:rounded-sm"
                    placeholder="Teléfono (Ej. +502 ...)"
                  />
                </div>

                <Select 
                  value={formData.service_interest} 
                  onValueChange={(value) => setFormData({ ...formData, service_interest: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="¿En qué servicio estás interesado?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Páginas Web</SelectItem>
                    <SelectItem value="mvp">MVP & Desarrollo de Producto</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="automation">Automatización</SelectItem>
                    <SelectItem value="ia">IA Corporativa</SelectItem>
                    <SelectItem value="china-imports">Importaciones de China</SelectItem>
                    <SelectItem value="multiple">Varios servicios</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Cuéntanos sobre tu proyecto o necesidad..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                />

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  {isSubmitting ? "Enviando..." : "Solicitar Consultoría Gratuita"}
                </Button>
              </form>
            </Card>

            <div className="space-y-8">
              <Card className="p-8 bg-card border-border hover:shadow-lg transition-shadow">
                <Mail className="h-6 w-6 text-primary mb-4" />
                <h3 className="font-semibold mb-2 text-foreground">Email</h3>
                <a 
                  href="mailto:hi@b3ta.us?subject=Consultoría B3TA&body=Hola, me interesa conocer más sobre sus servicios."
                  className="text-sm text-primary hover:underline transition-colors"
                >
                  hi@b3ta.us
                </a>
              </Card>

              <Card className="p-8 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <MessageCircle className="h-6 w-6 text-[#25D366]" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">WhatsApp</h3>
                <p className="text-sm text-muted-foreground mb-4">+1 (435) 534-8065</p>
                <Button
                  onClick={() => {
                    const phoneNumber = "14355348065";
                    const message = "Hola, me interesa una consultoría con B3TA";
                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full bg-whatsapp hover:bg-whatsapp-hover text-primary-foreground"
                  size="sm"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chatea con nosotros
                </Button>
              </Card>

              <Card className="p-8 bg-card border-border">
                <MapPin className="h-6 w-6 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Cobertura</h3>
                <p className="text-sm text-muted-foreground">LATAM + USA + España</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};