import { ServicePage } from "./ServicePage";
export default () => <ServicePage
  slug="tienda-shopify"
  title="Tienda Shopify en Guatemala — Vende por Internet | B3TA"
  h1="Tu Tienda Online con Shopify"
  subtitle="Vende tus productos por internet con la plataforma mas usada del mundo. Recibe pagos, gestiona inventario y envia pedidos desde un solo lugar."
  metaDesc="Creacion de tiendas Shopify en Guatemala. Vende por internet con pagos, inventario y envios. Integracion con SAP, Cargo Expreso y validador de NIT."
  cta="Quiero mi tienda online"
  painPoints={[
    "Quieres vender por internet pero no sabes como empezar",
    "Tienes productos pero solo vendes en redes sociales",
    "Tu tienda actual es dificil de administrar",
    "No puedes recibir pagos con tarjeta de forma facil",
  ]}
  solutions={[
    "Tu tienda Shopify lista para vender en 1-2 semanas",
    "Catalogo de productos organizado con fotos profesionales",
    "Pagos con tarjeta, transferencia y contra entrega (Cargo Expreso)",
    "Inventario sincronizado — se actualiza solo cuando vendes",
  ]}
  features={["Tienda Shopify configurada", "Catalogo de productos", "Pagos con tarjeta (Stripe/PayPal)", "Contra entrega (Cargo Expreso)", "Validador de NIT (Digifact)", "Inventario automatico", "Se ve bien en celular", "SEO para productos", "Integracion SAP opcional"]}
  faq={[
    { q: "Cuanto cuesta una tienda Shopify?", a: "La configuracion inicial desde $650 USD. Shopify cobra una mensualidad aparte (desde $29/mes) que tu pagas directo a ellos." },
    { q: "Puedo vender con contra entrega?", a: "Si. Integramos Cargo Expreso para que tus clientes paguen al recibir el producto. Incluimos formulario de direccion por departamento." },
    { q: "Se puede conectar con SAP?", a: "Si. Hacemos que los pedidos de Shopify entren a SAP automaticamente. Inventario, facturacion y envios sincronizados." },
    { q: "Necesito saber de tecnologia?", a: "No. Shopify es muy facil de usar. Te ensenamos a agregar productos, ver pedidos y gestionar tu tienda." },
  ]}
  relatedServices={[
    { label: "Integracion SAP + Shopify", href: "/servicios/integracion-sap-shopify" },
    { label: "SEO Guatemala", href: "/servicios/seo-guatemala" },
    { label: "Automatizacion WhatsApp", href: "/servicios/automatizacion-whatsapp" },
  ]}
/>;
