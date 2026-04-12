import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
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
      const { error } = await supabase.from("leads_b3ta").insert([
        {
          email: email.trim(),
          message: pain.trim(),
          status: "new",
          priority: "medium",
          name: email.split("@")[0],
        },
      ]);

      if (error) throw error;

      await supabase.functions.invoke("send-lead-notifications", {
        body: { email: email.trim(), name: email.split("@")[0], message: pain.trim() },
      });

      toast({
        title: "Mensaje enviado",
        description: "Te respondemos en menos de 24 horas.",
      });

      setPain("");
      setEmail("");
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
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="tu@empresa.com"
            className="h-12 bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 rounded-lg focus:border-blue-500 focus:ring-blue-500/20"
            required
            disabled={isLoading}
          />
          <Input
            value={pain}
            onChange={(e) => setPain(e.target.value)}
            placeholder="Ej: Necesito una pagina web para mi negocio..."
            className="h-12 bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 rounded-lg focus:border-blue-500 focus:ring-blue-500/20"
            required
            disabled={isLoading}
          />
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg"
            >
              {isLoading ? "Enviando..." : "Enviar mensaje"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() =>
                window.open(
                  "https://wa.me/14355348065?text=" +
                    encodeURIComponent("Hola, me interesa un proyecto con B3TA"),
                  "_blank"
                )
              }
              variant="outline"
              className="h-12 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </form>

        <p className="text-xs text-slate-500 mt-6">
          Sin compromiso. Tu informacion es confidencial.
        </p>
      </div>
    </section>
  );
};
