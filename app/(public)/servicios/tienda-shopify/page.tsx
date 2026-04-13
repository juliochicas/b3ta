import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";

const slug = "tienda-shopify";
const title = "Tienda Shopify en Guatemala — Vende por Internet | B3TA";
const description = "Creacion de tiendas Shopify en Guatemala. Vende por internet con pagos, inventario y envios. Integracion con SAP, Cargo Expreso y validador de NIT.";
const url = `https://b3ta.us/servicios/${slug}`;
const h1 = "Tu Tienda Online con Shopify";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url },
};

const painPoints = [
  "Quieres vender por internet pero no sabes como empezar",
  "Tienes productos pero solo vendes en redes sociales",
  "Tu tienda actual es dificil de administrar",
  "No puedes recibir pagos con tarjeta de forma facil",
];

const solutions = [
  "Tu tienda Shopify lista para vender en 1-2 semanas",
  "Catalogo de productos organizado con fotos profesionales",
  "Pagos con tarjeta, transferencia y contra entrega (Cargo Expreso)",
  "Inventario sincronizado — se actualiza solo cuando vendes",
];

const features = ["Tienda Shopify configurada", "Catalogo de productos", "Pagos con tarjeta (Stripe/PayPal)", "Contra entrega (Cargo Expreso)", "Validador de NIT (Digifact)", "Inventario automatico", "Se ve bien en celular", "SEO para productos", "Integracion SAP opcional"];

const faq = [
  { q: "Cuanto cuesta una tienda Shopify?", a: "La configuracion inicial desde $650 USD. Shopify cobra una mensualidad aparte (desde $29/mes) que tu pagas directo a ellos." },
  { q: "Puedo vender con contra entrega?", a: "Si. Integramos Cargo Expreso para que tus clientes paguen al recibir el producto. Incluimos formulario de direccion por departamento." },
  { q: "Se puede conectar con SAP?", a: "Si. Hacemos que los pedidos de Shopify entren a SAP automaticamente. Inventario, facturacion y envios sincronizados." },
  { q: "Necesito saber de tecnologia?", a: "No. Shopify es muy facil de usar. Te ensenamos a agregar productos, ver pedidos y gestionar tu tienda." },
];

const relatedServices = [
  { label: "Integracion SAP + Shopify", href: "/servicios/integracion-sap-shopify" },
  { label: "SEO Guatemala", href: "/servicios/seo-guatemala" },
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
        subtitle="Vende tus productos por internet con la plataforma mas usada del mundo. Recibe pagos, gestiona inventario y envia pedidos desde un solo lugar."
        metaDesc={description}
        cta="Quiero mi tienda online"
        painPoints={painPoints}
        solutions={solutions}
        features={features}
        faq={faq}
        relatedServices={relatedServices}
      />
    </>
  );
}
