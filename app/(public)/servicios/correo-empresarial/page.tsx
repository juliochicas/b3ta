import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";

const slug = "correo-empresarial";
const title = "Correo Empresarial — hola@tuempresa.com | B3TA Guatemala";
const description = "Correo empresarial profesional en Guatemala. Tu propio dominio, hosting incluido, configuracion completa. Desde $100 USD. hola@tuempresa.com";
const url = `https://b3ta.us/servicios/${slug}`;
const h1 = "Correo Empresarial con tu Dominio";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url },
};

const painPoints = [
  "Mandas cotizaciones desde un @gmail.com y no se ve profesional",
  "Tu cliente no sabe si tu correo es real o spam",
  "No tienes dominio propio para tu negocio",
  "Quieres separar tu correo personal del de trabajo",
];

const solutions = [
  "Tu correo con tu dominio: hola@tuempresa.com, ventas@tuempresa.com",
  "Funciona con Gmail, Outlook o cualquier app de correo",
  "Incluimos el dominio y hosting — todo configurado",
  "Tus correos llegan al inbox, no a spam",
];

const features = ["Correo con tu dominio", "Dominio .com o .com.gt", "Hosting incluido", "SSL (candadito verde)", "Funciona con Gmail/Outlook", "Anti-spam configurado", "Multiples cuentas de correo", "Configuracion completa", "Soporte tecnico"];

const faq = [
  { q: "Cuanto cuesta?", a: "El correo empresarial viene incluido con la pagina web ($500). Si solo quieres el correo sin pagina, desde $100 USD por ano." },
  { q: "Puedo tener varios correos?", a: "Si. Puedes tener hola@, ventas@, soporte@, lo que necesites. El costo depende del plan de hosting." },
  { q: "Funciona con mi celular?", a: "Si. Lo configuras en la app de Gmail o Outlook de tu celular y listo. Recibes y mandas correo desde ahi." },
  { q: "Y si ya tengo dominio?", a: "Perfecto, usamos tu dominio existente. Solo lo conectamos y configuramos los correos." },
];

const relatedServices = [
  { label: "Paginas Web Guatemala", href: "/servicios/paginas-web-guatemala" },
  { label: "Paginas Web Economicas", href: "/servicios/paginas-web-economicas" },
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
        subtitle="Deja de mandar cotizaciones desde Gmail o Hotmail. Ten tu propio correo profesional: hola@tuempresa.com. Tus clientes te van a tomar mas en serio."
        metaDesc={description}
        cta="Quiero mi correo profesional"
        painPoints={painPoints}
        solutions={solutions}
        features={features}
        faq={faq}
        relatedServices={relatedServices}
      />
    </>
  );
}
