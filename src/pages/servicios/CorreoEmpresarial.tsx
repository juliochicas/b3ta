import { ServicePage } from "./ServicePage";
export default () => <ServicePage
  slug="correo-empresarial"
  title="Correo Empresarial — hola@tuempresa.com | B3TA Guatemala"
  h1="Correo Empresarial con tu Dominio"
  subtitle="Deja de mandar cotizaciones desde Gmail o Hotmail. Ten tu propio correo profesional: hola@tuempresa.com. Tus clientes te van a tomar mas en serio."
  metaDesc="Correo empresarial profesional en Guatemala. Tu propio dominio, hosting incluido, configuracion completa. Desde $100 USD. hola@tuempresa.com"
  cta="Quiero mi correo profesional"
  painPoints={[
    "Mandas cotizaciones desde un @gmail.com y no se ve profesional",
    "Tu cliente no sabe si tu correo es real o spam",
    "No tienes dominio propio para tu negocio",
    "Quieres separar tu correo personal del de trabajo",
  ]}
  solutions={[
    "Tu correo con tu dominio: hola@tuempresa.com, ventas@tuempresa.com",
    "Funciona con Gmail, Outlook o cualquier app de correo",
    "Incluimos el dominio y hosting — todo configurado",
    "Tus correos llegan al inbox, no a spam",
  ]}
  features={["Correo con tu dominio", "Dominio .com o .com.gt", "Hosting incluido", "SSL (candadito verde)", "Funciona con Gmail/Outlook", "Anti-spam configurado", "Multiples cuentas de correo", "Configuracion completa", "Soporte tecnico"]}
  faq={[
    { q: "Cuanto cuesta?", a: "El correo empresarial viene incluido con la pagina web ($500). Si solo quieres el correo sin pagina, desde $100 USD por ano." },
    { q: "Puedo tener varios correos?", a: "Si. Puedes tener hola@, ventas@, soporte@, lo que necesites. El costo depende del plan de hosting." },
    { q: "Funciona con mi celular?", a: "Si. Lo configuras en la app de Gmail o Outlook de tu celular y listo. Recibes y mandas correo desde ahi." },
    { q: "Y si ya tengo dominio?", a: "Perfecto, usamos tu dominio existente. Solo lo conectamos y configuramos los correos." },
  ]}
  relatedServices={[
    { label: "Paginas Web Guatemala", href: "/servicios/paginas-web-guatemala" },
    { label: "Paginas Web Economicas", href: "/servicios/paginas-web-economicas" },
    { label: "SEO Guatemala", href: "/servicios/seo-guatemala" },
  ]}
/>;
