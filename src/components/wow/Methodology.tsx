import { motion } from "framer-motion";
import { Search, PenTool, Rocket, RefreshCw } from "lucide-react";

export const Methodology = () => {
  const steps = [
    {
      num: "1",
      title: "DIAGNÓSTICO (Gratis)",
      desc: "Descubre tus cuellos de botella.",
      icon: Search,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      num: "2",
      title: "DISEÑO",
      desc: "Arquitectamos tu solución ideal.",
      icon: PenTool,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      num: "3",
      title: "IMPLEMENTACIÓN",
      desc: "Construimos software que trabaja por ti.",
      icon: Rocket,
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      num: "4",
      title: "OPTIMIZACIÓN",
      desc: "Escalamos tus resultados con IA.",
      icon: RefreshCw,
      color: "text-accent",
      bg: "bg-accent/10"
    }
  ];

  return (
    <section id="proceso" className="py-32 bg-card relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Nuestra Metodología
          </h2>
          <p className="text-xl text-muted-foreground">
            No improvisamos. Aplicamos ingeniería operativa pura.
          </p>
        </div>

        <div className="space-y-12 relative">
          {/* Vertical Line Connector (hidden on mobile) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-primary/50 via-secondary/50 to-accent/50 -translate-x-1/2" />
          
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              
              <motion.div 
                className="flex-1 w-full"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div className={`p-8 rounded-3xl bg-background border border-border/50 hover:border-primary/50 transition-colors shadow-lg relative group overflow-hidden ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  
                  {/* Subtle Background Icon */}
                  <step.icon className={`absolute opacity-5 h-48 w-48 ${index % 2 === 0 ? '-left-10' : '-right-10'} top-1/2 -translate-y-1/2 ${step.color} transition-transform group-hover:scale-110`} />
                  
                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-muted text-muted-foreground mb-4">
                      FASE {step.num}
                    </span>
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Center Dot */}
              <div className="hidden md:flex flex-shrink-0 w-16 h-16 rounded-full bg-background border-4 border-card items-center justify-center relative z-10 shadow-neon">
                <div className={`w-10 h-10 rounded-full ${step.bg} flex items-center justify-center`}>
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>
              </div>

              {/* Spacer matching */}
              <div className="hidden md:block flex-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
