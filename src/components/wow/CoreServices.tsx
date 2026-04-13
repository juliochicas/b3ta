import { motion } from "framer-motion";
import { Workflow, ShoppingCart, TrendingUp, Cpu, Store } from "lucide-react";

export const CoreServices = () => {
  const services = [
    {
      title: "DEJAR DE HACER TODO MANUAL",
      description: "Si hoy mandas WhatsApp uno por uno o copias datos de un lado a otro, eso lo automatizamos.",
      example: "Ej: Cliente compra → le llega su factura y aviso automatico",
      icon: Workflow,
      color: "from-primary/20",
      borderColor: "hover:border-primary/50"
    },
    {
      title: "TU PAGINA WEB + CORREO PROFESIONAL",
      description: "Que tus clientes te encuentren en Google y te vean formal. Con correo de tu empresa, no Gmail.",
      example: "Ej: tuempresa.com + hola@tuempresa.com listos en dias",
      icon: Store,
      color: "from-secondary/20",
      borderColor: "hover:border-secondary/50"
    },
    {
      title: "TIENDA ONLINE O CATALOGO",
      description: "Vende por internet con Shopify o muestra tu catalogo en linea. Pagos, envios y todo incluido.",
      example: "Ej: Tu tienda online lista para vender en una semana",
      icon: TrendingUp,
      color: "from-accent/20",
      borderColor: "hover:border-accent/50"
    },
    {
      title: "TU PROPIO SISTEMA (DEJA EL EXCEL)",
      description: "Cotizador, portal de clientes, control de inventario. Tu sistema web en vez de hojas de calculo.",
      example: "Ej: Cotiza desde tu celular y el cliente recibe PDF profesional",
      icon: Cpu,
      color: "from-orange-500/20",
      borderColor: "hover:border-orange-500/50"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item: any = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section id="servicios" className="py-32 bg-card/30 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Como te <span className="gradient-text">ayudamos</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            No importa si es algo sencillo o complejo. Lo hacemos por fases, a tu presupuesto.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 gap-8"
        >
          {services.map((srv, idx) => (
            <motion.div 
              key={idx}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className={`p-10 rounded-3xl bg-gradient-to-br ${srv.color} to-background border-2 border-border/50 ${srv.borderColor} transition-all duration-300 relative overflow-hidden group cursor-pointer backdrop-blur-xl shadow-card`}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="mb-6 inline-flex items-center justify-center p-4 rounded-2xl bg-background border border-border shadow-inner">
                <srv.icon className="h-8 w-8 text-foreground" />
              </div>
              
              <h3 className="text-2xl font-black mb-4 tracking-tight">
                {srv.title}
              </h3>
              
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {srv.description}
              </p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 border border-border/50 text-sm font-semibold text-foreground">
                <span className="text-primary text-lg leading-none">•</span> {srv.example}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
