import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { blogPosts } from "@/data/blog-posts";
import { BlogPostLayout } from "@/components/BlogPostLayout";

// Map slug to lazily loaded content component
const contentComponents: Record<
  string,
  React.ComponentType
> = {
  "cuanto-cobra-programador-guatemala": dynamic(
    () => import("@/components/blog-content/CuantoCobraProgramador")
  ),
  "que-necesito-para-mi-pagina-web": dynamic(
    () => import("@/components/blog-content/QueNecesitoParaMiWeb")
  ),
  "correo-empresarial-barato": dynamic(
    () => import("@/components/blog-content/CorreoEmpresarialBarato")
  ),
  "automatizar-negocio-sin-programar": dynamic(
    () => import("@/components/blog-content/AutomatizarNegocio")
  ),
  "shopify-vs-woocommerce-guatemala": dynamic(
    () => import("@/components/blog-content/ShopifyVsWoocommerce")
  ),
  "sap-vs-odoo-cual-elegir": dynamic(
    () => import("@/components/blog-content/SapVsOdoo")
  ),
  "como-crear-bot-whatsapp-negocio": dynamic(
    () => import("@/components/blog-content/BotWhatsappNegocio")
  ),
  "mejor-software-cotizaciones": dynamic(
    () => import("@/components/blog-content/MejorSoftwareCotizaciones")
  ),
  "como-salir-en-google-guatemala": dynamic(
    () => import("@/components/blog-content/ComoSalirEnGoogle")
  ),
  "cuanto-cuesta-pagina-web-guatemala": dynamic(
    () => import("@/components/blog-content/CuantoCuestaPaginaWeb")
  ),
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  const url = `https://b3ta.us/blog/${post.slug}`;

  return {
    title: `${post.title} | B3TA Blog`,
    description: post.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      url,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const ContentComponent = contentComponents[slug];
  if (!ContentComponent) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "B3TA",
      url: "https://b3ta.us",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostLayout
        slug={post.slug}
        title={post.title}
        date={post.date}
        readTime={post.readTime}
        relatedPosts={post.relatedPosts}
        relatedServices={post.relatedServices}
        content={<ContentComponent />}
      />
    </>
  );
}
