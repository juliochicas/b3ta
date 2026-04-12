import { motion } from "framer-motion";
import {
  ShoppingCart, MessageCircle, Mail, Users, Globe,
  Zap, Database, BarChart3, CheckCircle2, Bot, Cpu, Workflow
} from "lucide-react";

const inputs = [
  { icon: ShoppingCart, label: "Shopify / Tienda", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", delay: 0 },
  { icon: Globe, label: "WordPress / Web", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", delay: 0.1 },
  { icon: MessageCircle, label: "WhatsApp / Chat", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20", delay: 0.2 },
  { icon: Mail, label: "Email / CRM Leads", color: "text-sky-400", bg: "bg-sky-400/10 border-sky-400/20", delay: 0.3 },
  { icon: Users, label: "Ventas / Formularios", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20", delay: 0.4 },
];

const outputs = [
  { icon: Database, label: "SAP Sincronizado", color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20", delay: 0.15 },
  { icon: CheckCircle2, label: "CRM Actualizado", color: "text-primary", bg: "bg-primary/10 border-primary/20", delay: 0.25 },
  { icon: Bot, label: "Claude / Gemini / GPT", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", delay: 0.35 },
  { icon: BarChart3, label: "Reportes & Analytics", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", delay: 0.45 },
  { icon: MessageCircle, label: "Cliente Atendido 24/7", color: "text-accent", bg: "bg-accent/10 border-accent/20", delay: 0.55 },
];

// Animated dot traveling along a connector line
const TravelDot = ({ delay = 0, color = "hsl(var(--primary))" }: { delay?: number; color?: string }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full"
    style={{
      top: "50%",
      transform: "translateY(-50%)",
      backgroundColor: color,
      boxShadow: `0 0 8px ${color}`,
    }}
    initial={{ left: "0%", opacity: 0 }}
    animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
    transition={{
      duration: 2.2,
      delay,
      repeat: Infinity,
      repeatDelay: 0.8,
      ease: "easeInOut",
      times: [0, 0.1, 0.9, 1],
    }}
  />
);

// MCP badge shown on the hub card
const McpBadge = ({ label, icon: Icon, color }: { label: string; icon: React.ElementType; color: string }) => (
  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${color}`}>
    <Icon className="w-3 h-3" />
    {label}
  </div>
);

export const AutomationHub = () => {
  return (
    <section className="py-28 bg-background relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.04)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.04)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,hsl(var(--primary)/0.08),transparent_65%)]" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest bg-secondary/10 text-secondary mb-5 ring-1 ring-secondary/20 uppercase">
            Asi se conecta
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Tus sistemas,{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              hablando entre si
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conectamos tu tienda, ERP, WhatsApp y herramientas de IA en un flujo que funciona solo.
          </p>
        </motion.div>

        {/* Hub Diagram */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-0">

          {/* ── INPUTS ── */}
          <div className="flex flex-col gap-3 w-full lg:w-auto">
            {inputs.map((input, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: input.delay }}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${input.bg} backdrop-blur-sm cursor-default`}
              >
                <div className={`w-8 h-8 rounded-xl ${input.bg} flex items-center justify-center flex-shrink-0`}>
                  <input.icon className={`w-4 h-4 ${input.color}`} />
                </div>
                <span className="text-sm font-semibold text-foreground whitespace-nowrap">{input.label}</span>
              </motion.div>
            ))}
          </div>

          {/* ── CONNECTOR LEFT ── */}
          <div className="hidden lg:flex flex-col gap-3 items-center justify-center mx-4">
            {inputs.map((input, i) => (
              <div key={i} className="relative w-20 h-[46px] flex items-center">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-border/40 to-primary/40" />
                <TravelDot delay={i * 0.42} />
              </div>
            ))}
          </div>

          {/* ── CENTER HUB ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex-shrink-0 my-6 lg:my-0"
          >
            {/* Outer pulse ring */}
            <div className="absolute inset-0 rounded-3xl border border-primary/20 animate-pulse-ring" style={{ margin: "-14px" }} />

            {/* Hub card */}
            <div className="relative w-52 rounded-3xl glass-dark border border-primary/30 flex flex-col items-center justify-center p-5 shadow-[0_0_60px_hsl(var(--primary)/0.2)] z-10 gap-3">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.4)]">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <span className="text-sm font-black text-foreground tracking-tight block">Sistema</span>
                <span className="text-xs text-primary font-bold tracking-widest">B3TA</span>
              </div>

              {/* Orchestration layer (n8n / Make) */}
              <div className="w-full border-t border-border/30 pt-3 flex flex-col gap-1.5">
                <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase text-center mb-1">Orquestación</p>
                <McpBadge label="n8n" icon={Workflow} color="bg-rose-500/10 text-rose-400 border-rose-500/20" />
                <McpBadge label="Make" icon={Workflow} color="bg-violet-500/10 text-violet-400 border-violet-500/20" />
              </div>

              {/* MCP Server badges inside hub */}
              <div className="w-full border-t border-border/30 pt-3 flex flex-col gap-1.5">
                <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase text-center mb-1">MCP Servers</p>
                <McpBadge label="Claude" icon={Cpu} color="bg-orange-500/10 text-orange-400 border-orange-500/20" />
                <McpBadge label="Gemini" icon={Cpu} color="bg-blue-500/10 text-blue-400 border-blue-500/20" />
                <McpBadge label="ChatGPT" icon={Cpu} color="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" />
              </div>
            </div>
          </motion.div>

          {/* ── CONNECTOR RIGHT ── */}
          <div className="hidden lg:flex flex-col gap-3 items-center justify-center mx-4">
            {outputs.map((_, i) => (
              <div key={i} className="relative w-20 h-[46px] flex items-center">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-primary/40 to-border/30" />
                <TravelDot delay={0.9 + i * 0.38} color="hsl(var(--accent))" />
              </div>
            ))}
          </div>

          {/* ── OUTPUTS ── */}
          <div className="flex flex-col gap-3 w-full lg:w-auto">
            {outputs.map((output, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: output.delay }}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${output.bg} backdrop-blur-sm cursor-default`}
              >
                <div className={`w-8 h-8 rounded-xl ${output.bg} flex items-center justify-center flex-shrink-0`}>
                  <output.icon className={`w-4 h-4 ${output.color}`} />
                </div>
                <span className="text-sm font-semibold text-foreground whitespace-nowrap">{output.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-muted-foreground mt-14 text-base"
        >
          Usamos servidores MCP propios para que los modelos de IA trabajen directamente con tus datos — sin copiar y pegar nada.
        </motion.p>
      </div>
    </section>
  );
};
