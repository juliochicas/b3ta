import { BlogPost } from "./BlogPost";

export default () => <BlogPost
  slug="que-necesito-para-mi-pagina-web"
  title="Que necesito para hacer mi pagina web (checklist completo)"
  metaDesc="Todo lo que necesitas tener listo antes de hacer tu pagina web: dominio, logo, textos, fotos, hosting. Checklist para no-tecnicos."
  date="2026-04-12"
  readTime="4 min"
  relatedPosts={[
    { label: "Cuanto cuesta una pagina web", href: "/blog/cuanto-cuesta-pagina-web-guatemala" },
    { label: "Como salir en Google", href: "/blog/como-salir-en-google-guatemala" },
  ]}
  relatedServices={[
    { label: "Paginas Web Guatemala", href: "/servicios/paginas-web-guatemala" },
    { label: "Correo Empresarial", href: "/servicios/correo-empresarial" },
  ]}
  content={<>
    <p>Quieres tu pagina web pero no sabes ni por donde empezar. Tranquilo, no necesitas saber de tecnologia. Solo necesitas tener estas cosas listas:</p>

    <h2>Lo que TU necesitas tener</h2>

    <h3>1. El nombre de tu negocio (para el dominio)</h3>
    <p>Tu dominio es tu direccion en internet: tuempresa.com. Piensa en algo corto, facil de recordar y que se pueda dictar por telefono sin confusiones. Cuesta $10-15 al ano.</p>

    <h3>2. Tu logo</h3>
    <p>Si ya lo tienes, perfecto. Si no, no pares por eso. Tu desarrollador te puede ayudar con un logo basico o puedes hacer uno en Canva gratis. Despues lo mejoras.</p>

    <h3>3. Textos basicos</h3>
    <p>No necesitas escribir un libro. Solo responde estas preguntas:</p>
    <ul>
      <li>Que hace tu negocio? (en una oracion)</li>
      <li>Que servicios o productos ofreces?</li>
      <li>Donde estas ubicado?</li>
      <li>Cual es tu telefono y WhatsApp?</li>
      <li>Por que deberian elegirte a ti?</li>
    </ul>

    <h3>4. Fotos</h3>
    <p>Fotos de tu negocio, tu equipo, tus productos. No necesitan ser profesionales — las del celular funcionan si tienen buena luz. Eso si, nada de fotos borrosas o oscuras.</p>

    <h3>5. Tu WhatsApp</h3>
    <p>El 90% de los contactos en Guatemala llegan por WhatsApp. Asegurate de que tu numero este listo para recibir mensajes de clientes.</p>

    <h2>Lo que tu desarrollador se encarga</h2>

    <ul>
      <li><strong>Hosting:</strong> El servidor donde vive tu pagina. Deberia venir incluido.</li>
      <li><strong>SSL:</strong> El candadito verde. Obligatorio. Deberia venir incluido.</li>
      <li><strong>Correo:</strong> hola@tuempresa.com. Deberia venir incluido.</li>
      <li><strong>SEO basico:</strong> Que Google te encuentre. Deberia venir incluido.</li>
      <li><strong>Responsive:</strong> Que se vea bien en celular. Obligatorio en 2026.</li>
    </ul>

    <h2>Lo que NO necesitas</h2>

    <ul>
      <li>No necesitas saber programar</li>
      <li>No necesitas textos perfectos (se pueden mejorar despues)</li>
      <li>No necesitas fotos profesionales para empezar</li>
      <li>No necesitas tener todo definido al 100%</li>
    </ul>

    <p>Lo peor que puedes hacer es no empezar porque "todavia no tengo todo listo". Empieza con lo que tienes. Una pagina basica es infinitamente mejor que no tener pagina.</p>

    <blockquote>Tu pagina web no tiene que ser perfecta desde el dia uno. Tiene que existir. Despues la mejoras.</blockquote>
  </>}
/>;
