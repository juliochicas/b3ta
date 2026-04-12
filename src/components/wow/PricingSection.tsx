import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Presencia Digital",
    price: "$500",
    desc: "Para empezar. Tu pagina web, correo profesional y que te encuentren en Google.",
    features: [
      "Pagina web en WordPress",
      "Correo con tu dominio",
      "Hosting y SSL incluido",
      "Diseno responsive (celular y PC)",
      "SEO basico para Google",
      "Formulario de contacto + WhatsApp",
    ],
    cta: "Empezar con mi pagina",
    popular: false,
  },
  {
    name: "Sistema a Medida",
    price: "$650",
    desc: "Tu propio sistema web. Cotizador, panel de clientes, dashboard. Deja de usar Excel.",
    features: [
      "Todo lo del plan anterior",
      "Aplicacion web a medida",
      "Login con usuarios y roles",
      "Cotizador o facturador",
      "Base de datos en la nube",
      "Soporte post-lanzamiento",
    ],
    cta: "Cotizar mi sistema",
    popular: true,
  },
  {
    name: "Automatizacion Completa",
    price: "$1,000",
    desc: "Conectamos todo: tu tienda, SAP, WhatsApp bot, notificaciones automaticas.",
    features: [
      "Todo lo del plan anterior",
      "Integracion SAP / ERP",
      "Tienda Shopify conectada",
      "Bot de WhatsApp con IA",
      "Automatizacion de procesos",
      "Reportes y dashboards",
    ],
    cta: "Ver si aplica para mi",
    popular: false,
  },
];

export const PricingSection = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="precios" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wider">Precios</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Precios claros. Sin letras chiquitas.
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Precio fijo por proyecto. Sabes exactamente que vas a recibir.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl p-8 border-2 transition-all duration-200 relative ${
                plan.popular
                  ? "border-blue-600 shadow-lg shadow-blue-600/10"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Mas popular
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
              <p className="text-sm text-slate-600 mb-4 min-h-[40px]">{plan.desc}</p>

              <div className="mb-6">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Desde</span>
                <div className="text-4xl font-bold text-slate-900">
                  {plan.price} <span className="text-base font-normal text-slate-400">USD</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? "text-blue-600" : "text-slate-400"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={scrollToContact}
                className={`w-full h-11 rounded-lg inline-flex items-center justify-center gap-2 font-medium text-sm cursor-pointer transition-colors ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-400 mt-8">
          Los precios son referenciales. Cada proyecto se cotiza segun tus necesidades.
        </p>
      </div>
    </section>
  );
};
