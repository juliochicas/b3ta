import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, MessageCircle, Calendar } from "lucide-react";

interface StrategicCTAProps {
  variant?: "primary" | "secondary" | "consultation";
  title: string;
  description: string;
  ctaText: string;
  icon?: "arrow" | "message" | "calendar";
}

export const StrategicCTA = ({ 
  variant = "primary",
  title,
  description,
  ctaText,
  icon = "arrow"
}: StrategicCTAProps) => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const icons = {
    arrow: ArrowRight,
    message: MessageCircle,
    calendar: Calendar
  };

  const IconComponent = icons[icon];

  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-glow border-primary/50",
    secondary: "bg-gradient-to-r from-secondary/10 to-accent/10 border-secondary/30",
    consultation: "bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30"
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <Card className={`max-w-5xl mx-auto p-8 md:p-12 ${variants[variant]} border-2`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                {title}
              </h3>
              <p className="text-lg text-muted-foreground">
                {description}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button 
                onClick={scrollToContact}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all text-lg px-8 py-6"
              >
                {ctaText}
                <IconComponent className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
