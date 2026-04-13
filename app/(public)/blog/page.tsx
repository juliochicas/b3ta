import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog-posts";

export const metadata: Metadata = {
  title: "Blog — B3TA | Guias para digitalizar tu negocio",
  description:
    "Articulos practicos sobre paginas web, SEO, cotizaciones, WhatsApp bot y automatizacion para negocios en Guatemala y LATAM. Sin tecnicismos.",
};

export default function BlogIndex() {
  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Blog</h1>
        <p className="text-lg text-slate-500 mb-12">
          Guias practicas para digitalizar tu negocio. Sin tecnicismos, sin
          humo.
        </p>
        <div className="space-y-6">
          {blogPosts.map((p, i) => (
            <Link
              key={i}
              href={`/blog/${p.slug}`}
              className="block p-6 rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all group"
            >
              <time className="text-xs text-slate-400">{p.date}</time>
              <h2 className="text-xl font-bold text-slate-900 mt-1 mb-2 group-hover:text-teal-700 transition-colors">
                {p.title}
              </h2>
              <p className="text-sm text-slate-500">{p.metaDescription}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
