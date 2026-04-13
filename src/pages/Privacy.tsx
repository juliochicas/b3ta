import { MainHeader } from "@/components/MainHeader";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <MainHeader />
      <main className="container mx-auto px-4 sm:px-6 max-w-3xl pt-28 pb-20">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Politica de Privacidad</h1>
        <div className="prose max-w-none space-y-6 text-slate-600">
          <p><strong>Ultima actualizacion:</strong> 11 de abril de 2026</p>

          <h2 className="text-xl font-bold text-slate-900">1. Informacion que recopilamos</h2>
          <p>
            Cuando nos contactas a traves del formulario del sitio, recopilamos tu correo electronico y el mensaje que nos envias.
            No recopilamos datos de navegacion ni usamos cookies de terceros con fines publicitarios.
          </p>

          <h2 className="text-xl font-bold text-slate-900">2. Como usamos tu informacion</h2>
          <p>
            Usamos tu correo unicamente para responderte sobre tu consulta o proyecto.
            No vendemos, compartimos ni transferimos tu informacion a terceros.
          </p>

          <h2 className="text-xl font-bold text-slate-900">3. Almacenamiento</h2>
          <p>
            Tus datos se almacenan en servidores seguros de Supabase (infraestructura de AWS).
            Aplicamos cifrado en transito (TLS) y acceso restringido por roles.
          </p>

          <h2 className="text-xl font-bold text-slate-900">4. Tus derechos</h2>
          <p>
            Puedes solicitar la eliminacion de tus datos en cualquier momento escribiendonos a{" "}
            <a href="mailto:hi@b3ta.us" className="text-primary hover:underline">hi@b3ta.us</a>.
          </p>

          <h2 className="text-xl font-bold text-slate-900">5. Contacto</h2>
          <p>
            B3TA — Guatemala City, Guatemala<br />
            <a href="mailto:hi@b3ta.us" className="text-primary hover:underline">hi@b3ta.us</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
