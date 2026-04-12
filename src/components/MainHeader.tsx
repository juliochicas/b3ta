import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, Menu, X } from "lucide-react";

export const MainHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/#" + id);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { label: "Servicios", id: "servicios" },
    { label: "Proceso", id: "proceso" },
    { label: "Portafolio", id: "portafolio" },
    { label: "Precios", id: "precios" },
  ];

  return (
    <>
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
      Saltar al contenido
    </a>
    <header className="fixed top-0 w-full bg-slate-950/95 backdrop-blur-md z-50 border-b border-slate-800/50" role="banner">
      <div className="container mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div
          className="flex items-center gap-1.5 cursor-pointer"
          onClick={() => {
            if (location.pathname !== "/") navigate("/");
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="text-lg font-bold text-white tracking-tight">B3TA</span>
          <span className="text-[10px] text-slate-500 font-medium">.us</span>
        </div>

        <nav className="hidden md:flex items-center gap-1" role="navigation">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={"/#" + link.id}
              onClick={(e) => handleNavClick(e, link.id)}
              className="text-sm text-slate-400 hover:text-white px-3 py-2 rounded-md hover:bg-slate-800/50 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/auth"
            className="text-sm text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-2"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Entrar</span>
          </Link>
          <a
            href="#contact"
            className="text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors py-2 px-4 rounded-lg hidden sm:inline-flex"
            onClick={(e) => handleNavClick(e, "contact")}
          >
            Cotizar
          </a>

          <button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800/50">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={"/#" + link.id}
                onClick={(e) => handleNavClick(e, link.id)}
                className="text-base text-slate-400 hover:text-white hover:bg-slate-800/50 px-3 py-2.5 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="text-base font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-2.5 rounded-md transition-colors mt-1 text-center"
            >
              Cotizar proyecto
            </a>
          </nav>
        </div>
      )}
    </header>
    </>
  );
};
