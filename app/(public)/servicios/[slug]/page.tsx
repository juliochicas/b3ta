import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { countries } from "@/data/countries";
import { CountryPage } from "@/components/CountryPage";

// Texts needed for metadata generation (mirrored from CountryPage component)
const metaTexts: Record<string, { h1pre: string; metaDesc: (c: string) => string }> = {
  es: {
    h1pre: "Paginas Web, Sistemas y Automatizacion en",
    metaDesc: (c: string) => `Desarrollo web, sistemas a medida, integracion SAP/Shopify y automatizacion para empresas en ${c}. Desde $500 USD. Trabajamos remoto.`,
  },
  en: {
    h1pre: "Web Development, Custom Systems & Automation in",
    metaDesc: (c: string) => `Web development, custom software, SAP/Shopify integration and automation for businesses in ${c}. Starting at $500 USD. Remote team based in Guatemala.`,
  },
  pt: {
    h1pre: "Desenvolvimento Web, Sistemas e Automacao em",
    metaDesc: (c: string) => `Desenvolvimento web, sistemas sob medida, integracao SAP/Shopify e automacao para empresas em ${c}. A partir de $500 USD. Equipe remota.`,
  },
};

// Texts for FAQ JSON-LD (mirrored from CountryPage component)
const faqTexts: Record<string, (c: string, cur: string) => { q: string; a: string }[]> = {
  es: (c: string, cur: string) => [
    { q: `Trabajan con empresas en ${c}?`, a: `Si. Trabajamos 100% remoto y hemos entregado proyectos en 12 paises. Nos comunicamos por videollamada, WhatsApp y correo.` },
    { q: "Cuanto cuesta?", a: `Una pagina web desde $500 USD. Un sistema a medida desde $650 USD. Cotizamos en dolares pero puedes pagar en ${cur} si prefieres.` },
    { q: "En cuanto tiempo entregan?", a: "Una pagina web en 1-2 semanas. Un sistema a medida en 3-6 semanas. Te mostramos avances cada semana." },
    { q: "Que pasa si algo falla despues?", a: "Incluimos soporte post-lanzamiento. Si algo falla, lo arreglamos. Tambien ofrecemos planes de mantenimiento mensual." },
  ],
  en: (c: string, cur: string) => [
    { q: `Do you work with companies in ${c}?`, a: `Yes. We work 100% remotely and have delivered projects in 12+ countries. We communicate via video calls, WhatsApp and email.` },
    { q: "How much does it cost?", a: `A website starts at $500 USD. A custom system starts at $650 USD. We quote in USD.` },
    { q: "How long does it take?", a: "A website takes 1-2 weeks. A custom system takes 3-6 weeks. We show you progress every week." },
    { q: "What if something breaks after launch?", a: "We include post-launch support. If something breaks, we fix it. We also offer monthly maintenance plans." },
  ],
  pt: (c: string, cur: string) => [
    { q: `Voces trabalham com empresas em ${c}?`, a: `Sim. Trabalhamos 100% remotamente e ja entregamos projetos em 12+ paises.` },
    { q: "Quanto custa?", a: `Um site a partir de $500 USD. Sistema sob medida a partir de $650 USD.` },
    { q: "Quanto tempo leva?", a: "Um site em 1-2 semanas. Sistema sob medida em 3-6 semanas." },
    { q: "E se algo der errado depois?", a: "Incluimos suporte pos-lancamento. Tambem oferecemos planos de manutencao mensal." },
  ],
};

export function generateStaticParams() {
  return countries.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const country = countries.find((c) => c.slug === slug);
  if (!country) return {};

  const t = metaTexts[country.lang];
  const title = `${t.h1pre} ${country.country} | B3TA`;
  const description = t.metaDesc(country.country);
  const url = `https://b3ta.us/servicios/${slug}`;
  const hrefLang = country.lang === "pt" ? "pt" : country.lang === "en" ? "en" : "es";

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        [hrefLang]: url,
        "x-default": "https://b3ta.us/",
      },
    },
    openGraph: { title, description, url },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = countries.find((c) => c.slug === slug);
  if (!country) notFound();

  const t = metaTexts[country.lang];
  const title = `${t.h1pre} ${country.country} | B3TA`;
  const description = t.metaDesc(country.country);
  const url = `https://b3ta.us/servicios/${slug}`;
  const faq = faqTexts[country.lang](country.country, country.currency);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": title,
          "description": description,
          "provider": { "@type": "Organization", "name": "B3TA", "url": "https://b3ta.us" },
          "areaServed": { "@type": "Country", "name": country.country },
        }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faq.map((f) => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a },
          })),
        }) }}
      />
      <CountryPage
        country={country.country}
        countryCode={country.code}
        slug={country.slug}
        currency={country.currency}
        localContent={country.localContent}
        city={country.city}
        lang={country.lang}
        region={country.region}
      />
    </>
  );
}
