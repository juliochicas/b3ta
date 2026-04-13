import { BlogPost } from "./BlogPost";

export default () => <BlogPost
  slug="shopify-vs-woocommerce-guatemala"
  title="Shopify o WooCommerce: cual es mejor para Guatemala"
  metaDesc="Comparativa real entre Shopify y WooCommerce para vender en Guatemala. Precios, contra entrega, NIT, envios. Pros y contras de cada uno."
  date="2026-04-12"
  readTime="5 min"
  relatedPosts={[
    { label: "Cuanto cuesta una pagina web", href: "/blog/cuanto-cuesta-pagina-web-guatemala" },
    { label: "SAP vs Odoo", href: "/blog/sap-vs-odoo-cual-elegir" },
  ]}
  relatedServices={[
    { label: "Tienda Shopify", href: "/servicios/tienda-shopify" },
    { label: "Integracion SAP + Shopify", href: "/servicios/integracion-sap-shopify" },
  ]}
  content={<>
    <p>Quieres vender por internet en Guatemala pero no sabes si usar Shopify o WooCommerce. Las dos funcionan. Pero una te conviene mas que la otra dependiendo de tu situacion. Te lo explico sin rodeos.</p>

    <h2>La diferencia principal</h2>

    <p><strong>Shopify:</strong> Tu pagas mensualidad ($29-79 USD/mes) y ellos se encargan de todo — hosting, seguridad, actualizaciones, pagos. Tu solo subes productos y vendes.</p>

    <p><strong>WooCommerce:</strong> Es un plugin gratis para WordPress. Tu te encargas de hosting, seguridad, actualizaciones y pagos. Mas control pero mas trabajo.</p>

    <h2>Para Guatemala especificamente</h2>

    <p>Guatemala tiene dos particularidades que importan:</p>

    <ol>
      <li><strong>Contra entrega:</strong> La mayoria de gente en Guatemala quiere pagar al recibir, no con tarjeta. Shopify no trae contra entrega nativo — necesitas un plugin o desarrollo custom. WooCommerce lo configuras facil.</li>
      <li><strong>Validacion de NIT:</strong> Para facturar necesitas validar NIT en el checkout. En Shopify necesitas un plugin custom (Digifact). En WooCommerce tambien necesitas plugin pero hay mas opciones.</li>
    </ol>

    <h2>Mi recomendacion honesta</h2>

    <p><strong>Usa Shopify si:</strong></p>
    <ul>
      <li>No sabes nada de tecnologia y no quieres aprender</li>
      <li>Quieres tu tienda lista en 1 semana</li>
      <li>Ya vendes por Instagram/WhatsApp y quieres formalizarte</li>
      <li>Puedes pagar $29/mes sin problema</li>
    </ul>

    <p><strong>Usa WooCommerce si:</strong></p>
    <ul>
      <li>Ya tienes pagina en WordPress</li>
      <li>Quieres control total y no pagar mensualidad a Shopify</li>
      <li>Tienes alguien tecnico que te ayude a mantenerlo</li>
      <li>Necesitas personalizaciones muy especificas</li>
    </ul>

    <h2>Costos reales</h2>

    <p><strong>Shopify:</strong> $29/mes + comision por venta (2%) + plugin contra entrega ($50-200) + plugin NIT ($100-300) = primer ano: ~$700 USD</p>

    <p><strong>WooCommerce:</strong> Hosting ($60/ano) + tema ($0-60) + plugins ($0-200) + SSL (gratis con hosting) = primer ano: ~$200 USD. Pero le tienes que meter mano o pagar a alguien.</p>

    <blockquote>Si no tienes a alguien tecnico y quieres vender ya, Shopify. Si quieres ahorrar y tienes paciencia, WooCommerce. Ambas funcionan — la que no funciona es la que nunca lanzas.</blockquote>
  </>}
/>;
