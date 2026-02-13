import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.webp";
import { OptimizedImage } from "./OptimizedImage";

export const Hero = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAI = () => {
    document.getElementById('ai-consultant')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay - Optimized for LCP */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={heroBanner}
          alt="B3TA Transformación Digital LATAM - Procesos, MVPs, E-commerce y Automatización"
          className="absolute inset-0 w-full h-full object-cover"
          priority={true}
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary-glow/90 to-primary/95" />
      </div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-20" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div className="inline-block mt-4 md:mt-6 px-5 py-2.5 bg-secondary/20 backdrop-blur-sm rounded-full border border-secondary/30">
            <span className="text-sm font-semibold text-primary-foreground">🚀 Transformación Digital Integral para LATAM</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
            ¿Tu Tecnología Te Limita<br />
            <span className="bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent">
              o Te Impulsa?
            </span>
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-semibold text-primary-foreground/95 mt-6">
            Transformamos Tu Negocio con Tecnología Real
          </h2>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Desde sitios web y automatizaciones hasta MVPs y productos digitales. Soluciones escalables para cada etapa de crecimiento de tu empresa en LATAM.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-8">
            <Button 
              onClick={scrollToContact}
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-[0_0_30px_rgba(0,200,255,0.4)] hover:shadow-[0_0_50px_rgba(0,200,255,0.6)] transition-all duration-300 text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 min-h-[48px] sm:min-h-[56px] w-full sm:w-auto"
            >
              Agenda Consultoría Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              onClick={scrollToAI}
              size="lg" 
              variant="outline" 
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 backdrop-blur-sm text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 min-h-[48px] sm:min-h-[56px] w-full sm:w-auto"
            >
              Consulta con IA →
            </Button>
          </div>

          <div className="pt-16 pb-20">
            <div className="inline-grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mx-auto">
              {[
                { label: "Proyectos", value: "250+" },
                { label: "Países", value: "12" },
                { label: "Clientes", value: "180+" },
                { label: "Uptime", value: "99.9%" }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};