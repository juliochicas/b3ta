import { ArrowRight } from "lucide-react";

const posts = [
  { slug: "cuanto-cuesta-pagina-web-guatemala", title: "Cuanto cuesta una pagina web en Guatemala", desc: "Precios reales desde Q900 hasta Q10,000+" },
  { slug: "como-salir-en-google-guatemala", title: "Como hacer que tu negocio salga en Google", desc: "Guia paso a paso sin tecnicismos" },
  { slug: "automatizar-negocio-sin-programar", title: "Como automatizar tu negocio sin programar", desc: "7 cosas que puedes automatizar hoy" },
];

export const RecentBlog = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Articulos que te pueden ayudar</h2>
          <a href="/blog" className="text-sm font-semibold text-teal-700 hover:text-teal-900 hidden sm:flex items-center gap-1 transition-colors">
            Ver todos <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <a key={i} href={`/blog/${p.slug}`} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all group block">
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">{p.title}</h3>
              <p className="text-sm text-slate-500">{p.desc}</p>
            </a>
          ))}
        </div>

        <a href="/blog" className="mt-6 text-sm font-semibold text-teal-700 hover:text-teal-900 sm:hidden flex items-center gap-1 justify-center transition-colors">
          Ver todos los articulos <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
};
