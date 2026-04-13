import { ArrowRight, MessageCircle } from "lucide-react";

export const HeroB3ta = () => {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center">
        <span className="inline-block text-sm font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full mb-8">
          Tu programador te dice "no se puede"? Nosotros si podemos.
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
          Deja el Excel.
          <br />
          <span className="text-teal-700">Ten tu propio sistema.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Pagina web, correo profesional, cotizador desde el celular, portal para tus clientes y que te encuentren en Google.
          <strong className="text-slate-800"> Empezamos con lo basico y creces a tu ritmo.</strong>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button onClick={() => scrollTo("contact")} className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold text-base px-8 py-4 rounded-full cursor-pointer transition-colors">
            Cotizar mi proyecto
            <ArrowRight className="h-5 w-5" />
          </button>
          <button onClick={() => window.open("https://wa.me/14355348065?text=" + encodeURIComponent("Hola, quiero saber mas sobre B3TA"), "_blank")} className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-semibold text-base px-8 py-4 rounded-full cursor-pointer transition-colors">
            <MessageCircle className="h-5 w-5" />
            Escribir por WhatsApp
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
          <span><strong className="text-slate-800">20+</strong> proyectos</span>
          <span><strong className="text-slate-800">12</strong> paises</span>
          <span><strong className="text-slate-800">Por fases</strong> a tu ritmo</span>
        </div>
      </div>
    </section>
  );
};
