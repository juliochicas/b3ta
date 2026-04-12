import { Globe, ShoppingBag, Zap, BarChart3, MessageCircle, Mail } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Pagina Web",
    desc: "Tu sitio profesional en WordPress o a medida. Que la gente te encuentre en Google y te vea formal.",
    tags: ["WordPress", "SEO", "Responsive"],
  },
  {
    icon: ShoppingBag,
    title: "Tienda Online",
    desc: "Vende tus productos por internet con Shopify. Recibe pagos, gestiona pedidos y envia desde un solo lugar.",
    tags: ["Shopify", "Pagos", "Inventario"],
  },
  {
    icon: Zap,
    title: "Automatizacion",
    desc: "Conectamos tus herramientas para que dejes de hacer cosas a mano. Pedidos, facturas y avisos automaticos.",
    tags: ["n8n", "WhatsApp", "SAP"],
  },
  {
    icon: BarChart3,
    title: "Sistemas a Medida",
    desc: "Cotizadores, dashboards, portales de clientes. Tu propio sistema web en vez de Excel.",
    tags: ["React", "Supabase", "Apps"],
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Bot",
    desc: "Un asistente que responde a tus clientes 24/7 con la info de tu negocio. Tu duermes, el atiende.",
    tags: ["Bot IA", "24/7", "Atencion"],
  },
  {
    icon: Mail,
    title: "Correo y Hosting",
    desc: "Tu correo con tu dominio (hola@tuempresa.com), hosting rapido y SSL. Todo configurado.",
    tags: ["Email", "Hosting", "SSL"],
  },
];

export const CoreServices = () => {
  return (
    <section id="servicios" className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wider">Servicios</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Que hacemos
          </h2>
          <p className="text-lg text-slate-400">
            Desde una pagina web sencilla hasta un sistema completo. Tu decides hasta donde llegar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-blue-500/30 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-11 h-11 rounded-lg bg-slate-900 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-200">
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
