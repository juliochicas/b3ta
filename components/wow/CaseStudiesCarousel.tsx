"use client";

import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const projects = [
  { name: "Grupo Syst", url: "https://www.gruposyst.com", desc: "Ecosistema completo: B2B, B2C, portales, ERP con IA, POS, RRHH. 30+ modulos, 500+ emprendedores." },
  { name: "Modularis ERP", url: "https://modularis.pro", desc: "ERP propio con 18 modulos, 105+ endpoints de API, 6 proveedores de IA integrados. Operacion 24/7." },
  { name: "Realis AI", url: "https://www.getrealis.ai", desc: "Plataforma de videos UGC con avatares IA. +50,000 videos creados. Sin actores, 90% menos costos." },
  { name: "ChateaYA", url: "https://chateaya.app", desc: "WhatsApp, Instagram, Facebook en un solo lugar. Chatbots con IA. 500+ empresas activas." },
  { name: "GeoLead Pro", url: "https://www.geolead.ai", desc: "Extraccion de leads con IA + OSINT desde Instagram, Facebook y LinkedIn. 65+ paises." },
  { name: "Top Movil", url: "https://topmovil.com.gt", desc: "Tienda de accesorios para celulares. SEO programatico con 4,000+ paginas indexadas." },
  { name: "Vixela", url: "https://www.vixela.app", desc: "IA que transforma fotos de productos en imagenes profesionales en 3 segundos. 1,200+ vendedores." },
  { name: "DoctoresCV+", url: "https://doctorescv.com", desc: "Plataforma de medicina estetica. Tienda, reservas online y multi-idioma." },
  { name: "Silvia Sett", url: "https://silviasett.com", desc: "Landing page para cosmiatra. 40 anos de experiencia. Reservas y WhatsApp directo." },
];

const more = [
  "Vianney — E-commerce ropa de cama",
  "Katherine Angulo — Web + CRM psicologa",
  "Famy — App familias, 12+ modulos",
  "Mundo Accesorios — WMS + WordPress",
  "Nano Banana Pro — Generador imagenes IA",
  "Cargo Expreso + Shopify — Contra entrega",
  "Validador NIT — Plugin Digifact",
  "Shopify + SAP B1 — Sync automatica",
  "Prospeccion B2B — CRM automatico",
];

export const CaseStudiesCarousel = () => {
  const [idx, setIdx] = useState(0);
  const p = projects[idx];

  return (
    <section id="casos" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Mira lo que hemos construido
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Desde paginas web sencillas hasta sistemas completos con IA. Cada uno empezo con una platica.
          </p>
        </div>

        {/* Featured project carousel */}
        <div className="bg-teal-800 rounded-2xl p-8 md:p-10 text-white mb-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-semibold text-teal-200 bg-teal-700 px-3 py-1 rounded-full">
              Proyecto {idx + 1} de {projects.length}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setIdx((idx - 1 + projects.length) % projects.length)} className="w-9 h-9 rounded-full border border-teal-600 flex items-center justify-center text-teal-200 hover:bg-teal-700 cursor-pointer transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setIdx((idx + 1) % projects.length)} className="w-9 h-9 rounded-full border border-teal-600 flex items-center justify-center text-teal-200 hover:bg-teal-700 cursor-pointer transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold mb-3">{p.name}</h3>
          <p className="text-teal-100 leading-relaxed mb-6 max-w-2xl">{p.desc}</p>

          <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors">
            Ver proyecto <ExternalLink className="w-4 h-4" />
          </a>

          <div className="flex gap-1.5 mt-6">
            {projects.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full cursor-pointer transition-all ${i === idx ? "w-6 bg-amber-400" : "w-1.5 bg-teal-600"}`} />
            ))}
          </div>
        </div>

        {/* More projects */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-sm font-bold text-slate-900 mb-4">+ {more.length} proyectos mas</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {more.map((m, i) => (
              <p key={i} className="text-sm text-slate-500 py-1.5">{m}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
