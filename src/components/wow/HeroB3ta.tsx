import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

export const HeroB3ta = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-slate-950 pt-20 overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-blue-400">Consultoria tech — Guatemala y LATAM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Tu negocio merece mas que un Excel y un WhatsApp.
            </h1>

            <p className="text-lg text-slate-300 mb-4 leading-relaxed max-w-lg">
              Pagina web, sistema de cotizaciones, correo profesional y que tus clientes te encuentren en Google. Empezamos con lo basico y creces a tu ritmo.
            </p>

            <p className="text-base text-slate-400 italic mb-8 max-w-lg border-l-2 border-blue-500/30 pl-4">
              "Eres empresario, eres emprendedor, pero tu programador no te entiende. Siempre te dicen 'no se puede' o 'dejame averiguar' y pasan meses. Nosotros te lo resolvemos ya."
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                onClick={scrollToContact}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base px-8 py-6 rounded-lg"
              >
                Cotizar mi proyecto
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                onClick={() =>
                  window.open(
                    "https://wa.me/14355348065?text=" +
                      encodeURIComponent("Hola, quiero saber mas sobre los servicios de B3TA"),
                    "_blank"
                  )
                }
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold text-base px-8 py-6 rounded-lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
            </div>

            <div className="flex gap-8 text-sm text-slate-400">
              <span><strong className="text-white">20+</strong> proyectos</span>
              <span><strong className="text-white">12</strong> paises</span>
              <span><strong className="text-white">5+</strong> anos</span>
            </div>
          </div>

          {/* Right: Stats cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              { num: "20+", label: "Proyectos entregados", sub: "SaaS, e-commerce, ERP, apps" },
              { num: "500+", label: "Empresas usan nuestros sistemas", sub: "ChateaYA, GeoLead, Vixela" },
              { num: "4,500+", label: "Productos gestionados", sub: "Grupo Syst ecosystem" },
              { num: "50K+", label: "Videos generados con IA", sub: "Realis AI platform" },
            ].map((s, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                <div className="text-2xl font-bold text-white mb-1">{s.num}</div>
                <div className="text-sm font-medium text-slate-300 mb-1">{s.label}</div>
                <div className="text-xs text-slate-400">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
