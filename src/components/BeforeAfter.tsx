import { Card } from "@/components/ui/card";
import { X, Check, TrendingUp } from "lucide-react";
import beforeAfter from "@/assets/before-after.jpg";
import { OptimizedImage } from "./OptimizedImage";

const comparisons = [
  {
    before: "Procesos manuales repetitivos",
    after: "100% automatizado con IA",
    metric: "120h/mes ahorradas"
  },
  {
    before: "Sistemas legacy desconectados",
    after: "Integración SAP Business One for HANA cloud",
    metric: "60% más rápido"
  },
  {
    before: "E-commerce básico sin optimización",
    after: "Shopify Plus con CRO avanzado",
    metric: "+340% conversión"
  },
  {
    before: "Sin visibilidad de métricas clave",
    after: "Dashboards en tiempo real con IA",
    metric: "100% data-driven"
  }
];

const caseStudy = {
  company: "RetailCorp LATAM",
  industry: "Retail E-commerce",
  size: "$45M facturación anual",
  challenge: "Operaciones manuales, inventario descontrolado, ventas estancadas",
  solution: "SAP Business One for HANA + Shopify Plus + Automatización IA",
  results: [
    { metric: "+340%", label: "ROI primer año" },
    { metric: "-60%", label: "Tiempo operaciones" },
    { metric: "+180%", label: "Ventas online" },
    { metric: "99.9%", label: "Uptime sistema" }
  ]
};

export const BeforeAfter = () => {
  return (
    <section className="py-28 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Antes vs Después con B3TA
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transformación real. Resultados medibles. Sin exageraciones.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 border-destructive/20 bg-destructive/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                  <X className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Antes</h3>
              </div>
              
              <ul className="space-y-4">
                {comparisons.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                    <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <span>{item.before}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-8 border-2 border-secondary/50 bg-secondary/5 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Check className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Después</h3>
              </div>
              
              <ul className="space-y-4">
                {comparisons.map((item, idx) => (
                  <li key={idx}>
                    <div className="flex items-start gap-3 mb-2">
                      <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium">{item.after}</span>
                    </div>
                    <div className="ml-8">
                      <span className="text-sm font-bold text-secondary">{item.metric}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="grid md:grid-cols-2">
              <div className="relative h-80 md:h-auto">
                <OptimizedImage
                  src={beforeAfter}
                  alt="Caso de éxito: transformación digital empresarial con B3TA"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <span className="text-sm font-semibold text-primary uppercase">Caso de Éxito</span>
                </div>

                <h3 className="text-3xl font-bold text-foreground mb-2">
                  {caseStudy.company}
                </h3>
                
                <div className="flex gap-4 text-sm text-muted-foreground mb-6">
                  <span>{caseStudy.industry}</span>
                  <span>•</span>
                  <span>{caseStudy.size}</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Desafío:</h4>
                    <p className="text-muted-foreground">{caseStudy.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Solución:</h4>
                    <p className="text-muted-foreground">{caseStudy.solution}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {caseStudy.results.map((result, idx) => (
                    <div key={idx} className="text-center p-4 bg-background/80 rounded-xl">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {result.metric}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {result.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};