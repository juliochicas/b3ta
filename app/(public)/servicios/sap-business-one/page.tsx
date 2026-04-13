import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";

const slug = "sap-business-one";
const title = "SAP Business One Guatemala — Implementacion y Consultoria | B3TA";
const description = "Implementacion SAP Business One en Guatemala y LATAM. Consultoria, integracion con Shopify, automatizacion con n8n. Partner certificado.";
const url = `https://b3ta.us/servicios/${slug}`;
const h1 = "SAP Business One en Guatemala";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url },
};

const painPoints = [
  "Quieres SAP pero te dijeron que es muy caro o muy complicado",
  "Ya tienes SAP pero esta desconectado de tu tienda online",
  "Tu equipo no le saca provecho a SAP porque no sabe usarlo bien",
  "Necesitas reportes de SAP pero son dificiles de sacar",
];

const solutions = [
  "Implementamos SAP B1 HANA ajustado a tu negocio, no un SAP generico",
  "Lo conectamos con Shopify, WhatsApp, Cargo Expreso y lo que necesites",
  "Capacitamos a tu equipo hasta que lo manejen con confianza",
  "Dashboards personalizados para que veas tus numeros sin complicaciones",
];

const features = ["Implementacion SAP B1 HANA", "Configuracion a medida", "Integracion con Shopify", "Integracion con WhatsApp", "Facturacion electronica", "Inventario en tiempo real", "Reportes y dashboards", "Capacitacion a tu equipo", "Soporte continuo"];

const faq = [
  { q: "SAP es solo para empresas grandes?", a: "No. SAP Business One esta disenado para PyMEs. Es la version de SAP para empresas que facturan desde $500K al ano." },
  { q: "Cuanto cuesta implementar SAP?", a: "Depende del tamano de tu operacion. La consultoria e integracion con B3TA desde $2,000 USD. La licencia de SAP se paga aparte." },
  { q: "Cuanto tiempo tarda?", a: "Una implementacion basica toma 4-8 semanas. Con integraciones avanzadas puede tomar 2-3 meses." },
  { q: "Ya tengo SAP, pueden conectarlo con mi tienda?", a: "Si. Esa es nuestra especialidad. Conectamos SAP con Shopify, WordPress, WhatsApp y cualquier sistema via API." },
];

const relatedServices = [
  { label: "Integracion SAP + Shopify", href: "/servicios/integracion-sap-shopify" },
  { label: "Integracion Odoo", href: "/servicios/integracion-odoo" },
  { label: "Automatizacion WhatsApp", href: "/servicios/automatizacion-whatsapp" },
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
        subtitle="Implementamos, configuramos e integramos SAP Business One para tu empresa. Conectamos SAP con tu tienda online, WhatsApp y los sistemas que ya usas."
        metaDesc={description}
        cta="Cotizar SAP Business One"
        painPoints={painPoints}
        solutions={solutions}
        features={features}
        faq={faq}
        relatedServices={relatedServices}
      />
    </>
  );
}
