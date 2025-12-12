import { Star, Quote, TrendingUp, Users, Globe, Award } from "lucide-react";

const testimonials = [
  {
    quote: "Pasamos de 0 a $50K/mes en ventas online en 4 meses",
    author: "María García",
    role: "CEO, RetailMX",
    result: "+$50K/mes",
    gradient: "from-orange-500 to-rose-500"
  },
  {
    quote: "Automatizamos el 80% de nuestros procesos manuales",
    author: "Carlos López",
    role: "COO, LogiTech",
    result: "80% menos tiempo",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    quote: "SAP nos permitió escalar de 5 a 50 empleados sin caos",
    author: "Ana Martínez",
    role: "CFO, GrowthCorp",
    result: "10x crecimiento",
    gradient: "from-violet-500 to-purple-500"
  }
];

const stats = [
  { value: "250+", label: "Proyectos", icon: TrendingUp },
  { value: "12", label: "Países LATAM", icon: Globe },
  { value: "180+", label: "Clientes", icon: Users },
  { value: "4.9/5", label: "Rating", icon: Award }
];

export const SocialProofSimple = () => {
  return (
    <section className="py-32 bg-muted/30 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-accent/10 text-accent mb-6">
            Resultados Reales
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            No Promesas, <span className="gradient-text">Resultados</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Lo que dicen empresas como la tuya
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {testimonials.map((testimonial, idx) => (
            <div 
              key={idx}
              className="group relative bg-card rounded-3xl p-8 border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Quote */}
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              <p className="text-lg text-foreground font-medium mb-8 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div>
                  <p className="font-bold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${testimonial.gradient}`}>
                  <span className="text-sm font-bold text-white">{testimonial.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="group text-center p-8 bg-card rounded-3xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
            >
              <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
