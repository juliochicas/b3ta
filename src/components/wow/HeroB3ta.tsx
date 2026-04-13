import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, CheckCircle2, MessageCircle, Zap, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// The animated sequence cards that appear on the right
const tabs = [
  {
    id: "antes",
    label: "Antes",
    steps: [
      { icon: MessageCircle, text: "Cotizas en Excel y lo mandas por WhatsApp", done: false, color: "text-red-400" },
      { icon: Zap, text: "El cliente no te ve profesional", done: false, color: "text-red-400" },
      { icon: CheckCircle2, text: "No te encuentran en Google", done: false, color: "text-red-400" },
      { icon: BarChart3, text: "Pierdes clientes por falta de presencia", done: true, color: "text-red-400" },
    ],
  },
  {
    id: "despues",
    label: "Despues",
    steps: [
      { icon: CheckCircle2, text: "Cotizas desde el celular en tu propio sistema", done: false, color: "text-green-400" },
      { icon: Zap, text: "Correo profesional: hola@tuempresa.com", done: false, color: "text-green-400" },
      { icon: BarChart3, text: "Tu pagina aparece en Google", done: false, color: "text-green-400" },
      { icon: MessageCircle, text: "Tus clientes te ven formal y te contratan", done: true, color: "text-accent" },
    ],
  },
  {
    id: "avanzado",
    label: "Pro",
    steps: [
      { icon: Zap, text: "WhatsApp bot atiende clientes 24/7", done: false, color: "text-cyan-400" },
      { icon: CheckCircle2, text: "Portal donde tu cliente ve su historial", done: false, color: "text-blue-400" },
      { icon: BarChart3, text: "Notificaciones automaticas a tus clientes", done: false, color: "text-purple-400" },
      { icon: MessageCircle, text: "Tu negocio funciona aunque no estes", done: true, color: "text-accent" },
    ],
  },
];

const AnimatedSequenceCard = ({ tab }: { tab: typeof tabs[0] }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setActiveStep(0);
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < tab.steps.length - 1 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(interval);
  }, [tab.id, tab.steps.length]);

  return (
    <div className="p-6 rounded-3xl glass-dark border border-primary/20 shadow-[0_0_40px_hsl(var(--primary)/0.1)]">
      {/* Pulsing indicator dot */}
      <div className="flex justify-end mb-4">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
        </span>
      </div>

      <div className="space-y-3">
        {tab.steps.map((step, i) => (
          <div key={i} className="relative">
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: i <= activeStep ? 1 : 0.35 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                i === tab.steps.length - 1 && activeStep === tab.steps.length - 1
                  ? "bg-accent/15 border border-accent/30"
                  : i <= activeStep
                  ? "bg-card/80"
                  : "bg-transparent"
              }`}
            >
              {/* Icon circle */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                i <= activeStep ? "bg-primary/10" : "bg-muted/30"
              }`}>
                <step.icon className={`w-4 h-4 ${i <= activeStep ? step.color : "text-muted-foreground"}`} />
              </div>

              <span className={`text-sm font-medium ${
                i === tab.steps.length - 1 && activeStep === tab.steps.length - 1
                  ? "text-accent font-bold"
                  : i <= activeStep
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}>
                {step.text}
              </span>

              {/* Check mark when step is done */}
              {i < activeStep && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                </motion.div>
              )}
            </motion.div>

            {/* Connector line (not after last item) */}
            {i < tab.steps.length - 1 && (
              <div className="ml-7 w-px h-2 bg-border/50" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const HeroB3ta = () => {
  const [activeTab, setActiveTab] = useState(0);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToCases = () => {
    document.getElementById("casos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 mesh-gradient opacity-60" />
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      {/* Glow blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

          {/* LEFT: Copy + CTAs */}
          <div className="space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 glass-dark rounded-full border border-primary/20"
            >
              <Sparkles className="h-4 w-4 text-secondary animate-pulse" />
              <span className="text-sm font-medium text-foreground">
                Tu programador te dice "no se puede"? Nosotros si podemos.
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black text-foreground leading-[1.05] tracking-tighter"
            >
              DEJA EL EXCEL.
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                TEN TU PROPIO SISTEMA.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
            >
              Pagina web, correo profesional, cotizador desde el celular, portal para tus clientes y que te encuentren en Google.{" "}
              <strong className="text-foreground">Empezamos con lo basico y creces a tu ritmo.</strong>
            </motion.p>

            {/* Bullet list */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-3 text-base text-muted-foreground max-w-sm mx-auto lg:mx-0"
            >
              {[
                "Deja de cotizar en Excel, ten tu propio sistema",
                "Que tus clientes te encuentren en Google",
                "Notifica a tus clientes automatico, no manual",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-2"
            >
              <Button
                onClick={scrollToContact}
                size="lg"
                className="group relative bg-primary hover:bg-primary-glow text-primary-foreground font-bold text-lg px-10 py-8 rounded-2xl cta-glow hover:scale-105 transition-all duration-300 w-full sm:w-auto overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                COTIZAR MI PROYECTO
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

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-sm text-muted-foreground text-center lg:text-left"
            >
              Sin compromiso · Te respondemos en menos de 24h
            </motion.p>
          </div>

          {/* RIGHT: Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-4 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
          >
            {/* Tabs */}
            <div className="flex gap-2 p-1 rounded-2xl glass-dark border border-border/50 w-fit mx-auto lg:mx-0">
              {tabs.map((tab, i) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === i
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sequence Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatedSequenceCard tab={tabs[activeTab]} />
              </motion.div>
            </AnimatePresence>

            {/* Floating stat badges */}
            <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
              {[
                { label: "Proyectos entregados", value: "20+" },
                { label: "Paises", value: "12" },
                { label: "Por fases", value: "Si" },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="px-4 py-2 rounded-xl glass-dark border border-border/40 text-center"
                >
                  <div className="text-base font-black text-primary">{badge.value}</div>
                  <div className="text-xs text-muted-foreground">{badge.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
