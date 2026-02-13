import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play } from "lucide-react";

export const HeroAIDA = () => {
  const scrollToAI = () => {
    document.getElementById('ai-consultant')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSolutions = () => {
    document.getElementById('soluciones')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 mesh-gradient opacity-60" />
      
      {/* Animated Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary-foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary-foreground)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          {/* HOOK - Badge */}
          <div 
            className="inline-flex items-center gap-2 px-5 py-2.5 glass-dark rounded-full animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="text-sm font-medium text-primary-foreground/90">
              El 73% de empresas fracasan por tecnología equivocada
            </span>
          </div>
          
          {/* HEADLINE */}
          <h1 
            className="text-5xl sm:text-6xl md:text-8xl font-bold text-primary-foreground leading-[0.95] tracking-tight animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Tecnología Que
            <br />
            <span className="gradient-text">
              Escala Contigo
            </span>
          </h1>
          
          {/* SUBHEADLINE - Pills */}
          <div 
            className="flex flex-wrap justify-center gap-3 animate-fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            {[
              { icon: "📈", text: "Vende más online" },
              { icon: "⚡", text: "Automatiza operaciones" },
              { icon: "🚀", text: "Escala sin límites" }
            ].map((item, idx) => (
              <span 
                key={idx}
                className="px-5 py-2.5 glass-dark rounded-full text-base md:text-lg text-primary-foreground/90 font-medium"
              >
                {item.icon} {item.text}
              </span>
            ))}
          </div>
          
          {/* TEXTO SIMPLE */}
          <p 
            className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed font-light animate-fade-up"
            style={{ animationDelay: '0.5s' }}
          >
            Da igual si empiezas con un sitio web o necesitas automatizar todo.
            <span className="font-medium text-primary-foreground"> Te acompañamos en cada paso.</span>
          </p>
          
          {/* CTAs */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-up"
            style={{ animationDelay: '0.6s' }}
          >
            <Button 
              onClick={scrollToAI}
              size="lg" 
              className="group relative bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-lg px-8 py-7 rounded-2xl neon-glow hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Pregúntale a la IA Gratis
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              onClick={scrollToSolutions}
              size="lg" 
              variant="ghost" 
              className="glass-dark hover:bg-primary-foreground/10 text-primary-foreground font-medium text-lg px-8 py-7 rounded-2xl w-full sm:w-auto group"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Ver Soluciones
            </Button>
          </div>

          {/* SOCIAL PROOF */}
          <div 
            className="pt-16 animate-fade-up"
            style={{ animationDelay: '0.8s' }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {[
                { value: "250+", label: "Proyectos" },
                { value: "12", label: "Países" },
                { value: "180+", label: "Clientes" },
                { value: "99.9%", label: "Uptime" }
              ].map((stat, idx) => (
                <div key={idx} className="text-center group">
                  <div className="text-3xl md:text-4xl font-bold text-primary-foreground group-hover:text-secondary transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-foreground/60 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};
