import { Card } from "@/components/ui/card";
import { ShoppingCart, Cog, TrendingUp, AlertTriangle } from "lucide-react";

const problems = [
  {
    icon: ShoppingCart,
    hook: "¿Vendes poco online?",
    pain: "Tu competencia vende 24/7 mientras tú pierdes clientes por no tener presencia digital profesional.",
    solution: "E-commerce, Shopify, Marketing Digital",
    color: "from-orange-500/20 to-red-500/10"
  },
  {
    icon: Cog,
    hook: "¿Procesos manuales?",
    pain: "Tu equipo pierde horas en tareas repetitivas que podrían automatizarse en minutos.",
    solution: "Automatizaciones, IA, Workflows",
    color: "from-blue-500/20 to-cyan-500/10"
  },
  {
    icon: TrendingUp,
    hook: "¿Crecimiento estancado?",
    pain: "Tu negocio creció pero tu tecnología no. Ahora es un cuello de botella.",
    solution: "MVPs, Apps Web, Consultoría Estratégica",
    color: "from-purple-500/20 to-indigo-500/10"
  }
];

export const ProblemSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* HOOK - Investigator */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-full mb-6">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-semibold">El problema que nadie te cuenta</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Cuál de Estos Te Suena?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            El 90% de nuestros clientes empezaron con uno de estos problemas
          </p>
        </div>

        {/* 3 PROBLEMAS */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {problems.map((problem, idx) => (
            <Card 
              key={idx}
              className={`p-8 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-gradient-to-br ${problem.color} animate-fade-up opacity-0`}
              style={{ animationDelay: `${0.2 + idx * 0.15}s`, animationFillMode: 'forwards' }}
            >
              <problem.icon className="h-12 w-12 text-primary mb-6" />
              
              {/* Hook del problema */}
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {problem.hook}
              </h3>
              
              {/* Pain point */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {problem.pain}
              </p>
              
              {/* Solución rápida */}
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-primary">
                  ✓ Solución: {problem.solution}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Mini CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground">
            ¿Te identificas? 
            <a 
              href="#soluciones" 
              className="text-primary font-semibold ml-1 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('soluciones')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Mira cómo lo resolvemos →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
