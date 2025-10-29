import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Search, Code, Rocket, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Calendar,
    title: "Consultoría Gratuita",
    description: "Sesión de 60 minutos para entender tus necesidades. Análisis de pain points y oportunidades.",
    duration: "Día 1",
    deliverable: "Diagnóstico inicial + Roadmap preliminar"
  },
  {
    number: "02",
    icon: Search,
    title: "Análisis & Propuesta",
    description: "Deep dive técnico. Arquitectura, stack, integraciones y estimaciones detalladas con ROI proyectado.",
    duration: "Días 2-5",
    deliverable: "Propuesta técnica + Pricing + Cronograma"
  },
  {
    number: "03",
    icon: Code,
    title: "Implementación Ágil",
    description: "Sprints de 2 semanas con demos continuas. Metodología SCRUM, daily standups, 100% transparencia.",
    duration: "4-12 semanas",
    deliverable: "Solución funcional + Testing + QA"
  },
  {
    number: "04",
    icon: Rocket,
    title: "Go-Live & Soporte",
    description: "Despliegue sin downtime. Capacitación del equipo. Soporte 24/7 por 3 meses incluido.",
    duration: "Día del lanzamiento",
    deliverable: "Sistema productivo + Documentación + Capacitación"
  }
];

export const ProcessSteps = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-28 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDAsMCwwLDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-40" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Proceso 100% Transparente
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            De la primera llamada al go-live. Sin sorpresas, con resultados garantizados.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-border bg-card group cursor-pointer">
                  <div className="absolute -top-6 left-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <step.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>

                  <div className="text-6xl font-bold text-primary/10 mb-4 mt-4">
                    {step.number}
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {step.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Duración:</span>
                      <span className="text-xs font-semibold text-secondary">{step.duration}</span>
                    </div>
                    <div className="pt-2">
                      <span className="text-xs text-muted-foreground">Entregable:</span>
                      <p className="text-xs font-medium text-foreground mt-1">{step.deliverable}</p>
                    </div>
                  </div>
                </Card>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 -right-4 z-20">
                    <ArrowRight className="h-8 w-8 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            onClick={scrollToContact}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
          >
            Comenzar Ahora - Primera Consulta Gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Sin compromiso • Respuesta en menos de 24 horas
          </p>
        </div>
      </div>
    </section>
  );
};