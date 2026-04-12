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
    
    // If not on home page, navigate to home page with hash
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      // Add a slight delay to allow navigation to complete before scrolling
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    
    // Smooth scroll if on home page
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-lg z-50 border-b border-border" role="banner">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (location.pathname !== '/') {
              navigate('/');
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <div className="text-2xl font-black font-sans tracking-tighter text-foreground">
            B3TA
          </div>
          <span className="text-xs font-bold text-muted-foreground mt-1">.us</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Navegación principal">
          <a href="/#servicios" onClick={(e) => handleNavClick(e, 'servicios')} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Servicios
          </a>
          <a href="/#proceso" onClick={(e) => handleNavClick(e, 'proceso')} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Proceso
          </a>
          <a href="/#casos" onClick={(e) => handleNavClick(e, 'casos')} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Casos
          </a>
          <a href="/#precios" onClick={(e) => handleNavClick(e, 'precios')} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Precios
          </a>
          <a href="/#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Contacto
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {/* CTA Mobile-friendly */}
          <a
            href="#contact"
            className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors py-2 px-4 rounded-lg hidden sm:inline-flex"
            onClick={(e) => handleNavClick(e, 'contact')}
          >
            Cotizar Gratis
          </a>
          <Link
            to="/auth"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Iniciar Sesión</span>
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border absolute top-full left-0 w-full shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col px-4 py-4 gap-4">
            <a href="/#servicios" onClick={(e) => handleNavClick(e, 'servicios')} className="text-base font-medium text-foreground hover:text-primary transition-colors">
              Servicios
            </a>
            <a href="/#proceso" onClick={(e) => handleNavClick(e, 'proceso')} className="text-base font-medium text-foreground hover:text-primary transition-colors">
              Proceso
            </a>
            <a href="/#casos" onClick={(e) => handleNavClick(e, 'casos')} className="text-base font-medium text-foreground hover:text-primary transition-colors">
              Casos
            </a>
            <a href="/#precios" onClick={(e) => handleNavClick(e, 'precios')} className="text-base font-medium text-foreground hover:text-primary transition-colors">
              Precios
            </a>
            <a href="/#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-base font-medium text-foreground hover:text-primary transition-colors">
              Contacto
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
