import { MainHeader } from "@/components/MainHeader";
import { Footer } from "@/components/Footer";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Helmet } from "react-helmet";

interface BlogPostProps {
  slug: string;
  title: string;
  metaDesc: string;
  date: string;
  readTime: string;
  content: React.ReactNode;
  relatedPosts: { label: string; href: string }[];
  relatedServices: { label: string; href: string }[];
}

export const BlogPost = (props: BlogPostProps) => {
  const url = `https://b3ta.us/blog/${props.slug}`;

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Helmet>
        <title>{props.title} | B3TA Blog</title>
        <meta name="description" content={props.metaDesc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.metaDesc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "Article",
          "headline": props.title,
          "description": props.metaDesc,
          "datePublished": props.date,
          "author": { "@type": "Organization", "name": "B3TA", "url": "https://b3ta.us" },
          "publisher": { "@type": "Organization", "name": "B3TA" },
        })}</script>
      </Helmet>

      <MainHeader />

      <main>
        <article className="pt-32 pb-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <nav className="text-sm text-slate-400 mb-8">
              <a href="/" className="hover:text-teal-700">Inicio</a> / <a href="/blog" className="hover:text-teal-700">Blog</a> / <span className="text-slate-600">{props.title}</span>
            </nav>

            <div className="flex items-center gap-3 text-sm text-slate-400 mb-4">
              <time>{props.date}</time>
              <span>·</span>
              <span>{props.readTime} de lectura</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-8">{props.title}</h1>

            <div className="prose prose-slate prose-lg max-w-none [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-slate-900 [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-slate-800 [&>h3]:mt-8 [&>h3]:mb-3 [&>p]:text-slate-600 [&>p]:leading-relaxed [&>p]:mb-4 [&>ul]:text-slate-600 [&>ul]:mb-4 [&>ol]:text-slate-600 [&>ol]:mb-4 [&>li]:mb-2 [&>blockquote]:border-l-4 [&>blockquote]:border-amber-400 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-500">
              {props.content}
            </div>

            {/* CTA */}
            <div className="mt-12 p-8 bg-teal-800 rounded-xl text-center">
              <h3 className="text-xl font-bold text-white mb-3">Te ayudamos con esto</h3>
              <p className="text-teal-100 mb-6">Escribenos y te decimos como resolverlo para tu negocio.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={"https://wa.me/14355348065?text=" + encodeURIComponent(`Hola, lei el articulo "${props.title}" y me interesa`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-6 py-3 rounded-full transition-colors">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <a href="/#contact" className="inline-flex items-center justify-center gap-2 border border-teal-500 text-white hover:bg-teal-700 font-semibold px-6 py-3 rounded-full transition-colors">
                  Cotizar <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Related */}
            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Articulos relacionados</h4>
                <div className="space-y-2">
                  {props.relatedPosts.map((p, i) => (
                    <a key={i} href={p.href} className="block text-sm text-teal-700 hover:text-teal-900 transition-colors">{p.label} →</a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Servicios relacionados</h4>
                <div className="space-y-2">
                  {props.relatedServices.map((s, i) => (
                    <a key={i} href={s.href} className="block text-sm text-teal-700 hover:text-teal-900 transition-colors">{s.label} →</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};
