import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";

const slug = "paginas-web-guatemala";
const title = "Paginas Web en Guatemala — Diseno Profesional desde $500 | B3TA";
const description = "Diseno de paginas web profesionales en Guatemala desde $500. WordPress, Shopify, responsive, SEO incluido. Tu negocio visible en Google en dias.";
const url = `https://b3ta.us/servicios/${slug}`;
const h1 = "Paginas Web Profesionales en Guatemala";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url },
};

const painPoints = [
  "No tienes pagina web y tus clientes no te encuentran",
  "Tienes una pagina vieja que no se ve bien en celular",
  "Pagaste por una web pero nunca apareces en Google",
  "Tu competencia tiene pagina y tu no",
];

const solutions = [
  "Disenamos tu pagina profesional en WordPress o codigo limpio",
  "La optimizamos para que Google la encuentre desde el primer dia",
  "Se ve perfecta en celular, tablet y computadora",
  "Incluimos formulario de contacto y boton de WhatsApp",
];

const features = ["Diseno moderno y profesional", "WordPress o codigo a medida", "Responsive (celular y PC)", "SEO basico incluido", "Hosting y SSL incluido", "Correo con tu dominio", "Formulario de contacto", "Boton de WhatsApp", "Velocidad optimizada"];

const faq = [
  { q: "Cuanto cuesta una pagina web?", a: "Desde $500 USD. El precio depende de cuantas secciones necesitas y si quieres tienda online o solo informativa." },
  { q: "Cuanto tiempo tarda?", a: "Una pagina informativa la entregamos en 1-2 semanas. Una tienda online puede tomar 2-3 semanas." },
  { q: "Necesito saber de tecnologia?", a: "No. Nosotros nos encargamos de todo. Solo necesitamos tu logo, textos y fotos. Si no los tienes, te ayudamos." },
  { q: "Incluye hosting y correo?", a: "Si. Tu pagina viene con hosting, SSL (candadito verde) y correo profesional con tu dominio." },
];

const relatedServices = [
  { label: "SEO Guatemala", href: "/servicios/seo-guatemala" },
  { label: "Tienda Shopify", href: "/servicios/tienda-shopify" },
  { label: "Correo Empresarial", href: "/servicios/correo-empresarial" },
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
        subtitle="Tu propio sitio web que carga rapido, se ve bien en celular y hace que tus clientes te encuentren en Google. No necesitas saber nada de tecnologia."
        metaDesc={description}
        cta="Cotizar mi pagina web"
        painPoints={painPoints}
        solutions={solutions}
        features={features}
        faq={faq}
        relatedServices={relatedServices}
      />
    </>
  );
}
