import { FileSpreadsheet, Search, Clock, Smartphone, Mail, Users } from "lucide-react";

const problems = [
  {
    icon: FileSpreadsheet,
    title: "Todo en Excel y Word",
    desc: "Cotizas en Excel, llevas clientes en Word y pierdes archivos. Necesitas un sistema, no mas hojas.",
  },
  {
    icon: Search,
    title: "No te encuentran en Google",
    desc: "Tus clientes buscan tu servicio pero no apareces. Si no tienes pagina web, no existes para ellos.",
  },
  {
    icon: Clock,
    title: "Todo lo haces manual",
    desc: "Mandas WhatsApp uno por uno, cotizas a mano, facturas a mano. Se te va el dia en tareas repetitivas.",
  },
  {
    icon: Mail,
    title: "Correo de Gmail o Hotmail",
    desc: "Le mandas cotizaciones desde un @gmail.com y el cliente no te ve profesional. Necesitas tu propio correo.",
  },
  {
    icon: Smartphone,
    title: "No tienes portal para clientes",
    desc: "Tu cliente quiere ver su estado de cuenta o historial pero tiene que llamarte. Un portal resuelve eso.",
  },
  {
    icon: Users,
    title: "No tienes presupuesto para todo",
    desc: "Sabes que necesitas digitalizarte pero no puedes gastar todo de una vez. Necesitas hacerlo por fases.",
  },
];

export const ProblemSolution = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Si algo de esto te suena, podemos ayudarte.
          </h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
            Son los problemas mas comunes que nos cuentan nuestros clientes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <div
              key={i}
              className="p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center mb-4">
                <p.icon className="w-5 h-5 text-zinc-600" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">{p.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
