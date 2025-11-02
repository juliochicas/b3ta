import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Zap, Building2, Check } from "lucide-react";

const tiers = [
  {
    icon: Rocket,
    name: "Emprendedor",
    budget: "Desde $2,000",
    tagline: "Perfecto para iniciar",
    color: "from-green-500/20 to-emerald-500/5",
    solutions: [
      {
        name: "Sitio Web Profesional",
        description: "Landing page + Blog + SEO básico",
        time: "2-3 semanas"
      },
      {
        name: "E-commerce Básico",
        description: "Shopify estándar + 50 productos",
        time: "3-4 semanas"
      },
      {
        name: "Importaciones China",
        description: "Sourcing + Logística básica",
        time: "Continuo"
      }
    ],
    cta: "Comenzar Ahora",
    popular: false
  },
  {
    icon: Zap,
    name: "Crecimiento",
    budget: "$8,000 - $25,000",
    tagline: "Para empresas en expansión",
    color: "from-cyan-500/20 to-blue-500/5",
    solutions: [
      {
        name: "Shopify Plus",
        description: "E-commerce enterprise + automatizaciones",
        time: "6-8 semanas"
      },
      {
        name: "Automatización n8n/Make",
        description: "Workflows inteligentes + integraciones",
        time: "4-6 semanas"
      },
      {
        name: "IA para Ventas",
        description: "Chatbots + asistentes personalizados",
        time: "4-5 semanas"
      },
      {
        name: "Marketing Digital 360°",
        description: "Campañas + SEO avanzado + Growth",
        time: "Continuo"
      }
    ],
    cta: "Cotizar Proyecto",
    popular: true
  },
  {
    icon: Building2,
    name: "Enterprise",
    budget: "$50,000+",
    tagline: "Transformación completa",
    color: "from-purple-500/20 to-indigo-500/5",
    solutions: [
      {
        name: "SAP Business One HANA",
        description: "Implementación completa + migraciones",
        time: "3-6 meses"
      },
      {
        name: "IA Corporativa Avanzada",
        description: "LLMs custom + RAG + Agentes",
        time: "2-4 meses"
      },
      {
        name: "Desarrollo SaaS",
        description: "Plataformas a medida + infraestructura",
        time: "4-8 meses"
      },
      {
        name: "Consultoría Estratégica",
        description: "Roadmap tecnológico + mentoring",
        time: "Continuo"
      }
    ],
    cta: "Agendar Reunión",
    popular: false
  }
];

export const SolutionsByBudget = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-28 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-20">
          <Badge className="mb-4" variant="outline">Soluciones para Todos</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Desde Emprendedores hasta Enterprise
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            No necesitas SAP para comenzar. Tenemos soluciones tecnológicas profesionales para cada etapa de tu negocio.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier, index) => (
            <Card 
              key={tier.name}
              className={`relative p-8 hover:shadow-xl transition-all duration-300 border-2 ${
                tier.popular ? 'border-primary shadow-lg scale-105' : 'border-border'
              } bg-card animate-fade-in overflow-hidden`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-bold rounded-bl-lg">
                  MÁS POPULAR
                </div>
              )}

              <div className={`mb-6 w-16 h-16 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                <tier.icon className="h-8 w-8 text-primary" />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{tier.tagline}</p>
              
              <div className="mb-6 pb-6 border-b border-border">
                <p className="text-3xl font-bold text-primary">{tier.budget}</p>
              </div>

              <div className="space-y-4 mb-8">
                {tier.solutions.map((solution, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm">{solution.name}</p>
                        <p className="text-xs text-muted-foreground">{solution.description}</p>
                        <p className="text-xs text-primary mt-1">⏱ {solution.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={scrollToContact}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  tier.popular 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl' 
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                {tier.cta}
              </button>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              ¿No sabes por dónde empezar?
            </h3>
            <p className="text-muted-foreground mb-6">
              Agenda una consultoría gratuita de 30 minutos y te ayudamos a definir la mejor solución para tu negocio.
            </p>
            <button 
              onClick={scrollToContact}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold inline-flex items-center gap-2"
            >
              <Rocket className="h-5 w-5" />
              Consultoría Gratuita
            </button>
          </Card>
        </div>
      </div>
    </section>
  );
};
