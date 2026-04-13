import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";

const slug = "automatizacion-whatsapp";
const title = "Automatizacion WhatsApp — Bot y Notificaciones para tu Negocio | B3TA";
const description = "Bot de WhatsApp y notificaciones automaticas para empresas en Guatemala. Atencion 24/7 con IA, avisos de pedidos, recordatorios y mas.";
const url = `https://b3ta.us/servicios/${slug}`;
const h1 = "Automatizacion de WhatsApp para tu Negocio";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url },
};

const painPoints = [
  "Pasas todo el dia contestando WhatsApp a mano",
  "Tus clientes preguntan lo mismo una y otra vez",
  "Te olvidas de avisarle al cliente que su pedido esta listo",
  "Fuera de horario nadie contesta y pierdes ventas",
];

const solutions = [
  "Bot de WhatsApp que responde preguntas frecuentes automaticamente con IA",
  "Notificaciones automaticas: pedido confirmado, en camino, entregado",
  "Recordatorios de citas, pagos pendientes o renovaciones",
  "El bot atiende 24/7 — tu duermes, el responde",
];

const features = ["Bot WhatsApp con IA", "Atencion 24/7 automatica", "Notificaciones de pedidos", "Recordatorios de citas", "Avisos de pagos pendientes", "Respuestas personalizadas", "Escala a humano cuando se necesita", "Reportes de conversaciones", "Integracion con tu sistema"];

const faq = [
  { q: "El bot suena como robot?", a: "No. Usamos inteligencia artificial (Claude/GPT) que responde de forma natural, con la informacion de tu negocio. Tus clientes creen que es una persona." },
  { q: "Puedo ver las conversaciones?", a: "Si. Todas las conversaciones se registran y puedes verlas. Si el bot no sabe responder algo, te avisa para que tu intervengas." },
  { q: "Funciona con WhatsApp Business?", a: "Si. Usamos la API oficial de WhatsApp Business. Todo legal y seguro." },
  { q: "Cuanto cuesta?", a: "La configuracion del bot desde $500 USD. La API de WhatsApp tiene un costo mensual aparte (depende del volumen de mensajes)." },
];

const relatedServices = [
  { label: "Sistemas a Medida", href: "/servicios/sistemas-a-medida" },
  { label: "Integracion SAP + Shopify", href: "/servicios/integracion-sap-shopify" },
  { label: "Paginas Web Guatemala", href: "/servicios/paginas-web-guatemala" },
];

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": h1,
          "description": description,
          "provider": { "@type": "Organization", "name": "B3TA", "url": "https://b3ta.us" },
          "areaServed": [{ "@type": "Country", "name": "Guatemala" }, { "@type": "Country", "name": "Mexico" }, { "@type": "Country", "name": "Colombia" }],
        }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faq.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://b3ta.us" },
            { "@type": "ListItem", "position": 2, "name": "Servicios", "item": "https://b3ta.us/#servicios" },
            { "@type": "ListItem", "position": 3, "name": h1, "item": url },
          ]
        }) }}
      />
      <ServicePage
        slug={slug}
        title={title}
        h1={h1}
        subtitle="Deja de mandar mensajes uno por uno. Un bot que atiende clientes 24/7 y notificaciones automaticas cuando algo pasa en tu negocio."
        metaDesc={description}
        cta="Quiero automatizar mi WhatsApp"
        painPoints={painPoints}
        solutions={solutions}
        features={features}
        faq={faq}
        relatedServices={relatedServices}
      />
    </>
  );
}
