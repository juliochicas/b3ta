"use client";

import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Fase 1: Tu Presencia",
    price: "$500",
    desc: "Tu pagina web, correo profesional y que te encuentren en Google.",
    features: ["Pagina web profesional", "Correo con tu dominio", "Hosting y SSL incluido", "Se ve bien en celular", "SEO para Google", "WhatsApp y formulario"],
    cta: "Empezar con mi pagina",
    popular: false,
  },
  {
    name: "Fase 2: Tu Sistema",
    price: "$650",
    desc: "Deja el Excel. Tu propio cotizador, portal de clientes o sistema a medida.",
    features: ["Todo lo de Fase 1", "Tu propia app web", "Login con usuarios", "Cotizador o facturador", "Base de datos en la nube", "Soporte post-lanzamiento"],
    cta: "Cotizar mi sistema",
    popular: true,
  },
  {
    name: "Fase 3: Todo Automatico",
    price: "$1,000",
    desc: "WhatsApp bot, notificaciones automaticas, tienda online. Tu negocio funciona solo.",
    features: ["Todo lo de Fase 2", "Tienda Shopify conectada", "Bot WhatsApp con IA", "Notificaciones automaticas", "Reportes y dashboards", "Integracion con ERPs"],
    cta: "Ver si aplica para mi",
    popular: false,
  },
];

export const PricingSection = () => {
  const scrollTo = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="precios" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Empieza con lo que necesitas hoy
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            No tienes que hacer todo de una vez. Elige la fase que se ajusta a tu presupuesto.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={`rounded-xl p-8 border-2 relative ${plan.popular ? "border-amber-400 shadow-lg" : "border-gray-100 hover:border-gray-200"} bg-white transition-all`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-400 text-slate-900 text-xs font-bold px-4 py-1 rounded-full">Mas popular</span>
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
              <p className="text-sm text-slate-500 mb-5 min-h-[40px]">{plan.desc}</p>
              <div className="mb-6">
                <span className="text-xs text-slate-400 uppercase">Desde</span>
                <div className="text-4xl font-bold text-slate-900">{plan.price} <span className="text-base font-normal text-slate-400">USD</span></div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? "text-amber-500" : "text-teal-600"}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={scrollTo} className={`w-full py-3 rounded-full font-semibold text-sm cursor-pointer transition-colors ${plan.popular ? "bg-amber-400 hover:bg-amber-500 text-slate-900" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}>
                {plan.cta} <ArrowRight className="inline w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-400 mt-6">Cada proyecto se cotiza segun tus necesidades.</p>
      </div>
    </section>
  );
};
