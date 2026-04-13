import { ServicePage } from "./ServicePage";
export default () => <ServicePage
  slug="automatizacion-whatsapp"
  title="Automatizacion WhatsApp — Bot y Notificaciones para tu Negocio | B3TA"
  h1="Automatizacion de WhatsApp para tu Negocio"
  subtitle="Deja de mandar mensajes uno por uno. Un bot que atiende clientes 24/7 y notificaciones automaticas cuando algo pasa en tu negocio."
  metaDesc="Bot de WhatsApp y notificaciones automaticas para empresas en Guatemala. Atencion 24/7 con IA, avisos de pedidos, recordatorios y mas."
  cta="Quiero automatizar mi WhatsApp"
  painPoints={[
    "Pasas todo el dia contestando WhatsApp a mano",
    "Tus clientes preguntan lo mismo una y otra vez",
    "Te olvidas de avisarle al cliente que su pedido esta listo",
    "Fuera de horario nadie contesta y pierdes ventas",
  ]}
  solutions={[
    "Bot de WhatsApp que responde preguntas frecuentes automaticamente con IA",
    "Notificaciones automaticas: pedido confirmado, en camino, entregado",
    "Recordatorios de citas, pagos pendientes o renovaciones",
    "El bot atiende 24/7 — tu duermes, el responde",
  ]}
  features={["Bot WhatsApp con IA", "Atencion 24/7 automatica", "Notificaciones de pedidos", "Recordatorios de citas", "Avisos de pagos pendientes", "Respuestas personalizadas", "Escala a humano cuando se necesita", "Reportes de conversaciones", "Integracion con tu sistema"]}
  faq={[
    { q: "El bot suena como robot?", a: "No. Usamos inteligencia artificial (Claude/GPT) que responde de forma natural, con la informacion de tu negocio. Tus clientes creen que es una persona." },
    { q: "Puedo ver las conversaciones?", a: "Si. Todas las conversaciones se registran y puedes verlas. Si el bot no sabe responder algo, te avisa para que tu intervengas." },
    { q: "Funciona con WhatsApp Business?", a: "Si. Usamos la API oficial de WhatsApp Business. Todo legal y seguro." },
    { q: "Cuanto cuesta?", a: "La configuracion del bot desde $500 USD. La API de WhatsApp tiene un costo mensual aparte (depende del volumen de mensajes)." },
  ]}
  relatedServices={[
    { label: "Sistemas a Medida", href: "/servicios/sistemas-a-medida" },
    { label: "Integracion SAP + Shopify", href: "/servicios/integracion-sap-shopify" },
    { label: "Paginas Web Guatemala", href: "/servicios/paginas-web-guatemala" },
  ]}
/>;
