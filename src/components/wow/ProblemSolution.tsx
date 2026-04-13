import { FileSpreadsheet, Search, Clock, Smartphone, Mail, Users } from "lucide-react";

const pains = [
  { icon: FileSpreadsheet, text: "Todo lo tengo en Excel y Word, quiero pasarlo a un sistema" },
  { icon: Search, text: "Mis clientes no me ven formal, no tengo pagina ni correo propio" },
  { icon: Clock, text: "No me encuentran en Google ni en redes" },
  { icon: Mail, text: "Las notificaciones a clientes las mando manual por WhatsApp" },
  { icon: Users, text: "No tengo mucho presupuesto, pero quiero empezar a ordenarme" },
  { icon: Smartphone, text: "Mi programador me dice 'no se puede' o tarda meses" },
];

export const ProblemSolution = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Esto nos dicen nuestros clientes
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Si te identificas con alguno, podemos ayudarte.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pains.map((p, i) => (
            <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-amber-200 hover:bg-amber-50/30 transition-all">
              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                <p.icon className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
