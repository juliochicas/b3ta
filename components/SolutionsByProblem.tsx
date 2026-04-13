"use client";

import { Button } from "@/components/ui/button";
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
  ArrowRight,
  Clock,
  Wallet
} from "lucide-react";
import { useState } from "react";

const solutionGroups = [
  {
    id: "vender",
    problem: "Quiero Vender Más Online",
    icon: ShoppingCart,
    gradient: "from-orange-500 via-rose-500 to-pink-500",
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
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
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
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    solutions: [
      {
        icon: Sparkles,
        name: "MVP & Producto Digital",
        description: "Valida tu idea rápido. Lanza tu producto al mercado en semanas",
        time: "4-8 semanas",
        budget: "Desde $3,000"
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
  const [activeTab, setActiveTab] = useState("vender");
  
  const scrollToAI = () => {
    document.getElementById('ai-consultant')?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeGroup = solutionGroups.find(g => g.id === activeTab);

  return (
    <section id="soluciones" className="py-32 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6">
            Soluciones Simples
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            ¿Qué Quieres <span className="gradient-text">Lograr</span>?
          </h2>
          <p className="text-xl text-muted-foreground">
            Elige tu objetivo. Nosotros te llevamos ahí.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {solutionGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveTab(group.id)}
              className={`
                flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-base transition-all duration-300
                ${activeTab === group.id 
                  ? `bg-gradient-to-r ${group.gradient} text-white shadow-lg scale-105` 
                  : 'bg-card hover:bg-muted text-foreground border border-border'
                }
              `}
            >
              <group.icon className="h-5 w-5" />
              <span className="hidden sm:inline">{group.problem}</span>
              <span className="sm:hidden">{group.problem.split(' ').slice(-2).join(' ')}</span>
            </button>
          ))}
        </div>

        {/* Solutions Grid */}
        {activeGroup && (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
            {activeGroup.solutions.map((solution, idx) => (
              <div 
                key={idx}
                className="group relative bg-card rounded-3xl p-8 border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Gradient Glow on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${activeGroup.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeGroup.gradient} flex items-center justify-center mb-6`}>
                  <solution.icon className="h-7 w-7 text-white" />
                </div>
                
                {/* Content */}
                <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {solution.name}
                </h4>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {solution.description}
                </p>
                
                {/* Meta */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{solution.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-primary">
                    <Wallet className="h-4 w-4" />
                    <span>{solution.budget}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-glow p-px">
            <div className="relative bg-gradient-to-br from-primary via-primary to-primary-glow rounded-3xl p-10 md:p-14">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary-foreground)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary-foreground)/0.05)_1px,transparent_1px)] bg-[size:40px_40px] rounded-3xl" />
              
              <div className="relative text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/20 backdrop-blur-sm">
                  <Sparkles className="h-8 w-8 text-secondary" />
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                  ¿No sabes por dónde empezar?
                </h3>
                
                <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto">
                  Nuestro consultor IA analiza tu situación y te recomienda 
                  la mejor solución. Gratis y en 2 minutos.
                </p>
                
                <Button 
                  onClick={scrollToAI}
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-lg px-10 py-7 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Consultar con IA Gratis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
