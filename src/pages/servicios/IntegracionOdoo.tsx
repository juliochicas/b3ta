import { ServicePage } from "./ServicePage";
export default () => <ServicePage
  slug="integracion-odoo"
  title="Integracion Odoo — Conecta tu ERP con Todo | B3TA Guatemala"
  h1="Integracion Odoo con tu Operacion"
  subtitle="Conectamos Odoo con tu tienda online, WhatsApp, facturacion y lo que necesites. Tu ERP trabajando con todos tus sistemas en vez de estar aislado."
  metaDesc="Integracion Odoo en Guatemala y LATAM. Conecta tu ERP con Shopify, WhatsApp, facturacion electronica y mas. Consultoria e implementacion."
  cta="Cotizar integracion Odoo"
  painPoints={[
    "Tienes Odoo pero esta desconectado de tu tienda online",
    "Digitas la misma informacion en Odoo y en otro sistema",
    "Tu equipo no sabe usar Odoo al 100%",
    "Quieres migrar de otro ERP a Odoo pero no sabes como",
  ]}
  solutions={[
    "Conectamos Odoo con Shopify, WordPress o tu tienda para que los pedidos fluyan solos",
    "Automatizamos la facturacion, inventario y reportes dentro de Odoo",
    "Capacitamos a tu equipo para que le saquen jugo a Odoo",
    "Si necesitas migrar, te ayudamos con la transicion sin perder datos",
  ]}
  features={["Integracion Odoo + Shopify", "Integracion Odoo + WordPress", "Facturacion electronica", "Inventario sincronizado", "Reportes personalizados", "Migracion de datos", "Capacitacion a tu equipo", "Soporte post-implementacion", "Modulos personalizados"]}
  faq={[
    { q: "Que version de Odoo manejan?", a: "Trabajamos con Odoo Community y Enterprise, versiones 15 a 17. Si tienes una version anterior, te ayudamos a actualizar." },
    { q: "Pueden hacer modulos custom?", a: "Si. Si necesitas algo que Odoo no trae de fabrica, lo desarrollamos a medida." },
    { q: "Cuanto cuesta?", a: "Depende de que quieres conectar. Una integracion basica desde $800 USD. Implementacion completa desde $2,000 USD." },
    { q: "Tambien trabajan con SAP?", a: "Si. Tambien hacemos integraciones con SAP Business One. Si no sabes cual ERP te conviene, te asesoramos gratis." },
  ]}
  relatedServices={[
    { label: "SAP Business One", href: "/servicios/sap-business-one" },
    { label: "Integracion SAP + Shopify", href: "/servicios/integracion-sap-shopify" },
    { label: "Sistemas a Medida", href: "/servicios/sistemas-a-medida" },
  ]}
/>;
