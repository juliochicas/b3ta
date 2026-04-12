import { ExternalLink } from "lucide-react";

const projects = [
  {
    name: "Grupo Syst",
    url: "https://www.gruposyst.com",
    category: "Ecosistema Completo",
    desc: "B2B, B2C, portales, ERP con IA, POS, RRHH. 30+ modulos, 500+ emprendedores.",
    highlight: true,
  },
  {
    name: "Modularis ERP",
    url: "https://modularis.pro",
    category: "ERP con IA",
    desc: "ERP propio con 18 modulos, 105+ endpoints, 6 proveedores de IA. 24/7.",
    highlight: true,
  },
  {
    name: "Top Movil",
    url: "https://topmovil.com.gt",
    category: "E-commerce Shopify",
    desc: "Tienda de accesorios para celulares. SEO programatico con 4,000+ paginas.",
    highlight: false,
  },
  {
    name: "Realis AI",
    url: "https://www.getrealis.ai",
    category: "SaaS / IA",
    desc: "Videos UGC con avatares IA. +50,000 videos creados. Sin actores.",
    highlight: true,
  },
  {
    name: "GeoLead Pro",
    url: "https://www.geolead.ai",
    category: "SaaS / Prospeccion",
    desc: "Extraccion de leads con IA + OSINT. Instagram, Facebook, LinkedIn. 65+ paises.",
    highlight: false,
  },
  {
    name: "Vixela",
    url: "https://www.vixela.app",
    category: "SaaS / E-commerce",
    desc: "Fotos de producto profesionales con IA en 3 segundos. 1,200+ vendedores.",
    highlight: false,
  },
  {
    name: "ChateaYA",
    url: "https://chateaya.app",
    category: "SaaS / Chatbots",
    desc: "WhatsApp, Instagram, Facebook en un solo lugar. Chatbots con IA. 500+ empresas.",
    highlight: true,
  },
  {
    name: "DoctoresCV+",
    url: "https://doctorescv.com",
    category: "Web + Reservas",
    desc: "Medicina estetica y capilar. Tienda, reservas online, multi-idioma.",
    highlight: false,
  },
  {
    name: "Silvia Sett",
    url: "https://silviasett.com",
    category: "Landing Page",
    desc: "Cosmiatra en Chiquimula. 40 anos de experiencia. Reservas + WhatsApp.",
    highlight: false,
  },
  {
    name: "Vianney",
    url: "#",
    category: "E-commerce",
    desc: "Ropa de cama premium en Guatemala. Catalogo, pagos y envios.",
    highlight: false,
  },
  {
    name: "Katherine Angulo",
    url: "#",
    category: "Web + CRM + MVP",
    desc: "Psicologa clinica. Pagina web, agendamiento, CRM y atencion virtual.",
    highlight: false,
  },
  {
    name: "Famy",
    url: "https://famy.juliochicas.com",
    category: "App a Medida",
    desc: "App para familias divorciadas. Calendario, custodia, presupuesto. 12+ modulos.",
    highlight: false,
  },
  {
    name: "Mundo Accesorios",
    url: "https://www.mundoaccesorios.com.gt",
    category: "WMS + E-commerce",
    desc: "Sistema de bodega (WMS), cargo expreso, Dropi, portal de clientes.",
    highlight: false,
  },
  {
    name: "Nano Banana Pro",
    url: "#",
    category: "IA / E-commerce",
    desc: "Generador de imagenes con angulos de venta para Shopify y redes sociales.",
    highlight: false,
  },
  {
    name: "Cargo Expreso + Shopify",
    url: "#",
    category: "Plugin Shopify",
    desc: "Pago contra entrega integrado en checkout. Formulario por departamento/municipio.",
    highlight: false,
  },
  {
    name: "Validador NIT",
    url: "#",
    category: "Plugin Shopify",
    desc: "Valida NIT en tiempo real con Digifact al momento del checkout.",
    highlight: false,
  },
  {
    name: "Shopify + SAP B1",
    url: "#",
    category: "Integracion ERP",
    desc: "Pedidos, inventario y facturacion sincronizados automaticamente.",
    highlight: false,
  },
  {
    name: "SAP + Cargo Expreso",
    url: "#",
    category: "Automatizacion",
    desc: "Picking en SAP → orden de envio en Cargo Expreso. Cero manual.",
    highlight: false,
  },
  {
    name: "Prospeccion B2B",
    url: "#",
    category: "CRM + Automatizacion",
    desc: "Prospector automatico. WhatsApp masivo, multi-pais (GT, HN, SV).",
    highlight: false,
  },
  {
    name: "JulioChicas.com",
    url: "https://juliochicas.com",
    category: "Portafolio",
    desc: "Builder & Consultor Tech. MVPs, automatizacion, China-LATAM. +17 anos.",
    highlight: false,
  },
];

export const Portfolio = () => {
  const highlighted = projects.filter((p) => p.highlight);
  const rest = projects.filter((p) => !p.highlight);

  return (
    <section id="portafolio" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wider">Portafolio</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            20 proyectos. Desde landing pages hasta ERPs con IA.
          </h2>
          <p className="text-lg text-slate-500">
            Cada proyecto empezo con una conversacion. Nos gustan los retos.
          </p>
        </div>

        {/* Highlighted projects — larger cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          {highlighted.map((p, i) => (
            <a
              key={i}
              href={p.url}
              target={p.url !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all duration-200 block"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
                  {p.category}
                </span>
                {p.url !== "#" && (
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{p.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
            </a>
          ))}
        </div>

        {/* Rest of projects — compact grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rest.map((p, i) => (
            <a
              key={i}
              href={p.url}
              target={p.url !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group p-4 rounded-lg border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all duration-200 block"
            >
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {p.category}
              </span>
              <h3 className="text-sm font-semibold text-slate-900 mt-1 mb-1 flex items-center gap-1.5">
                {p.name}
                {p.url !== "#" && (
                  <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" />
                )}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
