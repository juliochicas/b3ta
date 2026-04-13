"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const FinalCTA = () => {
  const [pain, setPain] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pain.trim() || !email.trim()) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.from("leads_b3ta").insert([{ email: email.trim(), phone: phone.trim() || null, message: pain.trim(), status: "new", priority: "medium", name: email.split("@")[0] }]);
      if (error) throw error;
      await supabase.functions.invoke("send-lead-notifications", { body: { email: email.trim(), name: email.split("@")[0], message: `Tel: ${phone || "N/A"}\n${pain.trim()}` } });
      toast({ title: "Mensaje enviado", description: "Te respondemos en menos de 24 horas." });
      setPain(""); setEmail(""); setPhone("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  return (
    <section id="contact" className="py-20 bg-teal-800">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Cuentanos que necesitas
        </h2>
        <p className="text-lg text-teal-100 mb-10">
          Algo sencillo como una pagina web, o algo complejo como un sistema completo. Te respondemos en menos de 24 horas.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="tu@empresa.com" className="w-full h-12 px-4 bg-teal-700/50 border border-teal-600 text-white placeholder:text-teal-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" required disabled={isLoading} />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Numero de telefono (opcional)" className="w-full h-12 px-4 bg-teal-700/50 border border-teal-600 text-white placeholder:text-teal-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" disabled={isLoading} />
          <input value={pain} onChange={(e) => setPain(e.target.value)} placeholder="Ej: Quiero mi pagina web, o quiero dejar de usar Excel..." className="w-full h-12 px-4 bg-teal-700/50 border border-teal-600 text-white placeholder:text-teal-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" required disabled={isLoading} />
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button type="submit" disabled={isLoading} className="flex-1 h-12 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold rounded-full cursor-pointer transition-colors disabled:opacity-50">
              {isLoading ? "Enviando..." : "Enviar mensaje"} <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => window.open("https://wa.me/14355348065?text=" + encodeURIComponent("Hola, me interesa un proyecto con B3TA"), "_blank")} className="h-12 inline-flex items-center justify-center gap-2 border border-teal-500 text-white hover:bg-teal-700 rounded-full cursor-pointer transition-colors px-6">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </button>
          </div>
        </form>
        <p className="text-xs text-teal-300 mt-6">Sin compromiso. Tu informacion es confidencial.</p>
      </div>
    </section>
  );
};
