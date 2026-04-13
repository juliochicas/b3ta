import { ServicePage } from "./ServicePage";
export default () => <ServicePage
  slug="integracion-sap-shopify"
  title="Integracion SAP Business One + Shopify — Automatiza tu Operacion | B3TA"
  h1="Integracion SAP Business One con Shopify"
  subtitle="Que los pedidos de tu tienda online entren a SAP solos. Inventario, facturacion y envios sincronizados en tiempo real. Cero digitacion manual."
  metaDesc="Integracion SAP Business One con Shopify en Guatemala y LATAM. Pedidos, inventario y facturacion sincronizados automaticamente. Cero doble digitacion."
  cta="Quiero conectar SAP con Shopify"
  painPoints={[
    "Pasas pedidos de Shopify a SAP copiando y pegando",
    "El inventario de SAP no coincide con Shopify",
    "Tu equipo pierde horas digitando lo mismo en dos sistemas",
    "Se pierden pedidos porque el proceso es manual",
  ]}
  solutions={[
    "Pedido en Shopify → entra a SAP automaticamente como orden de venta",
    "El inventario se sincroniza en tiempo real: vendes en Shopify, SAP lo descuenta",
    "Facturacion automatica: SAP genera la factura cuando el pedido se confirma",
    "Notificacion automatica al cliente con numero de guia cuando se despacha",
  ]}
  features={["Sync pedidos Shopify → SAP", "Inventario en tiempo real", "Facturacion automatica", "Catalogo maestro unificado", "Precios sincronizados", "Notificacion de envio automatica", "Cargo Expreso integrado", "Validador NIT en checkout", "Dashboard de operacion"]}
  faq={[
    { q: "Que version de SAP necesito?", a: "SAP Business One (B1) con HANA. Es la version mas comun en Guatemala para PyMEs." },
    { q: "Cuanto tiempo tarda la integracion?", a: "Entre 3-6 semanas dependiendo de la complejidad de tu catalogo y procesos. Probamos todo con datos reales antes de lanzar." },
    { q: "Y si un pedido falla?", a: "El sistema tiene reintentos automaticos y alertas. Si algo falla, te avisa y registra el error para revisarlo." },
    { q: "Puedo sincronizar precios y descripciones?", a: "Si. El catalogo maestro vive en SAP y se refleja en Shopify automaticamente. Cambias el precio en SAP y Shopify se actualiza solo." },
  ]}
  relatedServices={[
    { label: "SAP Business One", href: "/servicios/sap-business-one" },
    { label: "Tienda Shopify", href: "/servicios/tienda-shopify" },
    { label: "Automatizacion WhatsApp", href: "/servicios/automatizacion-whatsapp" },
  ]}
/>;
