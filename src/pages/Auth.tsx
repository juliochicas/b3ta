import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/crm");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) navigate("/crm");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      authSchema.parse({ email, password });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Error de validación",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Email o contraseña incorrectos");
          }
          throw error;
        }

        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente.",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/crm`,
            data: { full_name: fullName || email },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            throw new Error("Este email ya está registrado. Por favor inicia sesión.");
          }
          throw error;
        }

        toast({
          title: "¡Cuenta creada!",
          description: "Tu cuenta ha sido creada. Redirigiendo al CRM...",
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error en la autenticación",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar sesión con Google",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Dark Form */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-12" style={{ backgroundColor: "#2C2C2C" }}>
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10">
            <span className="text-3xl font-bold font-sans tracking-normal text-white">
              B3TA
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-white mb-8">
            {isLogin ? "Sign in" : "Sign up"}
          </h1>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 h-12 rounded-md text-white font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#E74C3C" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar con Google
            </button>
          </div>

          {/* OR Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: "#4A4A4A" }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-400" style={{ backgroundColor: "#2C2C2C" }}>
                OR
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  aria-label="Nombre completo"
                  className="w-full h-12 pl-10 pr-4 rounded-md text-white placeholder-gray-500 border border-transparent focus:border-[#5B9CF3] focus:outline-none transition-colors"
                  style={{ backgroundColor: "#3A3A3A" }}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                aria-label="Email"
                className="w-full h-12 pl-10 pr-4 rounded-md text-white placeholder-gray-500 border border-transparent focus:border-[#5B9CF3] focus:outline-none transition-colors"
                style={{ backgroundColor: "#3A3A3A" }}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                aria-label="Contraseña"
                className="w-full h-12 pl-10 pr-12 rounded-md text-white placeholder-gray-500 border border-transparent focus:border-[#5B9CF3] focus:outline-none transition-colors"
                style={{ backgroundColor: "#3A3A3A" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-md text-white font-medium transition-opacity hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ backgroundColor: "#5B9CF3" }}
            >
              {isLoading
                ? "Procesando..."
                : isLogin
                ? "Iniciar Sesión"
                : "Crear Cuenta"}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-400 hover:text-[#5B9CF3] transition-colors"
              disabled={isLoading}
            >
              {isLogin
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>

          {/* Legal text */}
          <p className="mt-8 text-xs text-gray-500 text-center leading-relaxed">
            Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
          </p>
        </div>
      </div>

      {/* Right Panel - Gradient Welcome */}
      <div
        className="hidden md:flex w-1/2 items-center justify-center p-12"
        style={{
          background: "linear-gradient(135deg, #6B7FFF 0%, #9B6FFF 100%)",
        }}
      >
        <div className="max-w-lg text-center">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Bienvenido a B3TA
          </h2>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Tecnología que escala contigo. Gestiona tu negocio con herramientas inteligentes de CRM, cotizaciones e informes.
          </p>
          <div className="flex justify-center gap-4">
            <div className="w-2 h-2 rounded-full bg-white/60" />
            <div className="w-2 h-2 rounded-full bg-white" />
            <div className="w-2 h-2 rounded-full bg-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
