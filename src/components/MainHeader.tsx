import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, Menu, X } from "lucide-react";

export const MainHeader = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/#" + id);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const links = [
    { label: "Servicios", id: "servicios" },
    { label: "Proceso", id: "proceso" },
    { label: "Proyectos", id: "casos" },
    { label: "Precios", id: "precios" },
  ];

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between max-w-6xl">
        <div className="cursor-pointer flex items-center gap-1" onClick={() => location.pathname !== "/" ? navigate("/") : window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="text-xl font-bold text-slate-900 tracking-tight">B3TA</span>
          <span className="text-xs text-slate-400">.us</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.id} href={"/#" + l.id} onClick={(e) => go(e, l.id)} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-sm text-slate-500 hover:text-slate-900 transition-colors hidden sm:flex items-center gap-1">
            <LogIn className="h-4 w-4" />
            Entrar
          </Link>
          <a href="#contact" onClick={(e) => go(e, "contact")} className="text-sm font-semibold bg-amber-400 hover:bg-amber-500 text-slate-900 py-2.5 px-5 rounded-full transition-colors hidden sm:inline-flex">
            Cotizar Gratis
          </a>
          <button className="md:hidden p-2 text-slate-600" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-3">
          {links.map((l) => (
            <a key={l.id} href={"/#" + l.id} onClick={(e) => go(e, l.id)} className="block text-base text-slate-600 hover:text-slate-900 py-2">
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={(e) => go(e, "contact")} className="block text-center font-semibold bg-amber-400 hover:bg-amber-500 text-slate-900 py-3 rounded-full">
            Cotizar Gratis
          </a>
        </div>
      )}
    </header>
  );
};
