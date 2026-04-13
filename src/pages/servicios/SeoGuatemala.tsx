import { ServicePage } from "./ServicePage";
export default () => <ServicePage
  slug="seo-guatemala"
  title="SEO en Guatemala — Posicionate en Google | B3TA"
  h1="SEO en Guatemala: Que te encuentren en Google"
  subtitle="Tus clientes buscan lo que tu vendes pero encuentran a tu competencia. Hacemos que tu negocio aparezca en los primeros resultados de Google."
  metaDesc="Servicio de SEO en Guatemala. Posiciona tu negocio en Google, atrae clientes que buscan tus servicios. SEO tecnico, contenido y SEO programatico."
  cta="Quiero aparecer en Google"
  painPoints={[
    "Buscas tu negocio en Google y no apareces",
    "Tu competencia sale primero que tu",
    "Pagaste por una pagina pero no genera clientes",
    "No sabes que es SEO ni por donde empezar",
  ]}
  solutions={[
    "Optimizamos tu pagina para que Google la entienda y la muestre primero",
    "Creamos contenido que responde lo que tus clientes buscan",
    "SEO programatico: generamos paginas para cada servicio o producto que ofreces",
    "Te mostramos resultados reales con reportes mensuales",
  ]}
  features={["Auditoria SEO completa", "Optimizacion de meta tags", "Velocidad de carga (Core Web Vitals)", "Schema markup (datos estructurados)", "SEO programatico a escala", "Contenido optimizado para busquedas", "Google Search Console configurado", "Reportes mensuales de posiciones", "Link building interno"]}
  faq={[
    { q: "Que es SEO?", a: "Es hacer que tu pagina web aparezca en Google cuando alguien busca lo que tu vendes. Por ejemplo, si vendes pasteles en Guatemala, que cuando busquen 'pasteles Guatemala' tu salgas." },
    { q: "En cuanto tiempo se ven resultados?", a: "Los primeros cambios se notan en 2-4 semanas. Resultados fuertes entre 2-3 meses. El SEO es una inversion que crece con el tiempo." },
    { q: "Cuanto cuesta?", a: "El SEO basico viene incluido con la pagina web ($500). Si quieres una estrategia completa con contenido y SEO programatico, desde $300/mes." },
    { q: "Que es SEO programatico?", a: "Es generar muchas paginas optimizadas automaticamente. Por ejemplo, hicimos 4,000+ paginas para una tienda de celulares y triplicaron su trafico." },
  ]}
  relatedServices={[
    { label: "Paginas Web Guatemala", href: "/servicios/paginas-web-guatemala" },
    { label: "Tienda Shopify", href: "/servicios/tienda-shopify" },
    { label: "Sistemas a Medida", href: "/servicios/sistemas-a-medida" },
  ]}
/>;
