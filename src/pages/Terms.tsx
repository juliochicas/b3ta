import { MainHeader } from "@/components/MainHeader";
import { Footer } from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <MainHeader />
      <main className="container mx-auto px-4 sm:px-6 max-w-3xl pt-28 pb-20">
        <h1 className="text-4xl font-black mb-8">Terminos de Servicio</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
          <p><strong>Ultima actualizacion:</strong> 11 de abril de 2026</p>

          <h2 className="text-xl font-bold text-foreground">1. Servicios</h2>
          <p>
            B3TA ofrece servicios de consultoria tecnologica, desarrollo web, integracion de sistemas (SAP, Shopify, n8n)
            y automatizacion para empresas. Cada proyecto se define mediante una propuesta o cotizacion escrita.
          </p>

          <h2 className="text-xl font-bold text-foreground">2. Cotizaciones y pagos</h2>
          <p>
            Los precios publicados en el sitio son referenciales. El precio final se define en la cotizacion del proyecto.
            Los pagos se realizan segun los terminos acordados en cada propuesta.
          </p>

          <h2 className="text-xl font-bold text-foreground">3. Propiedad intelectual</h2>
          <p>
            El codigo desarrollado para tu proyecto es de tu propiedad una vez completado el pago.
            Las herramientas, librerias y frameworks de terceros mantienen sus licencias originales.
          </p>

          <h2 className="text-xl font-bold text-foreground">4. Limitacion de responsabilidad</h2>
          <p>
            B3TA no se hace responsable por perdidas derivadas del uso incorrecto de los sistemas entregados
            o por cambios en servicios de terceros (APIs, hosting, etc.) fuera de nuestro control.
          </p>

          <h2 className="text-xl font-bold text-foreground">5. Contacto</h2>
          <p>
            Para consultas sobre estos terminos, escribenos a{" "}
            <a href="mailto:hi@b3ta.us" className="text-primary hover:underline">hi@b3ta.us</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
