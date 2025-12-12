import { Card } from "@/components/ui/card";
import { MessageCircle, Search, Wrench, Rocket } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: MessageCircle,
    title: "Cuéntanos tu problema",
    description: "Usa nuestra IA o agenda una llamada. Sin compromiso.",
    time: "5 min"
  },
  {
    number: "2",
    icon: Search,
    title: "Analizamos tu situación",
    description: "Te damos un diagnóstico claro y opciones concretas.",
    time: "24-48h"
  },
  {
    number: "3",
    icon: Wrench,
    title: "Construimos la solución",
    description: "Desarrollo ágil con validaciones en cada paso.",
    time: "2-12 semanas"
  },
  {
    number: "4",
    icon: Rocket,
    title: "Lanzamos y crecemos",
    description: "Soporte continuo. Tu éxito es nuestro éxito.",
    time: "Continuo"
  }
];

export const ProcessSimple = () => {
  const scrollToAI = () => {
    document.getElementById('ai-consultant')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Así de Simple
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            4 pasos. Sin letra pequeña. Sin sorpresas.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-primary/30" />
              )}
              
              <Card className="p-6 border border-border hover:border-primary/50 transition-all duration-300 bg-card relative z-10">
                {/* Number badge */}
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4">
                  {step.number}
                </div>

                <step.icon className="h-8 w-8 text-primary mb-4" />
                
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {step.description}
                </p>
                
                <div className="text-xs text-primary font-medium">
                  ⏱ {step.time}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button 
            onClick={scrollToAI}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold inline-flex items-center gap-2 shadow-lg"
          >
            <MessageCircle className="h-5 w-5" />
            Empezar Ahora (Gratis)
          </button>
        </div>
      </div>
    </section>
  );
};
