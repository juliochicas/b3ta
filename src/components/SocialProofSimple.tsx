import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Pasamos de 0 a $50K/mes en ventas online en 4 meses",
    author: "María García",
    role: "CEO, RetailMX",
    result: "+$50K/mes"
  },
  {
    quote: "Automatizamos el 80% de nuestros procesos manuales",
    author: "Carlos López",
    role: "COO, LogiTech",
    result: "80% menos tiempo"
  },
  {
    quote: "SAP nos permitió escalar de 5 a 50 empleados sin caos",
    author: "Ana Martínez",
    role: "CFO, GrowthCorp",
    result: "10x crecimiento"
  }
];

const stats = [
  { value: "250+", label: "Proyectos completados" },
  { value: "12", label: "Países en LATAM" },
  { value: "99.9%", label: "Clientes satisfechos" },
  { value: "4.9/5", label: "Rating promedio" }
];

export const SocialProofSimple = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Resultados Reales, No Promesas
          </h2>
          <p className="text-lg text-muted-foreground">
            Lo que dicen empresas como la tuya
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {testimonials.map((testimonial, idx) => (
            <Card 
              key={idx}
              className="p-6 border border-border hover:shadow-lg transition-all duration-300 bg-card"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Quote */}
              <Quote className="h-6 w-6 text-primary/30 mb-2" />
              <p className="text-foreground font-medium mb-4 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
                <div className="px-3 py-1 bg-primary/10 rounded-full">
                  <span className="text-sm font-bold text-primary">{testimonial.result}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="text-center p-6 bg-background rounded-xl border border-border"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
