import { MessageCircle, FileText, Code, Rocket } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: MessageCircle,
    title: "Platicamos",
    desc: "Nos cuentas que necesitas y como trabaja tu negocio hoy. Sin compromisos, sin jerga tecnica.",
  },
  {
    num: "02",
    icon: FileText,
    title: "Te proponemos",
    desc: "Te decimos que se puede hacer, cuanto cuesta y en cuanto tiempo. Con precio fijo, sin sorpresas.",
  },
  {
    num: "03",
    icon: Code,
    title: "Lo construimos",
    desc: "Desarrollamos tu proyecto y te lo mostramos en cada avance. Tu opinas, nosotros ajustamos.",
  },
  {
    num: "04",
    icon: Rocket,
    title: "Lo lanzamos",
    desc: "Tu pagina o sistema sale en vivo. Te ensenamos a usarlo y te acompanamos despues.",
  },
];

export const Methodology = () => {
  return (
    <section id="proceso" className="py-24 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-blue-400 mb-3 uppercase tracking-wider">Proceso</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            4 pasos. Sin sorpresas.
          </h2>
          <p className="text-lg text-slate-400">
            Asi funciona cada proyecto con nosotros.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/30 hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="text-3xl font-bold text-slate-700 mb-4 group-hover:text-blue-500/50 transition-colors">
                {step.num}
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <step.icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
          <p className="text-slate-300 font-medium">
            No tienes que hacer todo de una vez. Empezamos con lo que mas necesitas y vamos creciendo juntos.
          </p>
        </div>
      </div>
    </section>
  );
};
