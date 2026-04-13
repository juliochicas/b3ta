import { MainHeader } from "@/components/MainHeader";
import { Footer } from "@/components/Footer";
import { ArrowRight, MessageCircle, Check, Globe, ShoppingBag, Zap, BarChart3 } from "lucide-react";
import { Helmet } from "react-helmet";

interface CountryPageProps {
  country: string;
  countryCode: string;
  slug: string;
  currency: string;
  city: string;
  lang: "es" | "en" | "pt";
  region: "latam" | "usa" | "europe";
}

const texts = {
  es: {
    badge: "Consultoria tech para empresas en",
    h1pre: "Paginas Web, Sistemas y Automatizacion en",
    subtitle: (c: string) => `Ayudamos a empresas en ${c} a dejar el Excel, tener su propia pagina web, sistema de cotizaciones y que sus clientes los encuentren en Google. Trabajamos remoto con resultados reales.`,
    metaDesc: (c: string) => `Desarrollo web, sistemas a medida, integracion SAP/Shopify y automatizacion para empresas en ${c}. Desde $500 USD. Trabajamos remoto.`,
    painTitle: "Lo que nos dicen empresas en",
    pains: (c: string) => [
      `Mi negocio en ${c} no tiene pagina web profesional`,
      "Cotizo en Excel y mando todo por WhatsApp",
      "Mi programador me dice 'no se puede' o tarda meses",
      "Quiero un sistema pero no tengo mucho presupuesto",
      "No me encuentran en Google",
      "Necesito correo profesional, no Gmail",
    ],
    servicesTitle: "Que hacemos para empresas en",
    services: [
      { icon: Globe, title: "Pagina Web + SEO", desc: "Tu sitio profesional que aparece en Google. Con correo de tu dominio." },
      { icon: ShoppingBag, title: "Tienda Online", desc: "Vende por internet con Shopify. Pagos, inventario y envios." },
      { icon: BarChart3, title: "Sistema a Medida", desc: "Cotizador, portal de clientes, dashboard. Adios Excel." },
      { icon: Zap, title: "Automatizacion", desc: "WhatsApp bot, notificaciones automaticas, integraciones SAP/Odoo." },
    ],
    statsTitle: "B3TA en numeros",
    stats: ["20+ proyectos entregados", "12 paises en LATAM y USA", "Desde 2020", "Trabajamos 100% remoto"],
    ctaTitle: "Tienes un proyecto en",
    ctaSub: "Escribenos y te respondemos en menos de 24 horas. Trabajamos remoto con empresas de todo el mundo.",
    faq: (c: string, cur: string) => [
      { q: `Trabajan con empresas en ${c}?`, a: `Si. Trabajamos 100% remoto y hemos entregado proyectos en 12 paises. Nos comunicamos por videollamada, WhatsApp y correo.` },
      { q: "Cuanto cuesta?", a: `Una pagina web desde $500 USD. Un sistema a medida desde $650 USD. Cotizamos en dolares pero puedes pagar en ${cur} si prefieres.` },
      { q: "En cuanto tiempo entregan?", a: "Una pagina web en 1-2 semanas. Un sistema a medida en 3-6 semanas. Te mostramos avances cada semana." },
      { q: "Que pasa si algo falla despues?", a: "Incluimos soporte post-lanzamiento. Si algo falla, lo arreglamos. Tambien ofrecemos planes de mantenimiento mensual." },
    ],
  },
  en: {
    badge: "Tech consulting for businesses in",
    h1pre: "Web Development, Custom Systems & Automation in",
    subtitle: (c: string) => `We help businesses in ${c} go from Excel spreadsheets to professional web systems. Custom software, Shopify stores, SAP integration and WhatsApp automation. We work remotely with real results.`,
    metaDesc: (c: string) => `Web development, custom software, SAP/Shopify integration and automation for businesses in ${c}. Starting at $500 USD. Remote team based in Guatemala.`,
    painTitle: "What businesses in",
    pains: (c: string) => [
      `My business in ${c} doesn't have a professional website`,
      "I still use Excel spreadsheets for everything",
      "My developer says 'it can't be done' or takes months",
      "I want a custom system but I have a limited budget",
      "My clients can't find me on Google",
      "I need a professional email, not Gmail",
    ],
    servicesTitle: "What we do for businesses in",
    services: [
      { icon: Globe, title: "Website + SEO", desc: "Professional site that ranks on Google. With your own email domain." },
      { icon: ShoppingBag, title: "Online Store", desc: "Sell online with Shopify. Payments, inventory and shipping." },
      { icon: BarChart3, title: "Custom Software", desc: "Quoting tool, client portal, dashboard. Goodbye Excel." },
      { icon: Zap, title: "Automation", desc: "WhatsApp bot, auto-notifications, SAP/Odoo integrations." },
    ],
    statsTitle: "B3TA by the numbers",
    stats: ["20+ projects delivered", "12 countries in LATAM & USA", "Since 2020", "100% remote team"],
    ctaTitle: "Have a project in",
    ctaSub: "Write to us and we'll respond within 24 hours. We work remotely with companies worldwide.",
    faq: (c: string, cur: string) => [
      { q: `Do you work with companies in ${c}?`, a: `Yes. We work 100% remotely and have delivered projects in 12+ countries. We communicate via video calls, WhatsApp and email.` },
      { q: "How much does it cost?", a: `A website starts at $500 USD. A custom system starts at $650 USD. We quote in USD.` },
      { q: "How long does it take?", a: "A website takes 1-2 weeks. A custom system takes 3-6 weeks. We show you progress every week." },
      { q: "What if something breaks after launch?", a: "We include post-launch support. If something breaks, we fix it. We also offer monthly maintenance plans." },
    ],
  },
  pt: {
    badge: "Consultoria tech para empresas em",
    h1pre: "Desenvolvimento Web, Sistemas e Automacao em",
    subtitle: (c: string) => `Ajudamos empresas em ${c} a sair do Excel e ter seu proprio site, sistema de cotacoes e automacao. Trabalhamos remotamente com resultados reais.`,
    metaDesc: (c: string) => `Desenvolvimento web, sistemas sob medida, integracao SAP/Shopify e automacao para empresas em ${c}. A partir de $500 USD. Equipe remota.`,
    painTitle: "O que empresas em",
    pains: (c: string) => [
      `Minha empresa em ${c} nao tem site profissional`,
      "Faco orcamentos no Excel e mando tudo por WhatsApp",
      "Meu programador diz 'nao da' ou demora meses",
      "Quero um sistema mas nao tenho muito orcamento",
      "Ninguem me encontra no Google",
      "Preciso de email profissional, nao Gmail",
    ],
    servicesTitle: "O que fazemos para empresas em",
    services: [
      { icon: Globe, title: "Site + SEO", desc: "Seu site profissional que aparece no Google. Com email do seu dominio." },
      { icon: ShoppingBag, title: "Loja Online", desc: "Venda pela internet com Shopify. Pagamentos, estoque e envios." },
      { icon: BarChart3, title: "Sistema Sob Medida", desc: "Orcamentos, portal de clientes, dashboard. Adeus Excel." },
      { icon: Zap, title: "Automacao", desc: "Bot WhatsApp, notificacoes automaticas, integracoes SAP/Odoo." },
    ],
    statsTitle: "B3TA em numeros",
    stats: ["20+ projetos entregues", "12 paises na LATAM e USA", "Desde 2020", "100% remoto"],
    ctaTitle: "Tem um projeto em",
    ctaSub: "Escreva para nos e respondemos em menos de 24 horas. Trabalhamos remotamente com empresas do mundo todo.",
    faq: (c: string, cur: string) => [
      { q: `Voces trabalham com empresas em ${c}?`, a: `Sim. Trabalhamos 100% remotamente e ja entregamos projetos em 12+ paises.` },
      { q: "Quanto custa?", a: `Um site a partir de $500 USD. Sistema sob medida a partir de $650 USD.` },
      { q: "Quanto tempo leva?", a: "Um site em 1-2 semanas. Sistema sob medida em 3-6 semanas." },
      { q: "E se algo der errado depois?", a: "Incluimos suporte pos-lancamento. Tambem oferecemos planos de manutencao mensal." },
    ],
  },
};

