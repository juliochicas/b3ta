import { Button } from "@/components/ui/button";
import { Check, Zap, Code2, ArrowRight, Bot } from "lucide-react";
import { motion } from "framer-motion";

export const PricingSection = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-24 relative overflow-hidden bg-background" id="precios">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full filter blur-[100px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-6"
          >
            Que incluye y <span className="gradient-text">cuanto cuesta.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Precio fijo por proyecto, sin cargos por hora ni letras chiquitas. Sabes exactamente que vas a recibir.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Tier 1: Websites */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 lg:p-10 border border-border/50 hover:border-primary/50 transition-all duration-300 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Web de Conversión</h3>
              <p className="text-muted-foreground mb-6 h-12">Sitio web profesional que carga rapido, se ve bien en celular y esta hecho para generar contactos.</p>
              
              <div className="mb-8">
                <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Desde</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black">$500</span>
                  <span className="text-muted-foreground">USD</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Diseño moderno y de alto impacto (WOW Effect)",
                  "Desarrollo ágil en WordPress o código limpio",
                  "Optimización extrema de velocidad (LCP < 1.5s)",
                  "Integración con WhatsApp y formularios",
                  "SEO Técnico base incluido",
                  "Lista para escalar y vender"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button onClick={scrollToContact} className="w-full group" variant="outline">
                Comenzar Proyecto
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>

          {/* Tier 2: Apps / Custom */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 lg:p-10 border-2 border-secondary relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
              Más Solicitado
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="h-14 w-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                <Code2 className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Plataforma / App a Medida</h3>
              <p className="text-muted-foreground mb-6 h-12">Tu propio sistema web: panel de control, CRM o plataforma a medida con login y roles.</p>
              
              <div className="mb-8">
                <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Desde</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black">$650</span>
                  <span className="text-muted-foreground">USD</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Arquitectura React/NextJS + Supabase",
                  "Autenticación segura (Login/Roles)",
                  "Paneles de administración y dashboards",
                  "Automatización de base de datos y flujos",
                  "Integraciones vía API (Pagos, ERPs, IA)",
                  "Código nativo, de tu propiedad"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button onClick={scrollToContact} className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground group">
                Automatizar mi negocio
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>

          {/* Tier 3: Automations */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 lg:p-10 border border-border/50 hover:border-primary/50 transition-all duration-300 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Bot className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Automatización (IA)</h3>
              <p className="text-muted-foreground mb-6 h-12">Integraciones entre SAP, Shopify, WhatsApp y bots de IA para tu operacion diaria.</p>
              
              <div className="mb-8">
                <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Desde</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black">$1k</span>
                  <span className="text-muted-foreground">USD</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Integración SAP Business One / ERPs",
                  "Agentes Inteligentes de Ventas 24/7",
                  "Automatización n8n / Flujos complejos",
                  "Conexión WhatsApp API y Omnicanalidad",
                  "Reportería Dinámica y Dashboards",
                  "Soporte y ajustes post-lanzamiento"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button onClick={scrollToContact} className="w-full group" variant="outline">
                Consultar Viabilidad
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
