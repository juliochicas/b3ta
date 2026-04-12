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
    <section id="contact" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Platicanos tu proyecto
        </h2>
        <p className="text-lg text-zinc-400 mb-10">
          Cuentanos que necesitas. Te respondemos en menos de 24 horas con una cotizacion clara.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="tu@empresa.com"
            className="h-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 rounded-lg"
            required
            disabled={isLoading}
          />
          <Input
            value={pain}
            onChange={(e) => setPain(e.target.value)}
            placeholder="Ej: Necesito una pagina web para mi negocio..."
            className="h-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 rounded-lg"
            required
            disabled={isLoading}
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 bg-white text-zinc-900 hover:bg-zinc-200 font-semibold rounded-lg"
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
              className="h-12 border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-lg"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </form>

        <p className="text-xs text-zinc-600 mt-6">
          Sin compromiso. Tu informacion es confidencial.
        </p>
      </div>
    </section>
  );
};