export const CountryPage = (props: CountryPageProps) => {
  const t = texts[props.lang];
  const url = `https://b3ta.us/servicios/${props.slug}`;

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Helmet>
        <title>{`${t.h1pre} ${props.country} | B3TA`}</title>
        <meta name="description" content={t.metaDesc(props.country)} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`${t.h1pre} ${props.country} | B3TA`} />
        <meta property="og:description" content={t.metaDesc(props.country)} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "Service",
          "name": `${t.h1pre} ${props.country}`,
          "description": t.metaDesc(props.country),
          "provider": { "@type": "Organization", "name": "B3TA", "url": "https://b3ta.us" },
          "areaServed": { "@type": "Country", "name": props.country },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": t.faq(props.country, props.currency).map(f => ({
            "@type": "Question", "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        })}</script>
      </Helmet>

      <MainHeader />

      <main>
        <section className="pt-32 pb-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <span className="inline-block text-sm font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full mb-6">
              {t.badge} {props.country}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
              {t.h1pre} {props.country}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">{t.subtitle(props.country)}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#contact-country" className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-8 py-4 rounded-full transition-colors">
                {props.lang === "en" ? "Get a Quote" : props.lang === "pt" ? "Solicitar Orcamento" : "Cotizar mi proyecto"} <ArrowRight className="h-5 w-5" />
              </a>
              <a href={"https://wa.me/14355348065?text=" + encodeURIComponent(`Hola desde ${props.country}, me interesa saber mas de B3TA`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold px-8 py-4 rounded-full transition-colors">
                <MessageCircle className="h-5 w-5" /> WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">{t.painTitle} {props.country} {props.lang === "es" ? "nos dicen" : props.lang === "en" ? "tell us" : "nos dizem"}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {t.pains(props.country).map((p, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-lg">
                  <span className="text-red-400 font-bold mt-0.5">✕</span>
                  <p className="text-sm text-slate-700">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">{t.servicesTitle} {props.country}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {t.services.map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all group">
                  <div className="w-11 h-11 rounded-lg bg-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{t.statsTitle}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {t.stats.map((s, i) => (
                <div key={i} className="p-4 bg-teal-50 rounded-lg text-center">
                  <p className="text-sm font-semibold text-teal-800">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">{props.lang === "en" ? "FAQ" : "Preguntas frecuentes"}</h2>
            <div className="space-y-4">
              {t.faq(props.country, props.currency).map((f, i) => (
                <details key={i} className="bg-white rounded-lg border border-gray-100 p-5 group">
                  <summary className="font-semibold text-slate-900 cursor-pointer list-none flex items-center justify-between">
                    {f.q} <span className="text-slate-400 group-open:rotate-45 transition-transform text-xl">+</span>
                  </summary>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact-country" className="py-16 bg-teal-800">
          <div className="container mx-auto px-4 sm:px-6 max-w-xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">{t.ctaTitle} {props.country}?</h2>
            <p className="text-teal-100 mb-8">{t.ctaSub}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={"https://wa.me/14355348065?text=" + encodeURIComponent(`Hola desde ${props.country}, quiero cotizar un proyecto`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-8 py-4 rounded-full transition-colors">
                <MessageCircle className="h-5 w-5" /> WhatsApp
              </a>
              <a href="mailto:hi@b3ta.us" className="inline-flex items-center justify-center gap-2 border border-teal-500 text-white hover:bg-teal-700 font-semibold px-8 py-4 rounded-full transition-colors">
                hi@b3ta.us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
