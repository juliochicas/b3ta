import { Card } from "@/components/ui/card";
import { Database, ShoppingCart, Zap, Brain, Globe, Package } from "lucide-react";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { useNavigate } from "react-router-dom";

const services = [
  {
    icon: Globe,
    title: "Desarrollo Web",
    description: "Sitios web profesionales, landing pages y portales corporativos. Perfecto para comenzar tu presencia digital",
    features: ["Landing Pages", "Sitios Corporativos", "PWA & Mobile"],
    priceUSD: 100
  },
  {
    icon: ShoppingCart,
    title: "E-commerce & Marketing Digital",
    description: "Shopify, Shopify Plus, estrategias de growth hacking y campañas de alto impacto para maximizar conversiones",
    features: ["Shopify Plus", "Growth Hacking", "Marketing 360°"],
    priceUSD: 500
  },
  {
    icon: Package,
    title: "Importaciones China",
    description: "Gestión integral de importaciones desde China: sourcing, logística, aduanas y calidad garantizada",
    features: ["Sourcing Directo", "Logística Full", "Control Calidad"],
    priceUSD: null
  },
  {
    icon: Zap,
    title: "Automatización Inteligente",
    description: "Workflows con n8n, Make, Zapier y RPA para optimizar procesos y reducir costos operativos",
    features: ["n8n & Make", "Integración API", "Process Mining"],
    priceUSD: 500
  },
  {
    icon: Brain,
    title: "IA Corporativa",
    description: "LLMs personalizados, RAG, agentes autónomos y copilots para transformar tu operación con inteligencia artificial",
    features: ["Custom LLMs", "Sistemas RAG", "AI Agents"],
    priceUSD: 500
  },
  {
    icon: Database,
    title: "SAP Business One",
    description: "Implementación, migración SAP Business One for HANA, optimización y soporte 24/7 para empresas en crecimiento",
    features: ["Migración a HANA", "Desarrollo Custom", "Integración ERP"],
    priceUSD: 15000
  }
];

export const Services = () => {
  const { formatPrice, loading } = useCurrencyConverter();
  const navigate = useNavigate();
  
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 bg-card group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              role="article"
              aria-label={`Servicio de ${service.title}`}
            >
              <div className="mb-6 w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                <service.icon className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{service.description}</p>
              
              <ul className="space-y-2 mb-6" role="list">
                {service.features.map((feature) => (
                  <li key={feature} className="text-sm text-muted-foreground flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => {
                  if (service.title === "Importaciones China") {
                    navigate('/importaciones-china');
                  } else {
                    const contactElement = document.getElementById('contact');
                    contactElement?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full mt-auto py-2 px-4 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary transition-colors text-sm font-bold"
              >
                {service.title === "Importaciones China"
                  ? "Ver Servicios Completos →"
                  : service.priceUSD === null 
                    ? "Sin Inversión Inicial"
                    : loading 
                      ? "..." 
                      : `Desde ${formatPrice(service.priceUSD)}`
                }
              </button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};