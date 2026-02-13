import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import partnersBg from "@/assets/partners-bg.jpg";
import { OptimizedImage } from "./OptimizedImage";

const partners = [
  { name: "Vercel", type: "Technology Partner", logo: "Vercel" },
  { name: "Shopify", type: "Partner", logo: "Shopify" },
  { name: "Make", type: "Automation Partner", logo: "Make" },
  { name: "n8n", type: "Integration Partner", logo: "n8n" },
  { name: "OpenAI", type: "AI Partner", logo: "OpenAI" },
  { name: "Anthropic", type: "AI Partner", logo: "Anthropic" }
];

export const PartnersSection = () => {
  return (
    <section className="py-28 relative">
      {/* Background Image with Overlay - Optimized */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={partnersBg}
          alt=""
          className="w-full h-full object-cover opacity-5"
        />
      </div>
      <div className="absolute inset-0 bg-background" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Partners */}
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="outline">Partners Tecnológicos</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Respaldados por los Mejores
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Colaboramos con líderes tecnológicos para garantizar soluciones de clase mundial
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto mb-20">
          {partners.map((partner, index) => (
            <Card 
              key={partner.name}
              className="p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 bg-card group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-full aspect-square flex items-center justify-center mb-3">
                <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform">
                  {partner.logo}
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground">{partner.type}</p>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <Card className="mt-20 p-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">250+</p>
              <p className="text-muted-foreground">Proyectos Completados</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">180+</p>
              <p className="text-muted-foreground">Clientes Activos</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">12</p>
              <p className="text-muted-foreground">Países LATAM</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">99.9%</p>
              <p className="text-muted-foreground">Uptime SLA</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
