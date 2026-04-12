import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const featured = [
  {
    name: "Grupo Syst",
    url: "https://www.gruposyst.com",
    category: "Ecosistema B2B/B2C",
    desc: "30+ modulos integrados: POS, RRHH, portales B2B, dropshipping, generacion con IA. 500+ emprendedores activos y 4,500+ productos gestionados.",
    metrics: ["30+ modulos", "500+ empresas", "4,500+ productos"],
  },
  {
    name: "Modularis ERP",
    url: "https://modularis.pro",
    category: "ERP con IA",
    desc: "ERP propio con 18 modulos, 105+ endpoints de API, 6 proveedores de IA integrados (Claude, GPT, Gemini). Operacion 24/7 con asistente inteligente.",
    metrics: ["18 modulos", "105+ endpoints", "6 IAs integradas"],
  },
  {
    name: "Realis AI",
    url: "https://www.getrealis.ai",
    category: "SaaS — Video IA",
    desc: "Plataforma de videos UGC con avatares hiperrealistas generados por IA. Sin actores, 90% menos costos. Mas de 50,000 videos creados.",
    metrics: ["50K+ videos", "90% menos costo", "Sin actores"],
  },
  {
    name: "ChateaYA",
    url: "https://chateaya.app",
    category: "SaaS — Chatbots",
    desc: "Plataforma multi-canal que conecta WhatsApp, Instagram y Facebook en un solo lugar. Chatbots con IA y asignacion a equipos. 500+ empresas activas.",
    metrics: ["500+ empresas", "1M+ mensajes/mes", "99.9% uptime"],
  },
  {
    name: "GeoLead Pro",
    url: "https://www.geolead.ai",
    category: "SaaS — Prospeccion",
    desc: "Extraccion de leads con IA + OSINT desde Instagram, Facebook y LinkedIn. Emails verificados y datos de negocio en tiempo real. Cobertura en 65+ paises.",
    metrics: ["65+ paises", "OSINT + IA", "Emails verificados"],
  },
  {
    name: "Top Movil",
    url: "https://topmovil.com.gt",
    category: "E-commerce Shopify",
    desc: "Tienda de accesorios para celulares en Guatemala. SEO programatico con 4,000+ paginas indexadas. Integracion SAP + Cargo Expreso + validador NIT.",
    metrics: ["4,000+ paginas SEO", "SAP integrado", "Cargo Expreso"],
  },
];

const more = [
  { name: "Vixela", desc: "Fotos de producto con IA, 1,200+ vendedores", url: "https://www.vixela.app" },
  { name: "DoctoresCV+", desc: "Medicina estetica, reservas online", url: "https://doctorescv.com" },
  { name: "Silvia Sett", desc: "Cosmiatra, landing page + reservas", url: "https://silviasett.com" },
  { name: "Vianney", desc: "E-commerce ropa de cama premium", url: "#" },
  { name: "Katherine Angulo", desc: "Psicologa, web + CRM + MVP", url: "#" },
  { name: "Famy", desc: "App familias divorciadas, 12+ modulos", url: "#" },
  { name: "Mundo Accesorios", desc: "WMS + WordPress + Dropi", url: "https://www.mundoaccesorios.com.gt" },
  { name: "Nano Banana Pro", desc: "Generador imagenes con IA", url: "#" },
  { name: "Cargo Expreso + Shopify", desc: "Pago contra entrega", url: "#" },
  { name: "Validador NIT", desc: "Plugin Digifact para Shopify", url: "#" },
  { name: "Shopify + SAP B1", desc: "Sincronizacion automatica", url: "#" },
  { name: "SAP + Cargo Expreso", desc: "Automatizacion de envios", url: "#" },
  { name: "Prospeccion B2B", desc: "CRM automatico multi-pais", url: "#" },
  { name: "JulioChicas.com", desc: "Portafolio personal del founder", url: "https://juliochicas.com" },
];

export const Portfolio = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % featured.length);
  const prev = () => setCurrent((prev) => (prev - 1 + featured.length) % featured.length);

  const project = featured[current];

  return (
    <section id="portafolio" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wider">Portafolio</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            20 proyectos reales. Desde landing pages hasta ERPs.
          </h2>
          <p className="text-lg text-slate-600">
            Cada proyecto empezo con una conversacion. Nos gustan los retos.
          </p>
        </div>

        {/* Featured project — carousel */}
        <div className="bg-slate-900 rounded-2xl p-8 md:p-10 mb-8 relative">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
              {project.category}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={prev} className="w-9 h-9 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 cursor-pointer transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-500 min-w-[40px] text-center">{current + 1}/{featured.length}</span>
              <button onClick={next} className="w-9 h-9 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 cursor-pointer transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{project.name}</h3>
          <p className="text-base text-slate-300 leading-relaxed mb-6 max-w-2xl">{project.desc}</p>

          <div className="flex flex-wrap gap-3 mb-6">
            {project.metrics.map((m, i) => (
              <span key={i} className="text-sm font-medium text-white bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg">
                {m}
              </span>
            ))}
          </div>

          {project.url !== "#" && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Ver proyecto <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Dot indicators */}
          <div className="flex gap-1.5 mt-6">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full cursor-pointer transition-all ${
                  i === current ? "w-6 bg-blue-500" : "w-1.5 bg-slate-700 hover:bg-slate-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* More projects — grid */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">
            + {more.length} proyectos mas
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {more.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white transition-colors">
                <div>
                  <span className="text-sm font-medium text-slate-800">{p.name}</span>
                  <span className="text-xs text-slate-500 ml-2">{p.desc}</span>
                </div>
                {p.url !== "#" && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 ml-2">
                    <ExternalLink className="w-3 h-3 text-slate-400 hover:text-blue-500 transition-colors" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
