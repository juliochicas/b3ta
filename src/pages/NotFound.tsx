import { MainHeader } from "@/components/MainHeader";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <MainHeader />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl text-center">
          <p className="text-7xl font-bold text-teal-700 mb-4">404</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Pagina no encontrada</h1>
          <p className="text-lg text-slate-500 mb-8">La pagina que buscas no existe o fue movida.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="inline-flex items-center justify-center bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-8 py-3 rounded-full transition-colors">
              Ir al inicio
            </Link>
            <Link to="/blog" className="inline-flex items-center justify-center border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold px-8 py-3 rounded-full transition-colors">
              Ver blog
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
