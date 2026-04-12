import { ArrowRight, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const inputClass = "w-full h-12 px-4 bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50";

export const FinalCTA = () => {
  const [pain, setPain] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string | undefined>("");
  const [country, setCountry] = useState<string>("GT");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pain.trim() || !email.trim()) return;

    if (phone && !isValidPhoneNumber(phone)) {
      toast({
        title: "Numero invalido",
        description: "Revisa el numero de telefono.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const countryName = country || "Desconocido";

      const { error } = await supabase.from("leads_b3ta").insert([
        {
          email: email.trim(),
          phone: phone || null,
          message: `[Pais: ${countryName}] ${pain.trim()}`,
          status: "new",
          priority: "medium",
          name: email.split("@")[0],
        },
      ]);

      if (error) throw error;

      await supabase.functions.invoke("send-lead-notifications", {
        body: {
          email: email.trim(),
          name: email.split("@")[0],
          message: `Tel: ${phone || "No proporcionado"} (${countryName})\n${pain.trim()}`,
        },
      });

      toast({
        title: "Mensaje enviado",
        description: "Te respondemos en menos de 24 horas.",
      });

      setPain("");
      setEmail("");
      setPhone("");
    } catch (err: any) {
      toast({
        title: "Error al enviar",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 max-w-xl text-center">
        <p className="text-sm font-semibold text-blue-400 mb-3 uppercase tracking-wider">Contacto</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Desafíanos con tu proyecto
        </h2>
        <p className="text-base text-slate-300 mb-10">
          Algo sencillo o algo que nadie ha podido resolver — cuentanos. Te respondemos en menos de 24 horas.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="tu@empresa.com"
            className={inputClass}
            required
            disabled={isLoading}
          />
          <div className="phone-input-dark">
            <PhoneInput
              international
              defaultCountry="GT"
              value={phone}
              onChange={(value) => setPhone(value)}
              onCountryChange={(c) => setCountry(c || "GT")}
              disabled={isLoading}
              placeholder="Numero de telefono"
              className="h-12 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 focus-within:border-blue-500"
            />
          </div>
          <input
            value={pain}
            onChange={(e) => setPain(e.target.value)}
            placeholder="Ej: Necesito una pagina web para mi negocio..."
            className={inputClass}
            required
            disabled={isLoading}
          />
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 inline-flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-500 font-semibold rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Enviando..." : "Enviar mensaje"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                window.open(
                  "https://wa.me/14355348065?text=" +
                    encodeURIComponent("Hola, me interesa un proyecto con B3TA"),
                  "_blank"
                )
              }
              className="h-12 inline-flex items-center justify-center gap-2 border border-slate-600 text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors px-6"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </button>
          </div>
        </form>

        <p className="text-xs text-slate-500 mt-6">
          Sin compromiso. Tu informacion es confidencial.
        </p>
      </div>
    </section>
  );
};
