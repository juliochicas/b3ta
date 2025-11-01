import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";

export const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Mostrar después de scroll 1.5 pantallas
      if (scrollPosition > windowHeight * 1.5 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-in slide-in-from-bottom duration-300">
      <div className="bg-gradient-to-r from-primary via-secondary to-primary text-primary-foreground shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="font-bold text-lg mb-1">
                Primera Consultoría 100% Gratis
              </p>
              <p className="text-sm opacity-90">
                Diagnóstico completo + Roadmap personalizado • Sin compromiso
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                onClick={scrollToContact}
                size="lg"
                className="bg-background text-primary hover:bg-background/90 shadow-lg font-bold"
              >
                Agendar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};