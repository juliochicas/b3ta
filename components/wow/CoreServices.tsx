import { Globe, ShoppingBag, Zap, BarChart3 } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Tu Pagina Web + Correo Profesional",
    desc: "Que tus clientes te encuentren en Google y te vean formal. Con correo de tu empresa, no Gmail.",
    example: "tuempresa.com + hola@tuempresa.com listos en dias",
  },
  {
    icon: ShoppingBag,
    title: "Tienda Online o Catalogo",
    desc: "Vende por internet con Shopify o muestra tu catalogo en linea. Pagos, envios y todo incluido.",
    example: "Tu tienda online lista para vender en una semana",
  },
  {
    icon: BarChart3,
    title: "Tu Propio Sistema (Deja el Excel)",
    desc: "Cotizador, portal de clientes, control de inventario. Tu sistema web en vez de hojas de calculo.",
    example: "Cotiza desde tu celular y el cliente recibe PDF profesional",
  },
  {
    icon: Zap,
    title: "Dejar de Hacer Todo Manual",
    desc: "Si hoy mandas WhatsApp uno por uno o copias datos de un lado a otro, eso lo automatizamos.",
    example: "Cliente compra → le llega su factura y aviso automatico",
  },
];

export const CoreServices = () => {
  return (
    <section id="servicios" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Como te ayudamos
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            No importa si es algo sencillo o complejo. Lo hacemos por fases, a tu presupuesto.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-700 flex items-center justify-center mb-5 group-hover:bg-teal-600 transition-colors">
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-4">{s.desc}</p>
              <p className="text-sm text-teal-700 font-semibold">→ {s.example}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
