import { ExternalLink } from "lucide-react";

const projects = [
  {
    name: "Grupo Syst",
    url: "https://www.gruposyst.com",
    category: "Ecosistema Completo",
    desc: "B2B, B2C, portales, ERP con IA, POS, RRHH. 30+ modulos, 500+ emprendedores, 4,500+ productos.",
  },
  {
    name: "Modularis ERP",
    url: "https://modularis.pro",
    category: "ERP con IA",
    desc: "ERP propio con 18 modulos, 105+ endpoints, 6 proveedores de IA integrados. Operacion 24/7.",
  },
  {
    name: "Top Movil",
    url: "https://topmovil.com.gt",
    category: "E-commerce Shopify",
    desc: "Tienda de accesorios para celulares en Guatemala. Shopify + SEO programatico con 4,000+ paginas.",
  },
  {
    name: "Realis AI",
    url: "https://www.getrealis.ai",
    category: "SaaS / IA",
    desc: "Plataforma de videos UGC con avatares IA. +50,000 videos creados. Sin actores, 90% menos costos.",
  },
  {
    name: "GeoLead Pro",
    url: "https://www.geolead.ai",
    category: "SaaS / Prospeccion",
    desc: "Extraccion de leads con IA + OSINT desde Instagram, Facebook y LinkedIn. 65+ paises.",
  },
  {
    name: "Vixela",
    url: "https://www.vixela.app",
    category: "SaaS / E-commerce",
    desc: "IA que transforma fotos de productos en imagenes profesionales en 3 segundos. 1,200+ vendedores.",
  },
  {
    name: "DoctoresCV+",
    url: "https://doctorescv.com",
    category: "Pagina Web + Reservas",
    desc: "Plataforma de medicina estetica y capilar. Tienda, reservas online, multi-idioma.",
  },
  {
    name: "Silvia Sett",
    url: "https://silviasett.com",
    category: "Landing Page",
    desc: "Cosmiatra especialista en acne en Chiquimula. 40 anos de experiencia. Reservas + WhatsApp.",
  },
  {
    name: "Vianney",
    url: "#",
    category: "E-commerce",
    desc: "Tienda online de ropa de cama premium en Guatemala. Catalogo, pagos y envios nacionales.",
  },
  {
    name: "Katherine Angulo",
    url: "#",
    category: "Web + CRM + MVP",
    desc: "Sistema completo para psicologa clinica. Pagina web, agendamiento, CRM y atencion virtual.",
  },
  {
    name: "Famy",
    url: "https://famy.juliochicas.com",
    category: "App a Medida",
    desc: "App para familias divorciadas. Calendario, custodia, presupuesto, tareas, medicinas. 12+ modulos.",
  },
  {
    name: "Mundo Accesorios",
    url: "https://www.mundoaccesorios.com.gt",
    category: "WMS + E-commerce",
    desc: "Sistema de bodega (WMS), cargo expreso, Dropi, portal de clientes. Todo en WordPress.",
  },
  {
    name: "SAP + Cargo Expreso",
    url: "#",
    category: "Automatizacion",
    desc: "Flujo automatico: cuando SAP hace picking, Cargo Expreso recibe la orden de envio. Cero manual.",
  },
  {
    name: "Shopify + SAP B1 HANA",
    url: "#",
    category: "Integracion ERP",
    desc: "Pedidos de Shopify entran a SAP automaticamente. Inventario, facturacion y envios sincronizados en tiempo real.",
  },
  {
    name: "JulioChicas.com",
    url: "https://juliochicas.com",
    category: "Portafolio Personal",
    desc: "Builder & Consultor Tech. MVPs, automatizacion con IA, sourcing China-LATAM. +17 anos.",
  },
];

export const Portfolio = () => {
  return (
    <section id="portafolio" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Proyectos que hemos construido
          </h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
            Desde una landing page sencilla hasta un ERP con IA de 30 modulos. Cada proyecto empezo con una conversacion.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <a
              key={i}
              href={p.url}
              target={p.url !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group p-5 rounded-lg border border-zinc-200 hover:border-zinc-400 transition-colors block"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
                  {p.category}
                </span>
                {p.url !== "#" && (
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                )}
              </div>
              <h3 className="text-base font-semibold text-zinc-900 mb-1">{p.name}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{p.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
