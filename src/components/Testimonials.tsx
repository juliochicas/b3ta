import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";

const testimonials = [
  {
    name: "Carlos Méndez",
    role: "CEO, RetailCorp LATAM",
    company: "E-commerce $45M/año",
    content: "B3TA migró nuestro SAP a Business One for HANA en 4 meses. El ROI fue del 340% en el primer año. Nuestros procesos son 60% más rápidos.",
    rating: 5,
    metric: "+340% ROI",
    image: testimonial1
  },
  {
    name: "María González",
    role: "CTO, FinancePlus",
    company: "Fintech - 180 empleados",
    content: "Implementaron automatización con n8n que nos ahorra 120 horas/mes. El equipo es excepcional, entienden las necesidades del negocio.",
    rating: 5,
    metric: "120h/mes ahorradas",
    image: testimonial2
  },
  {
    name: "Roberto Silva",
    role: "Director Digital, MegaRetail",
    company: "Retail $120M facturación",
    content: "Nuestro e-commerce Shopify Plus generó $8M adicionales en 6 meses. La optimización de conversión fue clave. Recomendados 100%.",
    rating: 5,
    metric: "+$8M en 6 meses",
    image: testimonial3
  },
  {
    name: "Ana Torres",
    role: "VP Innovation, HealthTech",
    company: "Sector Salud",
    content: "El copilot de IA que desarrollaron redujo el tiempo de atención al paciente en 45%. Tecnología de primer nivel.",
    rating: 5,
    metric: "-45% tiempo atención",
    image: testimonial1
  }
];

export const Testimonials = () => {
  return (
    <section className="py-28 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-4">
            <Star className="h-4 w-4 text-secondary fill-secondary" />
            <span className="text-sm font-semibold text-foreground">+180 Clientes Satisfechos</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Resultados Reales, Clientes Reales
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empresas en LATAM que ya transformaron su operación con B3TA
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="p-8 hover:shadow-2xl transition-all duration-300 border-border bg-card relative">
              <Quote className="h-10 w-10 text-primary/20 absolute top-6 right-6" />
              
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-secondary fill-secondary" />
                ))}
              </div>

              <p className="text-foreground leading-relaxed mb-4">
                "{testimonial.content}"
              </p>

              <div className="inline-block px-4 py-2 bg-secondary/10 rounded-full">
                <span className="text-sm font-bold text-secondary">{testimonial.metric}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="relative rounded-3xl overflow-hidden max-w-4xl mx-auto">
          <img 
            src={testimonial2} 
            alt="Clientes satisfechos con soluciones B3TA en LATAM"
            className="w-full h-80 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex items-end">
            <div className="p-8 text-white">
              <p className="text-3xl font-bold mb-2">+250 Proyectos Exitosos</p>
              <p className="text-lg opacity-90">En 12 países de LATAM y USA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};