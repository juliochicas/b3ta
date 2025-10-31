import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import videoThumbnail from "@/assets/video-thumbnail-ai.jpg";
import { useState } from "react";

export const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    // Aquí integrarías tu video de YouTube/Vimeo
    window.open('https://youtube.com', '_blank');
  };

  return (
    <section className="py-28 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Conoce Cómo Trabajamos
            </h2>
            <p className="text-xl text-muted-foreground">
              3 minutos que te mostrarán por qué somos diferentes
            </p>
          </div>

          <Card 
            className="relative overflow-hidden cursor-pointer group border-2 border-border hover:border-primary transition-all shadow-2xl"
            onClick={handlePlay}
          >
            <div className="relative h-[500px]">
              <img 
                src={videoThumbnail} 
                alt="Video presentación consultoría B3TA - SAP, E-commerce y Automatización"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                  <Play className="h-12 w-12 text-white ml-1" fill="white" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="max-w-2xl">
                  <h3 className="text-2xl font-bold mb-2">
                    De la Consulta al Go-Live: El Proceso B3TA
                  </h3>
                  <p className="text-white/80 mb-4">
                    Descubre cómo transformamos empresas en LATAM con tecnología enterprise
                  </p>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="font-bold">3:24</span> minutos
                    </div>
                    <div>•</div>
                    <div>
                      <span className="font-bold">12K</span> visualizaciones
                    </div>
                    <div>•</div>
                    <div>
                      Actualizado 2025
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { time: "0:00-0:45", title: "Quiénes Somos", desc: "Nuestra historia y expertise" },
              { time: "0:45-2:00", title: "Casos de Éxito", desc: "Clientes reales, resultados reales" },
              { time: "2:00-3:24", title: "Tu Próximo Paso", desc: "Cómo empezar hoy mismo" }
            ].map((chapter, idx) => (
              <Card key={idx} className="p-8 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="text-sm font-bold text-primary mb-2">{chapter.time}</div>
                <h4 className="font-semibold text-foreground mb-1">{chapter.title}</h4>
                <p className="text-sm text-muted-foreground">{chapter.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};