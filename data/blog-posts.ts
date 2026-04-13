export interface BlogPostData {
  slug: string;
  title: string;
  metaDescription: string;
  date: string;
  readTime: string;
  author: string;
  category: string;
  componentName: string;
  relatedPosts: { label: string; href: string }[];
  relatedServices: { label: string; href: string }[];
}

export const blogPosts: BlogPostData[] = [
  {
    slug: "cuanto-cobra-programador-guatemala",
    title: "Cuanto cobra un programador en Guatemala (precios reales 2026)",
    metaDescription:
      "Precios reales de programadores en Guatemala: freelance, agencias, remoto. Cuanto cuesta por hora, por proyecto, y que esperar por cada rango.",
    date: "2026-04-12",
    readTime: "5 min",
    author: "Julio Chicas",
    category: "Precios",
    componentName: "CuantoCobraProgramador",
    relatedPosts: [
      { label: "Cuanto cuesta una pagina web", href: "/blog/cuanto-cuesta-pagina-web-guatemala" },
      { label: "Software de cotizaciones", href: "/blog/mejor-software-cotizaciones" },
    ],
    relatedServices: [
      { label: "Sistemas a Medida", href: "/servicios/sistemas-a-medida" },
      { label: "Paginas Web Guatemala", href: "/servicios/paginas-web-guatemala" },
    ],
  },
  {
    slug: "que-necesito-para-mi-pagina-web",
    title: "Que necesito para hacer mi pagina web (checklist completo)",
    metaDescription:
      "Todo lo que necesitas tener listo antes de hacer tu pagina web: dominio, logo, textos, fotos, hosting. Checklist para no-tecnicos.",
    date: "2026-04-10",
    readTime: "4 min",
    author: "Julio Chicas",
    category: "Guias",
    componentName: "QueNecesitoParaMiWeb",
    relatedPosts: [
      { label: "Cuanto cuesta una pagina web", href: "/blog/cuanto-cuesta-pagina-web-guatemala" },
      { label: "Como salir en Google", href: "/blog/como-salir-en-google-guatemala" },
    ],
    relatedServices: [
      { label: "Paginas Web Guatemala", href: "/servicios/paginas-web-guatemala" },
      { label: "Correo Empresarial", href: "/servicios/correo-empresarial" },
    ],
  },
  {
    slug: "correo-empresarial-barato",
    title: "Correo empresarial barato: como tener hola@tuempresa.com",
    metaDescription:
      "Como tener correo profesional con tu dominio desde $100 USD al ano. Opciones: Zoho (gratis), Hostinger, Google Workspace. Para negocios en LATAM.",
    date: "2026-04-09",
    readTime: "4 min",
    author: "Julio Chicas",
    category: "Herramientas",
    componentName: "CorreoEmpresarialBarato",
    relatedPosts: [
      { label: "Cuanto cuesta una pagina web", href: "/blog/cuanto-cuesta-pagina-web-guatemala" },
      { label: "Que necesito para mi pagina web", href: "/blog/que-necesito-para-mi-pagina-web" },
    ],
    relatedServices: [
      { label: "Correo Empresarial", href: "/servicios/correo-empresarial" },
      { label: "Paginas Web Guatemala", href: "/servicios/paginas-web-guatemala" },
    ],
  },
  {
    slug: "automatizar-negocio-sin-programar",
    title: "Como automatizar tu negocio sin saber programar (guia practica)",
    metaDescription:
      "7 cosas que puedes automatizar hoy en tu negocio sin ser programador. WhatsApp, facturas, cotizaciones, recordatorios. Herramientas gratis y de pago.",
    date: "2026-04-07",
    readTime: "6 min",
    author: "Julio Chicas",
    category: "Automatizacion",
    componentName: "AutomatizarNegocio",
    relatedPosts: [
      { label: "Bot de WhatsApp para negocio", href: "/blog/como-crear-bot-whatsapp-negocio" },
      { label: "Software de cotizaciones", href: "/blog/mejor-software-cotizaciones" },
    ],
    relatedServices: [
      { label: "Automatizacion WhatsApp", href: "/servicios/automatizacion-whatsapp" },
      { label: "Sistemas a Medida", href: "/servicios/sistemas-a-medida" },
    ],
  },
  {
    slug: "shopify-vs-woocommerce-guatemala",
    title: "Shopify o WooCommerce: cual es mejor para Guatemala",
    metaDescription:
      "Comparativa real entre Shopify y WooCommerce para vender en Guatemala. Precios, contra entrega, NIT, envios. Pros y contras de cada uno.",
    date: "2026-04-05",
    readTime: "5 min",
    author: "Julio Chicas",
    category: "Comparativas",
    componentName: "ShopifyVsWoocommerce",
    relatedPosts: [
      { label: "Cuanto cuesta una pagina web", href: "/blog/cuanto-cuesta-pagina-web-guatemala" },
      { label: "SAP vs Odoo", href: "/blog/sap-vs-odoo-cual-elegir" },
    ],
    relatedServices: [
      { label: "Tienda Shopify", href: "/servicios/tienda-shopify" },
      { label: "Integracion SAP + Shopify", href: "/servicios/integracion-sap-shopify" },
    ],
  },
  {
    slug: "sap-vs-odoo-cual-elegir",
    title: "SAP Business One vs Odoo: cual te conviene (comparativa real)",
    metaDescription:
      "Comparamos SAP B1 y Odoo sin favoritismos. Precios, facilidad, modulos, implementacion. Para PyMEs que necesitan ERP sin gastar de mas.",
    date: "2026-04-03",
    readTime: "7 min",
    author: "Julio Chicas",
    category: "Comparativas",
    componentName: "SapVsOdoo",
    relatedPosts: [
      { label: "Software de cotizaciones", href: "/blog/mejor-software-cotizaciones" },
      { label: "Automatizar negocio sin programar", href: "/blog/automatizar-negocio-sin-programar" },
    ],
    relatedServices: [
      { label: "SAP Business One", href: "/servicios/sap-business-one" },
      { label: "Integracion Odoo", href: "/servicios/integracion-odoo" },
    ],
  },
  {
    slug: "como-crear-bot-whatsapp-negocio",
    title: "Como crear un bot de WhatsApp para tu negocio (sin ser programador)",
    metaDescription:
      "Guia practica para tener un bot de WhatsApp que atienda clientes 24/7. Opciones gratis y de pago, con precios reales. Para negocios en LATAM.",
    date: "2026-04-01",
    readTime: "6 min",
    author: "Julio Chicas",
    category: "Automatizacion",
    componentName: "BotWhatsappNegocio",
    relatedPosts: [
      { label: "Automatizar negocio sin programar", href: "/blog/automatizar-negocio-sin-programar" },
      { label: "Software de cotizaciones", href: "/blog/mejor-software-cotizaciones" },
    ],
    relatedServices: [
      { label: "Automatizacion WhatsApp", href: "/servicios/automatizacion-whatsapp" },
      { label: "Sistemas a Medida", href: "/servicios/sistemas-a-medida" },
    ],
  },
  {
    slug: "mejor-software-cotizaciones",
    title: "El mejor software de cotizaciones para PyMEs (comparativa honesta)",
    metaDescription:
      "Comparamos Zoho, HubSpot, Bsale, Odoo y sistemas custom para cotizar. Cual te conviene segun tu tamano y presupuesto. Sin humo.",
    date: "2026-03-28",
    readTime: "7 min",
    author: "Julio Chicas",
    category: "Comparativas",
    componentName: "MejorSoftwareCotizaciones",
    relatedPosts: [
      { label: "Automatizar negocio sin programar", href: "/blog/automatizar-negocio-sin-programar" },
      { label: "SAP vs Odoo", href: "/blog/sap-vs-odoo-cual-elegir" },
    ],
    relatedServices: [
      { label: "Sistemas a Medida", href: "/servicios/sistemas-a-medida" },
      { label: "Integracion Odoo", href: "/servicios/integracion-odoo" },
    ],
  },
  {
    slug: "como-salir-en-google-guatemala",
    title: "Como hacer que tu negocio salga en Google (guia para Guatemala)",
    metaDescription:
      "Guia paso a paso para que tu negocio en Guatemala aparezca en Google. Perfil de negocio, pagina web, SEO basico. Sin tecnicismos.",
    date: "2026-03-22",
    readTime: "6 min",
    author: "Julio Chicas",
    category: "SEO",
    componentName: "ComoSalirEnGoogle",
    relatedPosts: [
      { label: "Cuanto cuesta una pagina web", href: "/blog/cuanto-cuesta-pagina-web-guatemala" },
      { label: "Que necesito para mi pagina web", href: "/blog/que-necesito-para-mi-pagina-web" },
    ],
    relatedServices: [
      { label: "SEO Guatemala", href: "/servicios/seo-guatemala" },
      { label: "Paginas Web Guatemala", href: "/servicios/paginas-web-guatemala" },
    ],
  },
  {
    slug: "cuanto-cuesta-pagina-web-guatemala",
    title: "Cuanto cuesta una pagina web en Guatemala en 2026",
    metaDescription:
      "Precios reales de paginas web en Guatemala: desde Q900 hasta Q10,000+. Te explicamos que incluye cada rango y como elegir sin que te estafen.",
    date: "2026-03-15",
    readTime: "5 min",
    author: "Julio Chicas",
    category: "Precios",
    componentName: "CuantoCuestaPaginaWeb",
    relatedPosts: [
      { label: "Que necesito para mi pagina web", href: "/blog/que-necesito-para-mi-pagina-web" },
      { label: "Correo empresarial barato", href: "/blog/correo-empresarial-barato" },
    ],
    relatedServices: [
      { label: "Paginas Web Guatemala", href: "/servicios/paginas-web-guatemala" },
      { label: "Paginas Web Economicas", href: "/servicios/paginas-web-economicas" },
    ],
  },
];
