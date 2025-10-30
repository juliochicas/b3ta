import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export const UrgencyBanner = () => {
  const [spotsLeft] = useState(3);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const diff = endOfMonth.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-gradient-to-r from-destructive/10 via-primary/10 to-secondary/10">
      <div className="container mx-auto px-4 sm:px-6">
        <Card className="max-w-5xl mx-auto p-8 md:p-12 bg-gradient-to-br from-primary via-primary to-secondary text-white border-0 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-32 -translate-x-32" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="h-6 w-6 animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-wider">
                Oferta Limitada - Enero 2025
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Solo {spotsLeft} Espacios Disponibles Este Mes
            </h2>
            
            <p className="text-center text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Para mantener calidad premium, limitamos a 8 proyectos nuevos mensuales. Ya tomamos 5 espacios en enero.
            </p>

            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-1">{timeLeft.days}</div>
                <div className="text-sm opacity-75">Días</div>
              </div>
              <div className="text-5xl font-bold">:</div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-1">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-sm opacity-75">Horas</div>
              </div>
              <div className="text-5xl font-bold">:</div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-1">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-sm opacity-75">Minutos</div>
              </div>
              <div className="text-5xl font-bold">:</div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-1">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-sm opacity-75">Segundos</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button 
                onClick={scrollToContact}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-bold shadow-xl text-lg px-10 py-7"
              >
                Reservar Mi Espacio Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm">
              <Users className="h-5 w-5" />
              <span className="opacity-90">
                23 empresas en lista de espera para febrero
              </span>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20 text-center">
              <p className="text-sm opacity-75">
                ⚡ Bonus: Primeras 3 empresas que agenden reciben auditoría de seguridad gratis ($5K valor)
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};