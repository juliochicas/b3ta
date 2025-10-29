import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap, Rocket, Building2 } from "lucide-react";

const plans = [
  {
    icon: Zap,
    name: "Starter",
    tagline: "Para PyMEs que inician",
    price: "$15K - $35K",
    duration: "4-8 semanas",
    description: "Automatización básica o e-commerce funcional",
    features: [
      "Consultoría inicial incluida",
      "1 servicio principal (n8n o Shopify básico)",
      "Hasta 3 integraciones",
      "Capacitación del equipo (4 horas)",
      "1 mes de soporte post go-live",
      "Documentación técnica",
      "SLA respuesta 24 horas"
    ],
    cta: "Solicitar Cotización",
    popular: false
  },
  {
    icon: Rocket,
    name: "Professional",
    tagline: "Para empresas en crecimiento",
    price: "$35K - $120K",
    duration: "8-12 semanas",
    description: "Soluciones SAP o automatización avanzada con IA",
    features: [
      "Todo en Starter +",
      "SAP S/4HANA o Shopify Plus",
      "Automatización con IA (copilots)",
      "Integraciones ilimitadas",
      "Capacitación extendida (12 horas)",
      "3 meses de soporte 24/7",
      "SLA respuesta 4 horas",
      "1 feature request/mes incluido",
      "Arquitectura escalable"
    ],
    cta: "Plan Más Popular",
    popular: true
  },
  {
    icon: Building2,
    name: "Enterprise",
    tagline: "Para corporativos",
    price: "$120K+",
    duration: "12-24 semanas",
    description: "Transformación digital completa end-to-end",
    features: [
      "Todo en Professional +",
      "Arquitectura multi-cloud",
      "IA custom con LLMs fine-tuned",
      "Equipo dedicado full-time",
      "Account manager exclusivo",
      "6 meses soporte premium 24/7",
      "SLA respuesta 1 hora",
      "Features ilimitados",
      "Auditorías de seguridad trimestrales",
      "ROI tracking dashboard",
      "Consultoría estratégica mensual"
    ],
    cta: "Contactar para Demo",
    popular: false
  }
];

export const Pricing = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Precios Transparentes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sin letra pequeña. Sin costos ocultos. Sin sorpresas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, idx) => (
            <Card 
              key={idx}
              className={`p-8 ${plan.popular ? 'border-2 border-primary shadow-2xl scale-105 relative' : 'border-border'} hover:shadow-xl transition-all duration-300 bg-card`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-bold px-4 py-1 rounded-full">
                    MÁS POPULAR
                  </span>
                </div>
              )}

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
                <plan.icon className="h-7 w-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-2">
                {plan.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.tagline}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">{plan.price}</span>
                <p className="text-sm text-muted-foreground mt-2">
                  Duración: {plan.duration}
                </p>
              </div>

              <p className="text-muted-foreground mb-6 pb-6 border-b border-border">
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={scrollToContact}
                variant={plan.popular ? "default" : "outline"}
                className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                size="lg"
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="inline-block p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <p className="text-lg text-foreground mb-4">
              <span className="font-bold">¿Proyecto custom?</span> Todos nuestros planes se adaptan a tus necesidades específicas.
            </p>
            <Button variant="outline" size="lg" onClick={scrollToContact}>
              Solicitar Propuesta Personalizada
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};