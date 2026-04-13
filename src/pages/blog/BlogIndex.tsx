import { MainHeader } from "@/components/MainHeader";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";

const posts = [
  { slug: "cuanto-cobra-programador-guatemala", title: "Cuanto cobra un programador en Guatemala", desc: "Precios por hora y por proyecto. Freelancer vs agencia. Banderas rojas.", date: "2026-04-12" },
  { slug: "que-necesito-para-mi-pagina-web", title: "Que necesito para hacer mi pagina web", desc: "Checklist completo para no-tecnicos. Lo que TU preparas vs lo que hace el dev.", date: "2026-04-10" },
  { slug: "correo-empresarial-barato", title: "Correo empresarial barato: hola@tuempresa.com", desc: "Desde gratis (Zoho) hasta $6/mes (Google). Como configurarlo.", date: "2026-04-09" },
  { slug: "automatizar-negocio-sin-programar", title: "Como automatizar tu negocio sin saber programar", desc: "7 cosas que puedes automatizar hoy. Herramientas gratis.", date: "2026-04-07" },
  { slug: "shopify-vs-woocommerce-guatemala", title: "Shopify o WooCommerce para Guatemala", desc: "Contra entrega, NIT, envios. Pros y contras reales.", date: "2026-04-05" },
  { slug: "sap-vs-odoo-cual-elegir", title: "SAP Business One vs Odoo: cual te conviene", desc: "Comparativa sin favoritismos. Precios, facilidad, para que tipo de empresa.", date: "2026-04-03" },
  { slug: "como-crear-bot-whatsapp-negocio", title: "Como crear un bot de WhatsApp para tu negocio", desc: "Opciones gratis y de pago. Con precios reales.", date: "2026-04-01" },
  { slug: "mejor-software-cotizaciones", title: "El mejor software de cotizaciones para PyMEs", desc: "Zoho, HubSpot, Bsale, Odoo vs sistema custom. Comparativa honesta.", date: "2026-03-28" },
  { slug: "como-salir-en-google-guatemala", title: "Como hacer que tu negocio salga en Google", desc: "Guia paso a paso. Perfil de negocio, pagina web, SEO basico.", date: "2026-03-22" },
  { slug: "cuanto-cuesta-pagina-web-guatemala", title: "Cuanto cuesta una pagina web en Guatemala en 2026", desc: "Precios reales: desde Q900 hasta Q10,000+. Que incluye cada rango.", date: "2026-03-15" },
];

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Helmet>
        <title>Blog — B3TA | Guias para digitalizar tu negocio</title>
        <meta name="description" content="Articulos practicos sobre paginas web, SEO, cotizaciones, WhatsApp bot y automatizacion para negocios en Guatemala y LATAM. Sin tecnicismos." />
      </Helmet>
      <MainHeader />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Blog</h1>
          <p className="text-lg text-slate-500 mb-12">Guias practicas para digitalizar tu negocio. Sin tecnicismos, sin humo.</p>
          <div className="space-y-6">
            {posts.map((p, i) => (
              <a key={i} href={`/blog/${p.slug}`} className="block p-6 rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all group">
                <time className="text-xs text-slate-400">{p.date}</time>
                <h2 className="text-xl font-bold text-slate-900 mt-1 mb-2 group-hover:text-teal-700 transition-colors">{p.title}</h2>
                <p className="text-sm text-slate-500">{p.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
