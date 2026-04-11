import { motion } from "framer-motion";
import { ShoppingBag, Box, Database, Workflow, Monitor, ServerCog, Store } from "lucide-react";

export const TechLogos = () => {
  const logos = [
    { name: "Shopify Partner", icon: ShoppingBag },
    { name: "Modularis.pro ERP", icon: ServerCog },
    { name: "WordPress POS", icon: Store },
    { name: "SAP Business One", icon: Database },
    { name: "n8n / Make", icon: Workflow },
    // Duplicate list for seamless infinite scroll
    { name: "Shopify Partner", icon: ShoppingBag },
    { name: "Modularis.pro ERP", icon: ServerCog },
    { name: "WordPress POS", icon: Store },
    { name: "SAP Business One", icon: Database },
    { name: "n8n / Make", icon: Workflow },
  ];

  return (
    <div className="w-full bg-background border-y border-border/30 py-10 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      
      <div className="container mx-auto px-4 mb-8 text-center relative z-20">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.3em]">
          Tecnologias con las que trabajamos
        </p>
      </div>

      <div className="relative w-full flex overflow-hidden">
        <motion.div 
          className="flex gap-20 items-center whitespace-nowrap pl-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        >
          {logos.map((logo, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer"
            >
              <logo.icon className="w-8 h-8 text-foreground" />
              <span className="text-2xl font-black tracking-tighter text-foreground">
                {logo.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
