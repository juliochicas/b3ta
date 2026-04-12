import { ExternalLink, ArrowRight } from "lucide-react";

const getThumb = (url: string) =>
  `https://image.thum.io/get/width/800/crop/450/${url}`;

const featured = [
  {
    name: "Grupo Syst",
    url: "https://www.gruposyst.com",
    category: "Ecosistema B2B/B2C",
    desc: "30+ modulos, POS, RRHH, portales, IA. 500+ emprendedores.",
  },
  {
    name: "Modularis ERP",
    url: "https://modularis.pro",
    category: "ERP con IA",
    desc: "18 modulos, 105+ endpoints, 6 proveedores de IA.",
  },
  {
    name: "Realis AI",
    url: "https://www.getrealis.ai",
    category: "SaaS",
    desc: "Videos UGC con avatares IA. +50K videos creados.",
  },
  {
    name: "ChateaYA",
    url: "https://chateaya.app",
    category: "SaaS",
    desc: "Chat multi-canal con bots IA. 500+ empresas.",
  },
  {
    name: "GeoLead Pro",
    url: "https://www.geolead.ai",
    category: "SaaS",
    desc: "Leads con IA + OSINT. 65+ paises.",
  },
  {
    name: "Top Movil",
    url: "https://topmovil.com.gt",
    category: "E-commerce",
    desc: "Shopify + SEO programatico. 4,000+ paginas.",
  },
  {
    name: "Vixela",
    url: "https://www.vixela.app",
    category: "SaaS",
    desc: "Fotos de producto con IA. 1,200+ vendedores.",
  },
  {
    name: "DoctoresCV+",
    url: "https://doctorescv.com",
    category: "Web + Reservas",
    desc: "Medicina estetica. Tienda y reservas online.",
  },
  {
    name: "Silvia Sett",
    url: "https://silviasett.com",
    category: "Landing Page",
    desc: "Cosmiatra en Chiquimula. 40 anos de experiencia.",
  },
];

const more = [
  "Vianney — E-commerce de ropa de cama premium",
  "Katherine Angulo — Web + CRM para psicologa clinica",
  "Famy — App para familias divorciadas, 12+ modulos",
  "Mundo Accesorios — WMS + WordPress + Dropi",
  "Nano Banana Pro — Generador de imagenes con IA",
  "Cargo Expreso + Shopify — Pago contra entrega",
  "Validador NIT — Plugin Digifact para Shopify",
  "Shopify + SAP B1 HANA — Sincronizacion automatica",
  "SAP + Cargo Expreso — Automatizacion de envios",
  "Prospeccion B2B — CRM automatico multi-pais",
  "JulioChicas.com — Portafolio personal del founder",
];

export const Portfolio = () => {
  return (
    <section id="portafolio" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wider">Portafolio</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            20 proyectos reales. Desde landing pages hasta ERPs.
          </h2>
          <p className="text-lg text-slate-500">
            Cada proyecto empezo con una conversacion. Nos gustan los retos.
          </p>
        </div>

        {/* Featured grid with images */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {featured.map((p, i) => (
            <a
              key={i}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-full aspect-video bg-slate-100 overflow-hidden relative">
                <img
                  src={getThumb(p.url)}
                  alt={p.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-slate-900">{p.name}</h3>
                  <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {p.category}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{p.desc}</p>
              </div>
            </a>
          ))}
        </div>

        {/* More projects — simple list */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">
            + {more.length} proyectos mas
          </h3>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {more.map((item, i) => (
              <p key={i} className="text-sm text-slate-500 py-1 border-b border-slate-100 last:border-0">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
