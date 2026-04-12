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
    <section id="servicios" className="py-24 bg-zinc-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Que hacemos
          </h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
            Desde una pagina web sencilla hasta un sistema completo. Tu decides hasta donde llegar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center mb-4">
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">{s.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-1 rounded"
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
