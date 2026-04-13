import { ServicePage } from "./ServicePage";
export default () => <ServicePage
  slug="paginas-web-economicas"
  title="Paginas Web Economicas — Desde $500 USD | B3TA Guatemala"
  h1="Paginas Web Economicas para tu Negocio"
  subtitle="No necesitas gastar una fortuna para tener presencia en internet. Paginas web profesionales a precio accesible para emprendedores y PyMEs en Guatemala."
  metaDesc="Paginas web economicas desde $500 USD en Guatemala. Profesionales, rapidas, con SEO y correo incluido. Para emprendedores que quieren empezar sin gastar de mas."
  cta="Ver precios"
  painPoints={[
    "Te han cotizado paginas web carisimas y no te alcanza",
    "Quieres empezar tu negocio online pero no tienes mucho presupuesto",
    "Has visto paginas baratas pero se ven feas o no funcionan",
    "No sabes si vale la pena invertir en una pagina web",
  ]}
  solutions={[
    "Paginas desde $500 USD con diseno profesional real, no plantillas feas",
    "Incluimos hosting, SSL y correo — no hay costos escondidos",
    "Trabajamos por fases: primero lo basico, luego agregas lo que necesites",
    "La pagina se paga sola cuando te llegan los primeros clientes por Google",
  ]}
  features={["Desde $500 USD", "Diseno profesional (no plantilla)", "Hosting primer ano incluido", "Correo con tu dominio", "SEO basico incluido", "WhatsApp integrado", "Entrega en 1-2 semanas", "Se ve bien en celular", "Sin costos ocultos"]}
  faq={[
    { q: "Por que es tan economica?", a: "Usamos herramientas modernas que nos permiten trabajar rapido sin sacrificar calidad. No cobramos por hora, cobramos por proyecto." },
    { q: "Es una plantilla generica?", a: "No. Cada pagina se disena para tu negocio con tus colores, logo y contenido. No es una plantilla de $50." },
    { q: "Despues me cobran mas?", a: "El precio incluye todo: diseno, desarrollo, hosting del primer ano, SSL y correo. Despues solo pagas el hosting anual que es minimo." },
    { q: "Puedo agregar cosas despues?", a: "Si. Empezamos con lo basico y cuando tu negocio crezca, le agregamos tienda online, blog, sistema de citas, o lo que necesites." },
  ]}
  relatedServices={[
    { label: "Paginas Web Guatemala", href: "/servicios/paginas-web-guatemala" },
    { label: "Correo Empresarial", href: "/servicios/correo-empresarial" },
    { label: "SEO Guatemala", href: "/servicios/seo-guatemala" },
  ]}
/>;
