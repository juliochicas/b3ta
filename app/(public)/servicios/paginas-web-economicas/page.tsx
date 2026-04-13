import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";

const slug = "paginas-web-economicas";
const title = "Paginas Web Economicas — Desde $500 USD | B3TA Guatemala";
const description = "Paginas web economicas desde $500 USD en Guatemala. Profesionales, rapidas, con SEO y correo incluido. Para emprendedores que quieren empezar sin gastar de mas.";
const url = `https://b3ta.us/servicios/${slug}`;
const h1 = "Paginas Web Economicas para tu Negocio";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url },
};

const painPoints = [
  "Te han cotizado paginas web carisimas y no te alcanza",
  "Quieres empezar tu negocio online pero no tienes mucho presupuesto",
  "Has visto paginas baratas pero se ven feas o no funcionan",
  "No sabes si vale la pena invertir en una pagina web",
];

const solutions = [
  "Paginas desde $500 USD con diseno profesional real, no plantillas feas",
  "Incluimos hosting, SSL y correo — no hay costos escondidos",
  "Trabajamos por fases: primero lo basico, luego agregas lo que necesites",
  "La pagina se paga sola cuando te llegan los primeros clientes por Google",
];

const features = ["Desde $500 USD", "Diseno profesional (no plantilla)", "Hosting primer ano incluido", "Correo con tu dominio", "SEO basico incluido", "WhatsApp integrado", "Entrega en 1-2 semanas", "Se ve bien en celular", "Sin costos ocultos"];

const faq = [
  { q: "Por que es tan economica?", a: "Usamos herramientas modernas que nos permiten trabajar rapido sin sacrificar calidad. No cobramos por hora, cobramos por proyecto." },
  { q: "Es una plantilla generica?", a: "No. Cada pagina se disena para tu negocio con tus colores, logo y contenido. No es una plantilla de $50." },
  { q: "Despues me cobran mas?", a: "El precio incluye todo: diseno, desarrollo, hosting del primer ano, SSL y correo. Despues solo pagas el hosting anual que es minimo." },
  { q: "Puedo agregar cosas despues?", a: "Si. Empezamos con lo basico y cuando tu negocio crezca, le agregamos tienda online, blog, sistema de citas, o lo que necesites." },
];

const relatedServices = [
  { label: "Paginas Web Guatemala", href: "/servicios/paginas-web-guatemala" },
  { label: "Correo Empresarial", href: "/servicios/correo-empresarial" },
  { label: "SEO Guatemala", href: "/servicios/seo-guatemala" },
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
        subtitle="No necesitas gastar una fortuna para tener presencia en internet. Paginas web profesionales a precio accesible para emprendedores y PyMEs en Guatemala."
        metaDesc={description}
        cta="Ver precios"
        painPoints={painPoints}
        solutions={solutions}
        features={features}
        faq={faq}
        relatedServices={relatedServices}
      />
    </>
  );
}
