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
    { label: "Precios", id: "precios" },
    { label: "Contacto", id: "contact" },
  ];

  return (
    <header className="fixed top-0 w-full bg-zinc-950/90 backdrop-blur-md z-50 border-b border-zinc-800" role="banner">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => {
            if (location.pathname !== "/") navigate("/");
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="text-xl font-bold text-white">B3TA</span>
          <span className="text-xs text-zinc-500">.us</span>
        </div>

        <nav className="hidden md:flex items-center gap-6" role="navigation">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={"/#" + link.id}
              onClick={(e) => handleNavClick(e, link.id)}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="text-sm font-medium bg-white text-zinc-900 hover:bg-zinc-200 transition-colors py-2 px-4 rounded-lg hidden sm:inline-flex"
            onClick={(e) => handleNavClick(e, "contact")}
          >
            Cotizar
          </a>
          <Link
            to="/auth"
            className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Entrar</span>
          </Link>

          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={"/#" + link.id}
                onClick={(e) => handleNavClick(e, link.id)}
                className="text-base text-zinc-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
