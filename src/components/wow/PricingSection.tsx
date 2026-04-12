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
    <section id="precios" className="py-24 bg-zinc-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Precios claros. Sin letras chiquitas.
          </h2>
          <p className="text-lg text-zinc-500 max-w-xl mx-auto">
            Precio fijo por proyecto. Sabes exactamente que vas a recibir y cuanto te va a costar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`bg-white rounded-lg p-8 border ${
                plan.popular ? "border-zinc-900 ring-1 ring-zinc-900" : "border-zinc-200"
              } relative`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-zinc-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Mas popular
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-zinc-900 mb-1">{plan.name}</h3>
              <p className="text-sm text-zinc-500 mb-4 h-10">{plan.desc}</p>

              <div className="mb-6">
                <span className="text-sm text-zinc-400">Desde</span>
                <div className="text-4xl font-bold text-zinc-900">
                  {plan.price} <span className="text-base font-normal text-zinc-400">USD</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-zinc-600">
                    <Check className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                onClick={scrollToContact}
                className={`w-full ${
                  plan.popular
                    ? "bg-zinc-900 text-white hover:bg-zinc-800"
                    : "bg-white text-zinc-900 border border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                {plan.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-zinc-400 mt-8">
          Los precios son referenciales. Cada proyecto se cotiza segun tus necesidades.
        </p>
      </div>
    </section>
  );
};
