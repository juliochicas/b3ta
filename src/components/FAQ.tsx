import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "¿Cuánto tiempo toma implementar una solución SAP S/4HANA?",
    answer: "Depende del tamaño de tu empresa y complejidad. Para PyMEs: 8-12 semanas. Para enterprise (500+ empleados): 16-24 semanas. Incluye migración de datos, personalización, integración y capacitación. Usamos metodología SAP Activate para máxima eficiencia."
  },
  {
    question: "¿Qué incluye el precio? ¿Hay costos ocultos?",
    answer: "100% transparencia. El precio incluye: consultoría, desarrollo, testing, capacitación y 3 meses de soporte post go-live. Los únicos costos adicionales son licencias de terceros (SAP, Shopify, etc.) que te informamos desde el día 1. Sin sorpresas."
  },
  {
    question: "¿Trabajan con empresas pequeñas o solo corporativos?",
    answer: "Trabajamos con empresas desde $500K hasta $500M de facturación anual. Nuestros proyectos van desde $15K (automatización básica) hasta $500K+ (SAP enterprise). Si buscas calidad profesional, somos tu partner ideal."
  },
  {
    question: "¿Qué pasa si necesito cambios después del go-live?",
    answer: "Incluimos 3 meses de soporte post go-live sin costo. Después, ofrecemos planes de mantenimiento desde $2K/mes que incluyen: soporte 24/7, actualizaciones, nuevas features y consultoría on-demand. También trabajamos por horas para cambios puntuales."
  },
  {
    question: "¿Cómo garantizan la seguridad de nuestros datos?",
    answer: "Cumplimos con ISO 27001, SOC 2 Type II y GDPR. Todos nuestros proyectos incluyen: encriptación end-to-end, backups diarios automáticos, acceso por roles (RBAC), auditoría de logs y penetration testing. Firmamos NDA antes de comenzar cualquier proyecto."
  },
  {
    question: "¿Puedo ver ejemplos de proyectos similares al mío?",
    answer: "Sí. En la consultoría gratuita te mostramos 2-3 casos de éxito de tu industria específica (bajo NDA). Incluimos métricas reales: reducción de costos, aumento de ventas, tiempo de implementación. También conectamos con referencias directas si lo requieres."
  },
  {
    question: "¿Qué tecnologías usan? ¿Son modernas?",
    answer: "Stack enterprise actual: SAP S/4HANA Cloud, Shopify Plus, n8n/Make para automatización, OpenAI GPT-4 + RAG para IA, React + TypeScript para frontends. Todo cloud-native, escalable y con las mejores prácticas de 2025."
  },
  {
    question: "¿Ofrecen financiamiento o pagos flexibles?",
    answer: "Sí. Aceptamos pagos en hitos (30% inicio, 40% desarrollo, 30% go-live) o planes de pago mensuales para proyectos +$50K. También trabajamos con modelos retainer mensual ($5K-$20K/mes) para empresas que necesitan soporte continuo."
  }
];

export const FAQ = () => {
  const scrollToAI = () => {
    document.getElementById('ai-consultant')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-muted-foreground">
              Todo lo que necesitas saber antes de contratar
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem 
                key={idx} 
                value={`item-${idx}`}
                className="border border-border rounded-xl px-6 bg-card hover:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-16 flex justify-center">
            <div className="flex flex-col items-center p-8 bg-muted/50 rounded-2xl max-w-lg">
              <MessageCircle className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-3 text-center">
                ¿Tienes otra pregunta?
              </h3>
              <p className="text-muted-foreground mb-6 text-center">
                Nuestro consultor IA responde al instante 24/7
              </p>
              <Button 
                onClick={scrollToAI}
                variant="outline" 
                size="lg"
                className="hover:bg-primary hover:text-primary-foreground"
              >
                Preguntar al Consultor IA
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};