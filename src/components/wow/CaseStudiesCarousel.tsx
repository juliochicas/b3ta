import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, TrendingUp, Clock, Search, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const cases = [
  {
    title: "Tienda Guatemala",
    metricLabel: "Tiempo operativo",
    metricBefore: "100%",
    metricAfter: "-80%",
    kpi: "-80% tiempo operativo",
    kpiExtra: "+35% conversión",
    description: "Automatización de recolección de pedidos, actualización de inventarios y notificaciones de envío sin intervención humana.",
    icon: Clock,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "hover:border-blue-500/40",
    badgeColor: "bg-blue-500/10 text-blue-400",
  },
  {
    title: "E-commerce LATAM",
    metricLabel: "Shopify ↔ SAP",
    metricBefore: "Manual",
    metricAfter: "100% sync",
    kpi: "Shopify + SAP sincronizado",
    kpiExtra: "0 doble digitación",
    description: "Eliminación de doble digitación. Catálogo maestro en SAP reflejado en tiempo real en Shopify Plus.",
    icon: TrendingUp,
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "hover:border-secondary/40",
    badgeColor: "bg-secondary/10 text-secondary",
  },
  {
    title: "Marca Moda",
    metricLabel: "Tráfico orgánico",
    metricBefore: "1x",
    metricAfter: "3x",
    kpi: "SEO Automático = x3",
    kpiExtra: "Tráfico orgánico",
    description: "Clusterización de contenido con IA y link building interno programático sin redactores adicionales.",
    icon: Search,
    color: "text-accent",
    bg: "bg-accent/10",
    border: "hover:border-accent/40",
    badgeColor: "bg-accent/10 text-accent",
  },
  {
    title: "Retail Físico",
    metricLabel: "Atención al cliente",
    metricBefore: "Manual",
    metricAfter: "24/7 Bot",
    kpi: "Inventarios Inteligentes",
    kpiExtra: "WhatsApp Bot activo",
    description: "Consulta de stock en tiempo real vía WhatsApp bot conectado a ERP, liberando a los vendedores.",
    icon: MessageCircle,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "hover:border-purple-500/40",
    badgeColor: "bg-purple-500/10 text-purple-400",
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
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    const autoplay = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(autoplay);
  }, [emblaApi, onSelect]);

  return (
    <section id="casos" className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest bg-secondary/10 text-secondary mb-5 ring-1 ring-secondary/20 uppercase">
            Casos Reales
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Casos de <span className="text-secondary">Éxito Reales</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            No vendemos teoría. Mostramos métricas operativas.
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex -ml-4">
              {cases.map((cs, idx) => (
                <div key={idx} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4">
                  <div className={`h-full p-8 rounded-3xl bg-card border border-border/50 ${cs.border} transition-all duration-300 shadow-lg group hover:shadow-xl`}>

                    {/* Icon + "ANTES → AHORA" pill */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${cs.bg} flex items-center justify-center`}>
                        <cs.icon className={`h-7 w-7 ${cs.color}`} />
                      </div>
                      {/* Before → After indicator */}
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/60 text-xs font-bold">
                        <span className="text-muted-foreground line-through">{cs.metricBefore}</span>
                        <span className="text-foreground/40">→</span>
                        <span className={cs.color}>{cs.metricAfter}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-3">{cs.title}</h3>

                    {/* KPI badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-bold ${cs.badgeColor}`}>
                        {cs.kpi}
                      </span>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-bold bg-muted text-muted-foreground">
                        {cs.kpiExtra}
                      </span>
                    </div>

                    <p className="text-base text-muted-foreground leading-relaxed">
                      {cs.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all shadow-lg z-10 hidden md:flex cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all shadow-lg z-10 hidden md:flex cursor-pointer"
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
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === selectedIndex ? 'bg-primary w-8' : 'bg-border w-2 hover:bg-muted-foreground'}`}
              aria-label={`Ir al caso ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
