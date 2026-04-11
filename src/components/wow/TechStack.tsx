import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export const TechStack = () => {
  const stack = [
    { title: "DESARROLLO", tech: "Shopify, WordPress, Web POS, Next.js" },
    { title: "AUTOMATIZACIÓN", tech: "n8n, Make, Zapier Enterprise" },
    { title: "SISTEMAS", tech: "SAP B1, Modularis.pro (CRM/ERP)" },
    { title: "INTELIGENCIA IA", tech: "Claude Projects, OpenAI, Groq, Ollama" },
    { title: "ANALÍTICA", tech: "Custom dashboards + Power BI" },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-b border-border/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest bg-secondary/10 text-secondary mb-4 inline-block uppercase ring-1 ring-secondary/30">
            Tecnologias que usamos
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground">
            Nuestro <span className="text-primary">stack tecnico</span>
          </h2>
        </div>

        {/* Horizontal Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-border/50">
            {stack.map((phase, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="pt-6 md:pt-0 pb-6 md:pb-0 px-4 group"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors border border-primary/20 shadow-glow">
                  <span className="font-black text-primary text-xl">
                    {idx + 1}
                  </span>
                </div>
                
                <h4 className="text-sm font-bold text-muted-foreground tracking-widest mb-3 uppercase group-hover:text-foreground transition-colors">
                  FASE {idx + 1}: {phase.title}
                </h4>
                
                <p className="text-base font-medium text-foreground">
                  {phase.tech}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
