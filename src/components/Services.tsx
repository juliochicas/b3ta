import { Card } from "@/components/ui/card";
import { Database, ShoppingCart, Zap, Brain } from "lucide-react";

const services = [
  {
    icon: Database,
    title: "SAP Consulting",
    description: "Implementación, migración S/4HANA, optimización y soporte 24/7",
    features: ["S/4HANA Migration", "Custom Development", "Integration"]
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Shopify Plus, arquitectura headless, optimización de conversión",
    features: ["Shopify Plus", "Headless Commerce", "CRO"]
  },
  {
    icon: Zap,
    title: "Automatización",
    description: "Workflows inteligentes con n8n, Make, Zapier y RPA",
    features: ["n8n Workflows", "API Integration", "Process Mining"]
  },
  {
    icon: Brain,
    title: "IA Corporativa",
    description: "LLMs, RAG, agentes autónomos y copilots personalizados",
    features: ["Custom LLMs", "RAG Systems", "AI Agents"]
  }
];

export const Services = () => {
  return (
    <section className="py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Servicios Enterprise
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Soluciones end-to-end para empresas que buscan transformación digital real
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {services.map((service) => (
            <Card 
              key={service.title}
              className="p-6 sm:p-8 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 bg-card group cursor-pointer"
              role="article"
              aria-label={`Servicio de ${service.title}`}
            >
              <div className="mb-6 w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{service.description}</p>
              
              <ul className="space-y-2" role="list">
                {service.features.map((feature) => (
                  <li key={feature} className="text-sm text-muted-foreground flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};