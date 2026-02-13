import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  FileText, 
  Clock, 
  Mail, 
  Video, 
  DollarSign,
  LogOut,
  Home,
  Globe
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "CRM", path: "/crm", icon: <Home className="h-4 w-4" /> },
  { label: "Informes", path: "/reports", icon: <FileText className="h-4 w-4" /> },
  { label: "Cotizaciones", path: "/quotations", icon: <DollarSign className="h-4 w-4" /> },
  { label: "Reuniones", path: "/meetings", icon: <Clock className="h-4 w-4" /> },
  { label: "Correo", path: "/email", icon: <Mail className="h-4 w-4" /> },
  { label: "Videos", path: "/videos", icon: <Video className="h-4 w-4" /> },
  { label: "Páginas", path: "/client-pages", icon: <Globe className="h-4 w-4" /> },
];

interface CRMNavigationProps {
  userEmail?: string;
  userRole?: string | null;
}

export const CRMNavigation = ({ userEmail, userRole }: CRMNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
    navigate('/auth');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
              B3TA
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "gap-2 transition-all duration-200",
                  isActive(item.path) 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "hover:bg-primary/10 hover:text-primary"
                )}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Desktop User Info & Logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right text-sm">
              <p className="font-medium truncate max-w-[150px]">{userEmail}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole || 'Usuario'}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                {/* User Info */}
                <div className="pb-4 mb-4 border-b">
                  <p className="font-medium text-sm truncate">{userEmail}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userRole || 'Usuario'}</p>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 space-y-1">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 transition-all duration-200",
                        isActive(item.path) 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "hover:bg-primary/10 hover:text-primary"
                      )}
                      onClick={() => handleNavigation(item.path)}
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  ))}
                </nav>

                {/* Logout */}
                <div className="pt-4 mt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
