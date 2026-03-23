import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowRight, AlertTriangle, X } from "lucide-react";
import { motion } from "framer-motion";

const pains = [
  "Tengo ventas pero mi operación es caos",
  "Cargo pedidos a mano entre Shopify y SAP",
  "No controlo inventarios ni veo mis números",
  "Mi agencia solo me hizo la web y desapareció"
];

const solutions = [
  "Flujos end-to-end: pedido → SAP → logística → reporte",
  "Sincronización automática Shopify ↔ SAP B1",
  "Dashboards operativos en tiempo real",
  "Mejora continua con IA (SEO, precios, abandonos)"
];

export const ProblemSolution = () => {
  return (
    <section id="problema" className="py-32 bg-background relative overflow-hidden text-lg">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            El Problema no son tus Ventas. <br/>
            <span className="text-destructive">Es tu Operación.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-stretch">
          
          {/* PAINS COLUMN */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="md:col-span-4 p-10 md:p-12 rounded-[2rem] bg-card border border-destructive/20 relative overflow-hidden group hover:border-destructive/50 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-destructive/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-8">
                  <AlertTriangle className="w-7 h-7 text-destructive" />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">Vendes mucho, operas lento.</h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Tu negocio crece, pero tu infraestructura colapsa.
                </p>
                <ul className="space-y-4">
                  {[
                    "Pierdes horas en tareas manuales.",
                    "Errores humanos arruinan pedidos.",
                    "Sistemas desconectados frustran a tu equipo."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <X className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                      <span className="text-base font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* SOLUTIONS COLUMN */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="h-full p-10 md:p-12 rounded-[2rem] bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-primary/30 relative overflow-hidden group hover:border-primary/60 transition-colors shadow-glow">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-8">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">Automatiza y Escala sin límites.</h3>
                <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                  Conectamos tu ERP, web y ventas. Opera 24/7 sin sumar nómina.
                </p>
                <ul className="space-y-6">
                  {[
                    "Integra SAP con tu tienda online.",
                    "Delega atención a Agentes de IA.",
                    "Multiplica tu rentabilidad diaria."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        ✓
                      </span>
                      <span className="text-lg font-bold text-foreground pt-0.5">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
