import { Card } from "@/components/ui/card";
import { Shield, Award, Zap, Users } from "lucide-react";
import trustBadges from "@/assets/trust-badges.png";

const badges = [
  {
    icon: Shield,
    title: "ISO 27001",
    subtitle: "Certificado"
  },
  {
    icon: Award,
    title: "SAP Partner",
    subtitle: "Silver"
  },
  {
    icon: Zap,
    title: "Shopify Plus",
    subtitle: "Partner"
  },
  {
    icon: Users,
    title: "+180 Clientes",
    subtitle: "12 Países"
  }
];

const clients = [
  "RetailCorp", "FinancePlus", "MegaRetail", "HealthTech", 
  "LogisticsPro", "TechSolutions", "GlobalTrade", "InnovateNow"
];

export const TrustBadges = () => {
  return (
    <section className="py-20 bg-background border-y border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
            Empresas que confían en B3TA
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
          {badges.map((badge, idx) => (
            <Card 
              key={idx}
              className="p-6 text-center hover:shadow-lg transition-all duration-300 border-border bg-card group cursor-pointer"
            >
              <badge.icon className="h-10 w-10 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-foreground">{badge.title}</h4>
              <p className="text-sm text-muted-foreground">{badge.subtitle}</p>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <img 
            src={trustBadges} 
            alt="Certificaciones y Partners"
            className="w-full rounded-2xl shadow-lg"
          />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {clients.map((client, idx) => (
              <div 
                key={idx}
                className="p-6 bg-muted/50 rounded-xl text-center hover:bg-muted transition-colors"
              >
                <p className="font-semibold text-foreground">{client}</p>
                <p className="text-xs text-muted-foreground mt-1">Cliente desde 2023</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Auditados y certificados por entidades internacionales • Cumplimiento GDPR y SOC 2 Type II
          </p>
        </div>
      </div>
    </section>
  );
};