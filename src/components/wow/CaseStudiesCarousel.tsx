import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, TrendingUp, Clock, Search, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const cases = [
  {
    title: "Distribuidora — Guatemala",
    metricLabel: "Procesamiento pedidos",
    metricBefore: "45 min",
    metricAfter: "2 min",
    kpi: "SAP + Shopify sincronizado",
    kpiExtra: "0 errores de digitacion",
    description: "Una distribuidora con 200+ SKUs pasaba pedidos de Shopify a SAP a mano. Ahora el flujo es automatico: pedido entra, SAP lo registra, bodega recibe la orden.",
    icon: Clock,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "hover:border-blue-500/40",
    badgeColor: "bg-blue-500/10 text-blue-400",
  },
  {
    title: "E-commerce — Mexico",
    metricLabel: "Catalogo",
    metricBefore: "Desync",
    metricAfter: "Tiempo real",
    kpi: "Catalogo maestro unificado",
    kpiExtra: "Precios sincronizados",
    description: "Tienda con catalogo en SAP y Shopify Plus desincronizados. Integramos ambos: precio, stock y descripcion se actualizan solos cuando cambian en SAP.",
    icon: TrendingUp,
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "hover:border-secondary/40",
    badgeColor: "bg-secondary/10 text-secondary",
  },
  {
    title: "Portal B2B — Centroamerica",
    metricLabel: "Trafico organico",
    metricBefore: "800/mes",
    metricAfter: "4,000/mes",
    kpi: "+4,000 paginas indexadas",
    kpiExtra: "SEO programatico",
    description: "Portal de celulares con 4,057 paginas generadas programaticamente. Cada producto tiene su landing optimizada con schema markup y contenido unico.",
    icon: Search,
    color: "text-accent",
    bg: "bg-accent/10",
    border: "hover:border-accent/40",
    badgeColor: "bg-accent/10 text-accent",
  },
  {
    title: "Retail Multicanal — Guatemala",
    metricLabel: "Atencion cliente",
    metricBefore: "Solo horario",
    metricAfter: "24/7",
    kpi: "Bot WhatsApp activo",
    kpiExtra: "Consulta stock en vivo",
    description: "Cadena con 3 sucursales donde los vendedores perdian tiempo revisando inventario. Ahora un bot de WhatsApp consulta SAP y responde stock en segundos.",
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
    <section id="casos" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
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
            Proyectos <span className="text-secondary">que hemos hecho</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Algunos ejemplos de lo que construimos para nuestros clientes.
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
