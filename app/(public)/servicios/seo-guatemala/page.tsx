import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";

const slug = "seo-guatemala";
const title = "SEO en Guatemala — Posicionate en Google | B3TA";
const description = "Servicio de SEO en Guatemala. Posiciona tu negocio en Google, atrae clientes que buscan tus servicios. SEO tecnico, contenido y SEO programatico.";
const url = `https://b3ta.us/servicios/${slug}`;
const h1 = "SEO en Guatemala: Que te encuentren en Google";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url },
};

const painPoints = [
  "Buscas tu negocio en Google y no apareces",
  "Tu competencia sale primero que tu",
  "Pagaste por una pagina pero no genera clientes",
  "No sabes que es SEO ni por donde empezar",
];

const solutions = [
  "Optimizamos tu pagina para que Google la entienda y la muestre primero",
  "Creamos contenido que responde lo que tus clientes buscan",
  "SEO programatico: generamos paginas para cada servicio o producto que ofreces",
  "Te mostramos resultados reales con reportes mensuales",
];

const features = ["Auditoria SEO completa", "Optimizacion de meta tags", "Velocidad de carga (Core Web Vitals)", "Schema markup (datos estructurados)", "SEO programatico a escala", "Contenido optimizado para busquedas", "Google Search Console configurado", "Reportes mensuales de posiciones", "Link building interno"];

const faq = [
  { q: "Que es SEO?", a: "Es hacer que tu pagina web aparezca en Google cuando alguien busca lo que tu vendes. Por ejemplo, si vendes pasteles en Guatemala, que cuando busquen 'pasteles Guatemala' tu salgas." },
  { q: "En cuanto tiempo se ven resultados?", a: "Los primeros cambios se notan en 2-4 semanas. Resultados fuertes entre 2-3 meses. El SEO es una inversion que crece con el tiempo." },
  { q: "Cuanto cuesta?", a: "El SEO basico viene incluido con la pagina web ($500). Si quieres una estrategia completa con contenido y SEO programatico, desde $300/mes." },
  { q: "Que es SEO programatico?", a: "Es generar muchas paginas optimizadas automaticamente. Por ejemplo, hicimos 4,000+ paginas para una tienda de celulares y triplicaron su trafico." },
];

const relatedServices = [
  { label: "Paginas Web Guatemala", href: "/servicios/paginas-web-guatemala" },
  { label: "Tienda Shopify", href: "/servicios/tienda-shopify" },
  { label: "Sistemas a Medida", href: "/servicios/sistemas-a-medida" },
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
        subtitle="Tus clientes buscan lo que tu vendes pero encuentran a tu competencia. Hacemos que tu negocio aparezca en los primeros resultados de Google."
        metaDesc={description}
        cta="Quiero aparecer en Google"
        painPoints={painPoints}
        solutions={solutions}
        features={features}
        faq={faq}
        relatedServices={relatedServices}
      />
    </>
  );
}
