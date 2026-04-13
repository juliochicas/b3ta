import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";

const slug = "integracion-odoo";
const title = "Integracion Odoo — Conecta tu ERP con Todo | B3TA Guatemala";
const description = "Integracion Odoo en Guatemala y LATAM. Conecta tu ERP con Shopify, WhatsApp, facturacion electronica y mas. Consultoria e implementacion.";
const url = `https://b3ta.us/servicios/${slug}`;
const h1 = "Integracion Odoo con tu Operacion";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url },
};

const painPoints = [
  "Tienes Odoo pero esta desconectado de tu tienda online",
  "Digitas la misma informacion en Odoo y en otro sistema",
  "Tu equipo no sabe usar Odoo al 100%",
  "Quieres migrar de otro ERP a Odoo pero no sabes como",
];

const solutions = [
  "Conectamos Odoo con Shopify, WordPress o tu tienda para que los pedidos fluyan solos",
  "Automatizamos la facturacion, inventario y reportes dentro de Odoo",
  "Capacitamos a tu equipo para que le saquen jugo a Odoo",
  "Si necesitas migrar, te ayudamos con la transicion sin perder datos",
];

const features = ["Integracion Odoo + Shopify", "Integracion Odoo + WordPress", "Facturacion electronica", "Inventario sincronizado", "Reportes personalizados", "Migracion de datos", "Capacitacion a tu equipo", "Soporte post-implementacion", "Modulos personalizados"];

const faq = [
  { q: "Que version de Odoo manejan?", a: "Trabajamos con Odoo Community y Enterprise, versiones 15 a 17. Si tienes una version anterior, te ayudamos a actualizar." },
  { q: "Pueden hacer modulos custom?", a: "Si. Si necesitas algo que Odoo no trae de fabrica, lo desarrollamos a medida." },
  { q: "Cuanto cuesta?", a: "Depende de que quieres conectar. Una integracion basica desde $800 USD. Implementacion completa desde $2,000 USD." },
  { q: "Tambien trabajan con SAP?", a: "Si. Tambien hacemos integraciones con SAP Business One. Si no sabes cual ERP te conviene, te asesoramos gratis." },
];

const relatedServices = [
  { label: "SAP Business One", href: "/servicios/sap-business-one" },
  { label: "Integracion SAP + Shopify", href: "/servicios/integracion-sap-shopify" },
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
        subtitle="Conectamos Odoo con tu tienda online, WhatsApp, facturacion y lo que necesites. Tu ERP trabajando con todos tus sistemas en vez de estar aislado."
        metaDesc={description}
        cta="Cotizar integracion Odoo"
        painPoints={painPoints}
        solutions={solutions}
        features={features}
        faq={faq}
        relatedServices={relatedServices}
      />
    </>
  );
}
