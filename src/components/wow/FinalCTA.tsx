import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const FinalCTA = () => {
  const [pain, setPain] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pain.trim() || !email.trim()) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.from('leads_b3ta').insert([
        {
          email: email.trim(),
          message: pain.trim(),
          status: 'new',
          priority: 'medium',
          name: email.split('@')[0] // auto-extract simple name
        }
      ]);

      if (error) throw error;

      // Disparar las notificaciones por correo automáticamente
      await supabase.functions.invoke('send-lead-notifications', {
        body: { email: email.trim(), name: email.split('@')[0], message: pain.trim() }
      });

      toast({
        title: "¡Solicitud Enviada Exitosamente!",
        description: "Nuestro equipo analizará tus requerimientos y te contactará en breve.",
      });
      
      setPain("");
      setEmail("");
    } catch (err: any) {
      toast({
        title: "Error al enviar la solicitud",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden">

      <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-card mb-8 border border-primary/20 shadow-2xl">
          <Zap className="w-10 h-10 text-primary" />
        </div>
        
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight tracking-tighter">
          Platicanos tu proyecto
        </h2>

        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-4 max-w-3xl mx-auto">
          Cuentanos que necesitas y te decimos si podemos ayudarte, cuanto cuesta y en cuanto tiempo.
        </p>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {[
            { dot: "bg-accent", text: "Respuesta en menos de 24h" },
            { dot: "bg-primary", text: "Sin contratos de permanencia" },
            { dot: "bg-secondary", text: "Cotizacion sin costo" },
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <span className={`w-2 h-2 rounded-full ${item.dot}`} />
              {item.text}
            </span>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-6 md:p-10 rounded-xl border border-border/50 shadow-elegant mx-auto max-w-4xl relative overflow-hidden">
          <div className="space-y-6 text-left relative z-10">
            <label className="block text-foreground font-bold text-lg md:text-xl">
              Que necesitas? Cuentanos en una linea:
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <Input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="tu@empresa.com" 
                className="h-16 text-lg bg-background/50 border-border text-foreground placeholder:text-muted-foreground rounded-2xl px-6 focus-visible:ring-primary md:w-1/3"
                required
                disabled={isLoading}
              />
              <Input 
                value={pain}
                onChange={(e) => setPain(e.target.value)}
                placeholder="Ej: Necesito conectar Shopify con SAP, o quiero una web nueva..." 
                className="h-16 text-lg bg-background/50 border-border text-foreground placeholder:text-muted-foreground rounded-2xl px-6 focus-visible:ring-primary md:w-2/3"
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
              <Button 
                type="button"
                onClick={() => window.open(`https://wa.me/14355348065?text=${encodeURIComponent("Hola, me interesa transformar mi negocio con B3TA")}`, '_blank')}
                className="w-full sm:w-auto h-16 px-8 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-bold text-base rounded-2xl border border-[#25D366]/20 transition-all"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Escribir por WhatsApp
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto h-16 px-10 bg-primary hover:bg-primary-glow text-primary-foreground font-black text-lg rounded-2xl cta-glow transition-all hover:scale-105 cursor-pointer"
              >
                {isLoading ? "ENVIANDO..." : "ENVIAR"}
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground font-medium text-center">
              Tu informacion es confidencial. Te respondemos por correo.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};
