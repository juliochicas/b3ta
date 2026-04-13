import { MainHeader } from "@/components/MainHeader";
import { Footer } from "@/components/Footer";
import { ArrowRight, MessageCircle, Check } from "lucide-react";
import { Helmet } from "react-helmet";

interface ServicePageProps {
  title: string;
  h1: string;
  subtitle: string;
  metaDesc: string;
  slug: string;
  painPoints: string[];
  solutions: string[];
  features: string[];
  cta: string;
  faq: { q: string; a: string }[];
  relatedServices: { label: string; href: string }[];
}

export const ServicePage = (props: ServicePageProps) => {
  const scrollTo = () => document.getElementById("contacto-servicio")?.scrollIntoView({ behavior: "smooth" });
  const url = `https://b3ta.us/servicios/${props.slug}`;

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Helmet>
        <title>{props.title}</title>
        <meta name="description" content={props.metaDesc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.metaDesc} />
        <meta property="og:url" content={url} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": props.h1,
          "description": props.metaDesc,
          "provider": { "@type": "Organization", "name": "B3TA", "url": "https://b3ta.us" },
          "areaServed": [{ "@type": "Country", "name": "Guatemala" }, { "@type": "Country", "name": "Mexico" }, { "@type": "Country", "name": "Colombia" }],
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": props.faq.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://b3ta.us" },
            { "@type": "ListItem", "position": 2, "name": "Servicios", "item": "https://b3ta.us/#servicios" },
            { "@type": "ListItem", "position": 3, "name": props.h1, "item": url },
          ]
        })}</script>
      </Helmet>

      <MainHeader />

      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <nav className="text-sm text-slate-400 mb-8">
              <a href="/" className="hover:text-teal-700">Inicio</a> / <a href="/#servicios" className="hover:text-teal-700">Servicios</a> / <span className="text-slate-600">{props.h1}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">{props.h1}</h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl">{props.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={scrollTo} className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-8 py-4 rounded-full cursor-pointer transition-colors">
                {props.cta} <ArrowRight className="h-5 w-5" />
              </button>
              <button onClick={() => window.open("https://wa.me/14355348065?text=" + encodeURIComponent(`Hola, me interesa: ${props.h1}`), "_blank")} className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold px-8 py-4 rounded-full cursor-pointer transition-colors">
                <MessageCircle className="h-5 w-5" /> WhatsApp
              </button>
            </div>
          </div>
        </section>

        {/* Pain points */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Te suena familiar?</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {props.painPoints.map((p, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-lg">
                  <span className="text-red-400 font-bold text-lg leading-none mt-0.5">✕</span>
                  <p className="text-sm text-slate-700">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Asi lo resolvemos</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {props.solutions.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-teal-50 border border-teal-100 rounded-lg">
                  <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Que incluye</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {props.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg border border-gray-100">
                  <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {props.faq.map((f, i) => (
                <details key={i} className="bg-white rounded-lg border border-gray-100 p-5 group">
                  <summary className="font-semibold text-slate-900 cursor-pointer list-none flex items-center justify-between">
                    {f.q}
                    <span className="text-slate-400 group-open:rotate-45 transition-transform text-xl">+</span>
                  </summary>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Servicios relacionados</h3>
            <div className="flex flex-wrap gap-2">
              {props.relatedServices.map((r, i) => (
                <a key={i} href={r.href} className="text-sm text-teal-700 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-full transition-colors">{r.label}</a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contacto-servicio" className="py-16 bg-teal-800">
          <div className="container mx-auto px-4 sm:px-6 max-w-xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Te interesa?</h2>
            <p className="text-teal-100 mb-8">Escribenos por WhatsApp o correo. Te respondemos en menos de 24 horas.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={"https://wa.me/14355348065?text=" + encodeURIComponent(`Hola, me interesa: ${props.h1}`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-8 py-4 rounded-full transition-colors">
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
