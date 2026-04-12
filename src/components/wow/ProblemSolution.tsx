import { FileSpreadsheet, Search, Clock, Smartphone, Mail, Users } from "lucide-react";

const problems = [
  {
    icon: FileSpreadsheet,
    title: "Todo en Excel y Word",
    desc: "Cotizas en Excel, llevas clientes en Word y pierdes archivos. Necesitas un sistema, no mas hojas.",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: Search,
    title: "No te encuentran en Google",
    desc: "Tus clientes buscan tu servicio pero no apareces. Si no tienes pagina web, no existes para ellos.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Clock,
    title: "Todo lo haces manual",
    desc: "Mandas WhatsApp uno por uno, cotizas a mano, facturas a mano. Se te va el dia en tareas repetitivas.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Mail,
    title: "Correo de Gmail o Hotmail",
    desc: "Le mandas cotizaciones desde un @gmail.com y el cliente no te ve profesional. Necesitas tu propio correo.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Smartphone,
    title: "No tienes portal para clientes",
    desc: "Tu cliente quiere ver su estado de cuenta o historial pero tiene que llamarte. Un portal resuelve eso.",
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
  {
    icon: Users,
    title: "No tienes presupuesto para todo",
    desc: "Sabes que necesitas digitalizarte pero no puedes gastar todo de una vez. Necesitas hacerlo por fases.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
];

export const ProblemSolution = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wider">El problema</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Si algo de esto te suena, podemos ayudarte.
          </h2>
          <p className="text-lg text-slate-500">
            Son los problemas mas comunes que nos cuentan nuestros clientes en Guatemala.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`w-11 h-11 rounded-lg ${p.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <p.icon className={`w-5 h-5 ${p.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{p.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
