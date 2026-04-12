import { MessageCircle, FileText, Code, Rocket } from "lucide-react";

const steps = [
  {
    num: "1",
    icon: MessageCircle,
    title: "Platicamos",
    desc: "Nos cuentas que necesitas y como trabaja tu negocio hoy. Sin compromisos, sin jerga tecnica.",
  },
  {
    num: "2",
    icon: FileText,
    title: "Te proponemos",
    desc: "Te decimos que se puede hacer, cuanto cuesta y en cuanto tiempo. Con precio fijo, sin sorpresas.",
  },
  {
    num: "3",
    icon: Code,
    title: "Lo construimos",
    desc: "Desarrollamos tu proyecto y te lo mostramos en cada avance. Tu opinas, nosotros ajustamos.",
  },
  {
    num: "4",
    icon: Rocket,
    title: "Lo lanzamos",
    desc: "Tu pagina o sistema sale en vivo. Te ensenamos a usarlo y te acompanamos despues del lanzamiento.",
  },
];

export const Methodology = () => {
  return (
    <section id="proceso" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Como trabajamos
          </h2>
          <p className="text-lg text-zinc-500 max-w-xl mx-auto">
            Simple: platicamos, te cotizamos, lo hacemos, lo lanzamos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 rounded-full bg-zinc-900 text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                {step.num}
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 rounded-lg bg-zinc-50 border border-zinc-200 text-center">
          <p className="text-zinc-600 font-medium">
            No tienes que hacer todo de una vez. Empezamos con lo que mas necesitas y vamos creciendo juntos.
          </p>
        </div>
      </div>
    </section>
  );
};
