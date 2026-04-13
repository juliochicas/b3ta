import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">B3TA</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Consultoria tech en Guatemala. Paginas web, sistemas a medida y automatizacion para empresas en LATAM.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Servicios</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/#servicios" className="hover:text-white transition-colors">Paginas Web</a></li>
              <li><a href="/#servicios" className="hover:text-white transition-colors">Tiendas Online</a></li>
              <li><a href="/#servicios" className="hover:text-white transition-colors">Sistemas a Medida</a></li>
              <li><a href="/#servicios" className="hover:text-white transition-colors">Automatizacion</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="mailto:hi@b3ta.us" className="hover:text-white transition-colors">hi@b3ta.us</a></li>
              <li><a href="https://wa.me/14355348065" className="hover:text-white transition-colors">WhatsApp</a></li>
              <li><Link to="/privacidad" className="hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link to="/terminos" className="hover:text-white transition-colors">Terminos</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 text-center">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} B3TA. Guatemala, LATAM.</p>
        </div>
      </div>
    </footer>
  );
};
