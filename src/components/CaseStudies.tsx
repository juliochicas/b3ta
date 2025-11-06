import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, Target } from "lucide-react";
import caseStudiesBg from "@/assets/case-studies-bg.jpg";
import { OptimizedImage } from "./OptimizedImage";

const cases = [
  {
    company: "Grupo Industrial LATAM",
    industry: "Manufactura",
    challenge: "Procesos manuales y desconectados en operación multi-país",
    solution: "Implementación SAP Business One HANA + Automatización RPA",
    results: [
      { icon: TrendingUp, metric: "300%", label: "Aumento en eficiencia operativa" },
      { icon: Clock, metric: "70%", label: "Reducción en tiempo de reportes" },
      { icon: Users, metric: "50K+", label: "Transacciones mensuales procesadas" }
    ],
    tags: ["SAP", "Automatización", "ERP"],
    testimonial: "B3TA transformó completamente nuestra operación. El ROI fue visible en los primeros 3 meses."
  },
  {
    company: "E-Commerce Fashion Co.",
    industry: "Retail & E-commerce",
    challenge: "Bajo tráfico orgánico y conversión estancada en Shopify",
    solution: "Shopify Plus migration + Growth Hacking + Marketing 360°",
    results: [
      { icon: TrendingUp, metric: "450%", label: "Incremento en ventas online" },
      { icon: Target, metric: "8.5%", label: "Tasa de conversión" },
      { icon: Users, metric: "200K+", label: "Visitantes mensuales" }
    ],
    tags: ["E-commerce", "Marketing Digital", "Shopify Plus"],
    testimonial: "Pasamos de vender $50K a $225K mensuales. El equipo de B3TA es increíble."
  },
  {
    company: "Tech Startup LATAM",
    industry: "SaaS & Tecnología",
    challenge: "Procesos operativos manuales frenando escalamiento",
    solution: "Automatización n8n + IA Corporativa + Workflows inteligentes",
    results: [
      { icon: Clock, metric: "85%", label: "Reducción en tareas manuales" },
      { icon: TrendingUp, metric: "$120K", label: "Ahorro anual en operaciones" },
      { icon: Users, metric: "500+", label: "Clientes atendidos sin escalar equipo" }
    ],
    tags: ["Automatización", "IA", "Workflows"],
    testimonial: "La automatización nos permitió escalar sin contratar más personal. Game changer total."
  }
];

export const CaseStudies = () => {
  return (
    <section className="py-28 relative">
      {/* Background Image with Overlay - Optimized */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={caseStudiesBg}
          alt=""
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-20">
          <Badge className="mb-4" variant="outline">Casos de Éxito</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Resultados Reales, Clientes Satisfechos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empresas que confiaron en B3TA y transformaron su operación con resultados medibles
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {cases.map((caseStudy, index) => (
            <Card 
              key={caseStudy.company}
              className="p-8 hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 bg-card animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-foreground">{caseStudy.company}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{caseStudy.industry}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {caseStudy.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Desafío:</p>
                  <p className="text-sm text-muted-foreground">{caseStudy.challenge}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Solución:</p>
                  <p className="text-sm text-muted-foreground">{caseStudy.solution}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6 mb-6">
                <p className="text-sm font-semibold text-foreground mb-4">Resultados:</p>
                <div className="space-y-4">
                  {caseStudy.results.map((result, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <result.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{result.metric}</p>
                        <p className="text-xs text-muted-foreground">{result.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-sm italic text-muted-foreground">
                  "{caseStudy.testimonial}"
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => {
              const contactElement = document.getElementById('contact');
              contactElement?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Ver Más Casos de Éxito
          </button>
        </div>
      </div>
    </section>
  );
};
