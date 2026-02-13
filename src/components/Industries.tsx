import { Card } from "@/components/ui/card";
import { 
  Factory, 
  ShoppingBag, 
  Truck, 
  Building2, 
  Heart, 
  GraduationCap,
  Utensils,
  Briefcase 
} from "lucide-react";

const industries = [
  {
    icon: Factory,
    name: "Manufactura",
    description: "Automatización de producción, control de inventario y procesos en tiempo real",
    solutions: ["ERP", "MES", "IoT Industrial"]
  },
  {
    icon: ShoppingBag,
    name: "Retail & E-commerce",
    description: "Tiendas online, omnicanalidad y estrategias de crecimiento digital",
    solutions: ["Shopify Plus", "POS Integration", "CRM"]
  },
  {
    icon: Truck,
    name: "Distribución & Logística",
    description: "Gestión de cadena de suministro, rutas y control de flotas",
    solutions: ["WMS", "TMS", "Track & Trace"]
  },
  {
    icon: Building2,
    name: "Construcción & Inmobiliarias",
    description: "Gestión de proyectos, control de costos y CRM especializado",
    solutions: ["Project Management", "Cotizaciones", "CRM"]
  },
  {
    icon: Heart,
    name: "Salud & Farmacéuticas",
    description: "Gestión hospitalaria, control de lotes y trazabilidad completa",
    solutions: ["HIS", "Trazabilidad", "Compliance"]
  },
  {
    icon: GraduationCap,
    name: "Educación",
    description: "Plataformas LMS, gestión académica y automatización administrativa",
    solutions: ["LMS", "ERP Educativo", "Portales"]
  },
  {
    icon: Utensils,
    name: "Alimentos & Bebidas",
    description: "Control de producción, trazabilidad FSMA y gestión de calidad",
    solutions: ["ERP Food", "Trazabilidad", "QMS"]
  },
  {
    icon: Briefcase,
    name: "Servicios Profesionales",
    description: "Gestión de proyectos, facturación y control de tiempo",
    solutions: ["PSA", "Time Tracking", "Billing"]
  }
];

export const Industries = () => {
  return (
    <section className="py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Industrias que Transformamos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experiencia comprobada en múltiples sectores con soluciones especializadas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {industries.map((industry, index) => (
            <Card 
              key={industry.name}
              className="p-6 hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 bg-card group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="mb-4 w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                <industry.icon className="h-7 w-7 text-primary" />
              </div>
              
              <h3 className="text-lg font-bold text-foreground mb-2">{industry.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {industry.description}
              </p>
              
              <div className="pt-4 border-t border-border">
                <p className="text-xs font-semibold text-foreground mb-2">Soluciones:</p>
                <div className="flex flex-wrap gap-1">
                  {industry.solutions.map((solution) => (
                    <span 
                      key={solution}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                    >
                      {solution}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              ¿No ves tu industria?
            </h3>
            <p className="text-muted-foreground mb-6">
              Trabajamos con empresas de todos los sectores. Nuestro enfoque consultivo nos permite adaptar soluciones a cualquier industria.
            </p>
            <button 
              onClick={() => {
                const contactElement = document.getElementById('contact');
                contactElement?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Consultarnos
            </button>
          </Card>
        </div>
      </div>
    </section>
  );
};
