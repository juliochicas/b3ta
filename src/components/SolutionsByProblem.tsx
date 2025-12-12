import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Cog, 
  TrendingUp, 
  Sparkles,
  Globe,
  Store,
  Bot,
  Workflow,
  Database,
  LineChart,
  ArrowRight
} from "lucide-react";

const solutionGroups = [
  {
    id: "vender",
    problem: "Quiero Vender Más Online",
    icon: ShoppingCart,
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-500/10 to-red-500/5",
    solutions: [
      {
        icon: Globe,
        name: "Sitio Web Profesional",
        description: "Tu vitrina 24/7 con SEO para que te encuentren",
        time: "2-3 semanas",
        budget: "Desde $100"
      },
      {
        icon: Store,
        name: "Tienda Online",
        description: "Shopify o custom. Vende mientras duermes",
        time: "3-4 semanas",
        budget: "Desde $500"
      },
      {
        icon: LineChart,
        name: "Marketing Digital",
        description: "Campañas que traen clientes, no solo likes",
        time: "Continuo",
        budget: "Desde $300/mes"
      }
    ]
  },
  {
    id: "automatizar",
    problem: "Quiero Automatizar Procesos",
    icon: Cog,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-500/10 to-cyan-500/5",
    solutions: [
      {
        icon: Workflow,
        name: "Workflows Automáticos",
        description: "Conecta tus apps. Elimina tareas repetitivas",
        time: "2-4 semanas",
        budget: "Desde $500"
      },
      {
        icon: Bot,
        name: "Asistentes con IA",
        description: "Chatbots y agentes que trabajan por ti",
        time: "3-5 semanas",
        budget: "Desde $800"
      },
      {
        icon: Database,
        name: "Integraciones",
        description: "Tu CRM, ERP y herramientas hablando entre sí",
        time: "4-6 semanas",
        budget: "Desde $1,000"
      }
    ]
  },
  {
    id: "escalar",
    problem: "Quiero Escalar Mi Negocio",
    icon: TrendingUp,
    color: "from-purple-500 to-indigo-500",
    bgColor: "from-purple-500/10 to-indigo-500/5",
    solutions: [
      {
        icon: Database,
        name: "SAP Business One",
        description: "El ERP que usan las empresas grandes. Ahora accesible",
        time: "3-6 meses",
        budget: "Desde $15,000"
      },
      {
        icon: Bot,
        name: "IA Corporativa",
        description: "LLMs personalizados para tu empresa",
        time: "2-4 meses",
        budget: "Desde $8,000"
      },
      {
        icon: LineChart,
        name: "Consultoría Estratégica",
        description: "Tu roadmap tecnológico a 3 años",
        time: "4-8 semanas",
        budget: "Desde $3,000"
      }
    ]
  }
];

export const SolutionsByProblem = () => {
  const scrollToAI = () => {
    document.getElementById('ai-consultant')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="soluciones" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="outline">Soluciones Simples</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            ¿Qué Quieres Lograr?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elige tu objetivo. Nosotros te llevamos ahí.
          </p>
        </div>

        {/* Solution Groups */}
        <div className="space-y-16 max-w-6xl mx-auto">
          {solutionGroups.map((group, groupIdx) => (
            <div key={group.id} className="space-y-8">
              
              {/* Group Header */}
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center`}>
                  <group.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  {group.problem}
                </h3>
              </div>

              {/* Solutions Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {group.solutions.map((solution, idx) => (
                  <Card 
                    key={idx}
                    className={`p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br ${group.bgColor}`}
                  >
                    <solution.icon className="h-10 w-10 text-primary mb-4" />
                    
                    <h4 className="text-lg font-bold text-foreground mb-2">
                      {solution.name}
                    </h4>
                    
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {solution.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm pt-4 border-t border-border">
                      <span className="text-muted-foreground">⏱ {solution.time}</span>
                      <span className="font-semibold text-primary">{solution.budget}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA - Consultor IA */}
        <div className="mt-20">
          <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-gradient-to-r from-primary to-primary-glow border-0 text-primary-foreground">
            <div className="text-center space-y-6">
              <Sparkles className="h-12 w-12 mx-auto opacity-90" />
              
              <h3 className="text-2xl md:text-3xl font-bold">
                ¿No sabes por dónde empezar?
              </h3>
              
              <p className="text-lg opacity-90 max-w-xl mx-auto">
                Nuestro consultor IA analiza tu situación y te recomienda 
                la mejor solución. Gratis y en 2 minutos.
              </p>
              
              <Button 
                onClick={scrollToAI}
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg text-lg px-10 py-6"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Consultar con IA Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
