import { MessageCircle, FileText, Code, Rocket } from "lucide-react";

const steps = [
  { num: "1", icon: MessageCircle, title: "Platicamos", desc: "Nos cuentas que haces en Excel, como atiendes clientes, que te gustaria tener. Sin jerga tecnica." },
  { num: "2", icon: FileText, title: "Te cotizamos", desc: "Te decimos que se puede hacer, cuanto cuesta y en cuanto tiempo. Precio fijo, sin sorpresas." },
  { num: "3", icon: Code, title: "Lo construimos", desc: "Te lo mostramos en cada avance. Tu opinas, nosotros ajustamos. Nada de esperar meses sin ver nada." },
  { num: "4", icon: Rocket, title: "Lo lanzamos", desc: "Tu pagina o sistema sale en vivo. Te ensenamos a usarlo. Cuando quieras la siguiente fase, aqui estamos." },
];

export const Methodology = () => {
  return (
    <section id="proceso" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            4 pasos, sin sorpresas
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            No tienes que hacer todo de una vez. Empezamos con lo que mas necesitas.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 rounded-full bg-teal-700 text-white flex items-center justify-center mx-auto mb-5 text-xl font-bold">
                {s.num}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
