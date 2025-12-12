import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBanner from "@/assets/hero-banner.webp";
import { OptimizedImage } from "./OptimizedImage";

export const HeroAIDA = () => {
  const scrollToAI = () => {
    document.getElementById('ai-consultant')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSolutions = () => {
    document.getElementById('soluciones')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={heroBanner}
          alt="B3TA - Tecnología que Escala Contigo"
          className="absolute inset-0 w-full h-full object-cover"
          priority={true}
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary-glow/90 to-primary/95" />
      </div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-20" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          {/* HOOK - Contrarian */}
          <div className="inline-block px-5 py-2.5 bg-secondary/20 backdrop-blur-sm rounded-full border border-secondary/30 animate-fade-in">
            <span className="text-sm font-semibold text-primary-foreground">
              ⚠️ El 73% de empresas fracasan por tecnología equivocada
            </span>
          </div>
          
          {/* HEADLINE - Promesa clara */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
            Tecnología Que Escala<br />
            <span className="bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent">
              Con Tu Negocio
            </span>
          </h1>
          
          {/* SUBHEADLINE - 3 problemas que resuelves */}
          <div className="flex flex-wrap justify-center gap-4 text-lg md:text-xl text-primary-foreground/90">
            <span className="px-4 py-2 bg-primary-foreground/10 rounded-full">📈 Vende más online</span>
            <span className="px-4 py-2 bg-primary-foreground/10 rounded-full">⚡ Automatiza operaciones</span>
            <span className="px-4 py-2 bg-primary-foreground/10 rounded-full">🚀 Escala sin límites</span>
          </div>
          
          {/* TEXTO SIMPLE - Sin tecnicismos */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Da igual si empiezas con un sitio web o necesitas SAP. 
            <span className="font-semibold"> Te acompañamos en cada paso.</span>
          </p>
          
          {/* CTAs - IA primero */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6">
            <Button 
              onClick={scrollToAI}
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-[0_0_30px_rgba(0,200,255,0.4)] hover:shadow-[0_0_50px_rgba(0,200,255,0.6)] transition-all duration-300 text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 min-h-[48px] sm:min-h-[56px] w-full sm:w-auto group"
            >
              <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Pregúntale a la IA Gratis
            </Button>
            
            <Button 
              onClick={scrollToSolutions}
              size="lg" 
              variant="outline" 
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 backdrop-blur-sm text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 min-h-[48px] sm:min-h-[56px] w-full sm:w-auto"
            >
              Ver Soluciones
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* SOCIAL PROOF RÁPIDO */}
          <div className="pt-12 pb-8">
            <div className="inline-flex flex-wrap justify-center gap-6 md:gap-12 mx-auto text-primary-foreground/80">
              <div className="text-center px-4">
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">250+</div>
                <div className="text-sm">Proyectos</div>
              </div>
              <div className="text-center px-4">
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">12</div>
                <div className="text-sm">Países</div>
              </div>
              <div className="text-center px-4">
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">180+</div>
                <div className="text-sm">Clientes</div>
              </div>
              <div className="text-center px-4">
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">99.9%</div>
                <div className="text-sm">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
