import { ServicePage } from "./ServicePage";
export default () => <ServicePage
  slug="sistemas-a-medida"
  title="Sistemas a Medida — Tu Propio Software en vez de Excel | B3TA Guatemala"
  h1="Sistemas a Medida para tu Negocio"
  subtitle="Cotizador, portal de clientes, control de inventario, dashboard. Tu propio sistema web hecho a la medida de como trabaja tu negocio. Adios Excel."
  metaDesc="Desarrollo de sistemas web a medida en Guatemala. Cotizadores, portales de clientes, dashboards. Deja de usar Excel y ten tu propio software."
  cta="Cotizar mi sistema"
  painPoints={[
    "Llevas todo en Excel y se te pierden los archivos",
    "Quieres cotizar desde el celular pero no puedes",
    "Tus clientes te llaman para saber el estado de su pedido",
    "No tienes forma de ver tus numeros en tiempo real",
  ]}
  solutions={[
    "Tu propio sistema web al que entras desde cualquier celular o computadora",
    "Cotizas en 2 minutos y el cliente recibe un PDF profesional automatico",
    "Portal donde tu cliente ve su historial, facturas y estado de pedidos",
    "Dashboard con tus ventas, clientes y numeros en tiempo real",
  ]}
  features={["Sistema web a medida", "Acceso desde celular y PC", "Login con usuarios y roles", "Cotizador con PDF automatico", "Portal de clientes", "Dashboard de ventas", "Base de datos en la nube", "Notificaciones automaticas", "Soporte y mantenimiento"]}
  faq={[
    { q: "Es como una app?", a: "Si, pero funciona en el navegador — no necesitas descargar nada. Entras desde tu celular o computadora con tu usuario y contrasena." },
    { q: "Es seguro?", a: "Si. Usamos Supabase (infraestructura de Amazon) con cifrado, backups automaticos y control de acceso por roles." },
    { q: "Puedo ir agregando funciones despues?", a: "Si. Empezamos con lo que mas necesitas (ej: cotizador) y despues le agregamos portal de clientes, reportes, etc." },
    { q: "El sistema es mio?", a: "Si. El codigo es tuyo. No dependes de nosotros para siempre, aunque ofrecemos soporte continuo si lo necesitas." },
  ]}
  relatedServices={[
    { label: "Paginas Web Guatemala", href: "/servicios/paginas-web-guatemala" },
    { label: "Automatizacion WhatsApp", href: "/servicios/automatizacion-whatsapp" },
    { label: "Correo Empresarial", href: "/servicios/correo-empresarial" },
  ]}
/>;
