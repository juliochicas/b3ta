import { motion } from "framer-motion";
import { Search, PenTool, Rocket, RefreshCw } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "DIAGNÓSTICO",
    badge: "Gratis",
    desc: "Revisamos como trabaja tu equipo hoy: que sistemas usan, donde se traban y que datos se pierden en el camino.",
    icon: Search,
    gradient: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/30 hover:border-blue-500/60",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    ringColor: "ring-blue-500/30",
  },
  {
    num: "02",
    title: "DISEÑO",
    badge: null,
    desc: "Te presentamos un plan claro: que se conecta con que, cuanto cuesta y en cuanto tiempo queda listo.",
    icon: PenTool,
    gradient: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/30 hover:border-purple-500/60",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    ringColor: "ring-purple-500/30",
  },
  {
    num: "03",
    title: "IMPLEMENTACIÓN",
    badge: null,
    desc: "Construimos las integraciones, probamos con datos reales de tu negocio y entrenamos a tu equipo para que lo usen desde el dia uno.",
    icon: Rocket,
    gradient: "from-cyan-500/20 to-cyan-500/5",
    border: "border-cyan-500/30 hover:border-cyan-500/60",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    ringColor: "ring-cyan-500/30",
  },
  {
    num: "04",
    title: "OPTIMIZACIÓN",
    badge: "Continuo",
    desc: "Seguimos contigo despues del lanzamiento. Ajustamos lo que haga falta y agregamos funciones conforme crece tu operacion.",
    icon: RefreshCw,
    gradient: "from-accent/20 to-accent/5",
    border: "border-accent/30 hover:border-accent/60",
    iconColor: "text-accent",
    iconBg: "bg-accent/10",
    ringColor: "ring-accent/30",
  },
];

export const Methodology = () => {
  return (
    <section id="proceso" className="py-32 bg-card relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--primary)/0.08),transparent_60%)]" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest bg-primary/10 text-primary mb-5 ring-1 ring-primary/20 uppercase">
            Como Trabajamos
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            4 pasos, sin sorpresas
          </h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Asi funciona cada proyecto con nosotros.
          </p>
        </motion.div>

        {/* Desktop: Horizontal Stepper */}
        <div className="hidden md:block">
          {/* Progress line */}
          <div className="relative flex items-start justify-between gap-0 mb-0">
            {/* Connecting line */}
            <div className="absolute top-8 left-[calc(12.5%)] right-[calc(12.5%)] h-px bg-gradient-to-r from-blue-500/30 via-purple-500/30 via-cyan-500/30 to-accent/30" />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex-1 flex flex-col items-center text-center px-4"
              >
                {/* Circle with number */}
                <div className={`relative z-10 w-16 h-16 rounded-full bg-background border-2 ${step.border} flex items-center justify-center mb-6 shadow-lg transition-all duration-300 ring-4 ${step.ringColor} group-hover:scale-110`}>
                  <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                </div>

                {/* Card */}
                <div className={`w-full p-6 rounded-3xl bg-gradient-to-b ${step.gradient} border ${step.border} transition-colors duration-300 text-left relative group`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-foreground/10 leading-none">{step.num}</span>
                    {step.badge && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${step.iconBg} ${step.iconColor} ring-1 ${step.ringColor} whitespace-nowrap`}>
                        {step.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical list */}
        <div className="md:hidden space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`p-6 rounded-3xl bg-gradient-to-br ${step.gradient} border ${step.border} relative`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl ${step.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-muted-foreground tracking-widest">FASE {step.num}</span>
                    {step.badge && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${step.iconBg} ${step.iconColor}`}>
                        {step.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
