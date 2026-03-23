import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, TrendingUp, Clock, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';

const cases = [
  {
    title: "Tienda Guatemala",
    metrics: "-80% tiempo operativo, +35% conversión",
    description: "Automatización de recolección de pedidos, actualización de inventarios y notificaciones de envío sin intervención humana.",
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "E-commerce LATAM",
    metrics: "Shopify+SAP sincronizado 100%",
    description: "Eliminación de doble digitación. Catálogo maestro en SAP reflejado en tiempo real en Shopify Plus.",
    icon: TrendingUp,
    color: "text-secondary",
    bg: "bg-secondary/10"
  },
  {
    title: "Marca Moda",
    metrics: "SEO Automático = x3 Tráfico Orgánico",
    description: "Clusterización de contenido con IA y link building interno programático sin redactores adicionales.",
    icon: Search,
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    title: "Retail Físico",
    metrics: "Inventarios Inteligentes WhatsApp",
    description: "Consulta de stock en tiempo real vía WhatsApp bot conectado a ERP, liberando a los vendedores.",
    icon: TrendingUp,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  }
];

export const CaseStudiesCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // Auto-rotate every 5s
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(autoplay);
  }, [emblaApi, onSelect]);

  return (
    <section id="casos" className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Casos de <span className="text-secondary">Éxito Reales</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            No vendemos teoría. Mostramos métricas operativas.
          </p>
        </div>

        <div className="relative">
          {/* Carousel Viewport */}
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex -ml-4">
              {cases.map((cs, idx) => (
                <div key={idx} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4">
                  <Card className="h-full p-8 rounded-3xl bg-card border border-border/50 hover:border-secondary/50 transition-colors shadow-lg">
                    <div className={`w-14 h-14 rounded-2xl ${cs.bg} flex items-center justify-center mb-6`}>
                      <cs.icon className={`h-7 w-7 ${cs.color}`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{cs.title}</h3>
                    
                    <div className="inline-block px-3 py-1 rounded-lg bg-secondary/10 text-secondary font-bold text-sm mb-6">
                      {cs.metrics}
                    </div>
                    
                    <p className="text-base text-muted-foreground leading-relaxed">
                      "Antes éramos un caos. {cs.description}"
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <button 
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:bg-secondary hover:text-white transition-colors shadow-lg z-10 hidden md:flex"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:bg-secondary hover:text-white transition-colors shadow-lg z-10 hidden md:flex"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {cases.map((_, idx) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === selectedIndex ? 'bg-secondary w-8' : 'bg-border hover:bg-muted-foreground'}`}
              aria-label={`Ir al caso ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
