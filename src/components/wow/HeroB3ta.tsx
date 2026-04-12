import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

export const HeroB3ta = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-zinc-950 pt-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
        <p className="text-sm font-medium text-zinc-400 mb-6 tracking-wide">
          Consultoria tech en Guatemala y LATAM
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          Tu negocio merece mas
          <br />
          que un Excel y un WhatsApp.
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Pagina web, sistema de cotizaciones, correo profesional, que te encuentren en Google.
          Empezamos con lo basico y creces a tu ritmo.
        </p>

        <p className="text-base text-zinc-500 italic max-w-xl mx-auto mb-10 leading-relaxed">
          "Eres empresario, eres emprendedor, pero tu programador no te entiende. Siempre te dicen 'no se puede' o 'dejame averiguar' y pasan meses. Nosotros te lo resolvemos ya."
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            onClick={scrollToContact}
            size="lg"
            className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-base px-8 py-6 rounded-lg w-full sm:w-auto"
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
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 font-semibold text-base px-8 py-6 rounded-lg w-full sm:w-auto"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Escribir por WhatsApp
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-zinc-500">
          <span>50+ proyectos entregados</span>
          <span className="hidden sm:inline">·</span>
          <span>12 paises en LATAM</span>
          <span className="hidden sm:inline">·</span>
          <span>Desde 2020</span>
        </div>
      </div>
    </section>
  );
};
