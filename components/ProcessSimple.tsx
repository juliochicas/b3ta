"use client";

import { MessageSquare, Search, Rocket, Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Cuéntanos Tu Reto",
    description: "Habla con nuestra IA o agenda una llamada. Sin compromiso.",
    color: "from-orange-500 to-rose-500"
  },
  {
    number: "02",
    icon: Search,
    title: "Diseñamos La Solución",
    description: "Te presentamos opciones claras con tiempos y costos reales.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    number: "03",
    icon: Rocket,
    title: "Implementamos",
    description: "Nuestro equipo ejecuta mientras tú te enfocas en tu negocio.",
    color: "from-violet-500 to-purple-500"
  },
  {
    number: "04",
    icon: Headphones,
    title: "Te Acompañamos",
    description: "Soporte continuo y optimización. Crecemos juntos.",
    color: "from-emerald-500 to-teal-500"
  }
];

export const ProcessSimple = () => {
  const scrollToAI = () => {
    document.getElementById('ai-consultant')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-secondary/10 text-secondary mb-6">
            Proceso Simple
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Así <span className="gradient-text">Trabajamos</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            De la idea al resultado en 4 pasos claros
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="group relative"
            >
              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}
              
              <div className="relative text-center space-y-6">
                {/* Number Badge */}
                <div className="relative inline-block">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={scrollToAI}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-10 py-7 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
          >
            Empezar Ahora
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Sin compromiso • Respuesta en menos de 24h
          </p>
        </div>
      </div>
    </section>
  );
};
