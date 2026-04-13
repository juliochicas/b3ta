import { ServicePage } from "./ServicePage";
export default () => <ServicePage
  slug="paginas-web-guatemala"
  title="Paginas Web en Guatemala — Diseno Profesional desde $500 | B3TA"
  h1="Paginas Web Profesionales en Guatemala"
  subtitle="Tu propio sitio web que carga rapido, se ve bien en celular y hace que tus clientes te encuentren en Google. No necesitas saber nada de tecnologia."
  metaDesc="Diseno de paginas web profesionales en Guatemala desde $500. WordPress, Shopify, responsive, SEO incluido. Tu negocio visible en Google en dias."
  cta="Cotizar mi pagina web"
  painPoints={[
    "No tienes pagina web y tus clientes no te encuentran",
    "Tienes una pagina vieja que no se ve bien en celular",
    "Pagaste por una web pero nunca apareces en Google",
    "Tu competencia tiene pagina y tu no",
  ]}
  solutions={[
    "Disenamos tu pagina profesional en WordPress o codigo limpio",
    "La optimizamos para que Google la encuentre desde el primer dia",
    "Se ve perfecta en celular, tablet y computadora",
    "Incluimos formulario de contacto y boton de WhatsApp",
  ]}
  features={["Diseno moderno y profesional", "WordPress o codigo a medida", "Responsive (celular y PC)", "SEO basico incluido", "Hosting y SSL incluido", "Correo con tu dominio", "Formulario de contacto", "Boton de WhatsApp", "Velocidad optimizada"]}
  faq={[
    { q: "Cuanto cuesta una pagina web?", a: "Desde $500 USD. El precio depende de cuantas secciones necesitas y si quieres tienda online o solo informativa." },
    { q: "Cuanto tiempo tarda?", a: "Una pagina informativa la entregamos en 1-2 semanas. Una tienda online puede tomar 2-3 semanas." },
    { q: "Necesito saber de tecnologia?", a: "No. Nosotros nos encargamos de todo. Solo necesitamos tu logo, textos y fotos. Si no los tienes, te ayudamos." },
    { q: "Incluye hosting y correo?", a: "Si. Tu pagina viene con hosting, SSL (candadito verde) y correo profesional con tu dominio." },
  ]}
  relatedServices={[
    { label: "SEO Guatemala", href: "/servicios/seo-guatemala" },
    { label: "Tienda Shopify", href: "/servicios/tienda-shopify" },
    { label: "Correo Empresarial", href: "/servicios/correo-empresarial" },
  ]}
/>;
