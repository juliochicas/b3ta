import { motion } from "framer-motion";
import { Workflow, ShoppingCart, TrendingUp, Cpu, Store } from "lucide-react";

export const CoreServices = () => {
  const services = [
    {
      title: "AUTOMATIZACION CON N8N",
      description: "Conectamos tus apps con flujos automaticos. Si hoy lo haces a mano, probablemente se puede automatizar.",
      example: "Ej: Pedido en Shopify → factura en SAP → aviso al cliente por WhatsApp",
      icon: Workflow,
      color: "from-primary/20",
      borderColor: "hover:border-primary/50"
    },
    {
      title: "SAP B1 + PUNTO DE VENTA",
      description: "Implementamos SAP Business One y POS conectado. Tu tienda fisica y online ven el mismo inventario.",
      example: "Venta en sucursal → SAP actualiza stock → Shopify refleja disponibilidad",
      icon: Store,
      color: "from-secondary/20",
      borderColor: "hover:border-secondary/50"
    },
    {
      title: "SEO PROGRAMATICO",
      description: "Generamos miles de paginas optimizadas a partir de tu catalogo de productos, con schema markup.",
      example: "Ej: 4,057 paginas indexadas para un portal de celulares en Guatemala",
      icon: TrendingUp,
      color: "from-accent/20",
      borderColor: "hover:border-accent/50"
    },
    {
      title: "APPS Y DASHBOARDS A MEDIDA",
      description: "Paneles de control, portales B2B y herramientas internas hechas en React + Supabase.",
      example: "Ej: Portal de clientes con cotizaciones, reportes y firmas digitales",
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
    <section id="servicios" className="py-24 bg-card/30 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Lo que <span className="gradient-text">hacemos</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Estas son las areas donde podemos ayudarte.
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
