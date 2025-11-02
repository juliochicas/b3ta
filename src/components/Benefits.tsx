import { Card } from "@/components/ui/card";
import { Shield, Zap, Users, TrendingUp, Clock, Award } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Seguridad Enterprise",
    description: "ISO 27001, SOC 2, GDPR compliant. Tus datos protegidos con los más altos estándares.",
    metric: "99.9% uptime"
  },
  {
    icon: Zap,
    title: "Implementación Rápida",
    description: "Metodología ágil probada en +250 proyectos. De consulta a producción en semanas, no meses.",
    metric: "4-12 semanas"
  },
  {
    icon: Users,
    title: "Equipo Senior",
    description: "100% ingenieros senior con +8 años de experiencia. No junior developers en tu proyecto.",
    metric: "+8 años exp."
  },
  {
    icon: TrendingUp,
    title: "ROI Garantizado",
    description: "Proyectos diseñados para retorno positivo. Promedio de ROI 300% en el primer año.",
    metric: "300% ROI avg"
  },
  {
    icon: Clock,
    title: "Soporte 24/7",
    description: "Equipo disponible en tu timezone. SLA de respuesta < 24 horas garantizado.",
    metric: "<24h response"
  },
  {
    icon: Award,
    title: "Metodología Probada",
    description: "Proceso estructurado con fases de validación y aprobación en cada etapa del desarrollo.",
    metric: "Calidad garantizada"
  }
];

export const Benefits = () => {
  return (
    <section className="py-28 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Por qué Elegir B3TA
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No somos una agencia más. Somos tu partner tecnológico de largo plazo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, idx) => (
            <Card 
              key={idx}
              className="p-8 hover:shadow-2xl transition-all duration-300 border-border bg-card group cursor-pointer hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <benefit.icon className="h-8 w-8 text-primary-foreground" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">
                {benefit.title}
              </h3>

              <p className="text-muted-foreground mb-4 leading-relaxed">
                {benefit.description}
              </p>

              <div className="pt-4 border-t border-border">
                <span className="text-2xl font-bold text-secondary">{benefit.metric}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="p-12 bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0 shadow-2xl">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">Proceso Profesional Sin Sorpresas</h3>
              <p className="text-xl opacity-90 mb-6">
                Minimizamos riesgos a través de nuestro proceso estructurado: análisis detallado, ingeniería planificada, 
                desarrollo evolutivo y fases de aprobación en cada etapa del proyecto.
              </p>
              <div className="flex items-center justify-center gap-8 text-sm flex-wrap">
                <div>✓ Análisis previo completo</div>
                <div>✓ Fases de aprobación</div>
                <div>✓ Validación continua</div>
                <div>✓ Desarrollo iterativo</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};