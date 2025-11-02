import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Award, Shield, Zap } from "lucide-react";

const partners = [
  { name: "SAP", type: "Technology Partner", logo: "SAP" },
  { name: "Shopify", type: "Partner", logo: "Shopify" },
  { name: "Make", type: "Automation Partner", logo: "Make" },
  { name: "n8n", type: "Integration Partner", logo: "n8n" },
  { name: "OpenAI", type: "AI Partner", logo: "OpenAI" },
  { name: "Anthropic", type: "AI Partner", logo: "Anthropic" }
];

const certifications = [
  {
    icon: Award,
    title: "SAP Certified Partner",
    description: "Implementaciones certificadas SAP Business One"
  },
  {
    icon: CheckCircle2,
    title: "Shopify Plus Partner",
    description: "Expertos certificados en e-commerce enterprise"
  },
  {
    icon: Shield,
    title: "ISO 27001 Compliant",
    description: "Seguridad de la información garantizada"
  },
  {
    icon: Zap,
    title: "Automation Experts",
    description: "Certificados en n8n, Make y Zapier"
  }
];

export const PartnersSection = () => {
  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Partners */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">Partners Tecnológicos</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Respaldados por los Mejores
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Colaboramos con líderes tecnológicos para garantizar soluciones de clase mundial
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
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
        </div>

        {/* Certifications */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Certificaciones & Reconocimientos
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {certifications.map((cert, index) => (
              <Card 
                key={cert.title}
                className="p-6 text-center hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 bg-card group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                  <cert.icon className="h-7 w-7 text-primary" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">{cert.title}</h4>
                <p className="text-sm text-muted-foreground">{cert.description}</p>
              </Card>
            ))}
          </div>
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
