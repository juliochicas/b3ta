import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const HeroB3ta = () => {
  const scrollToContact = () => {
    document.getElementById('diagnostico')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToCases = () => {
    document.getElementById('casos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradient & Particles Substitute */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 mesh-gradient opacity-60" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 glass-dark rounded-full border border-primary/20"
          >
            <Sparkles className="h-4 w-4 text-secondary animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              ¡No hagas webs informativas! Construye sistemas que facturen.
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl sm:text-7xl md:text-8xl font-black text-foreground leading-[1] tracking-tighter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            TU OPERACIÓN,
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              100% AUTOMATIZADA
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium"
          >
            Deja de operar manualmente. <strong className="text-foreground">Integramos IA, SAP y código a medida.</strong> Escala tus ventas sin colapsar tu equipo.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4"
          >
            <Button 
              onClick={scrollToContact}
              size="lg" 
              className="group relative bg-primary hover:bg-primary-glow text-primary-foreground font-bold text-lg px-10 py-8 rounded-2xl neon-glow hover:scale-105 transition-all duration-300 w-full sm:w-auto overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              DIAGNÓSTICO GRATIS
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              onClick={scrollToCases}
              size="lg" 
              variant="outline" 
              className="glass border-border hover:bg-primary/10 text-foreground font-semibold text-lg px-10 py-8 rounded-2xl w-full sm:w-auto group"
            >
              <Play className="mr-3 h-5 w-5 text-secondary group-hover:scale-110 transition-transform" />
              VER CASOS REALES
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
