import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres"),
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) navigate("/crm");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try { authSchema.parse({ email, password }); } catch (error) {
      if (error instanceof z.ZodError) { toast({ title: "Error", description: error.errors[0].message, variant: "destructive" }); return; }
    }
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { if (error.message.includes("Invalid login credentials")) throw new Error("Email o contrasena incorrectos"); throw error; }
        toast({ title: "Bienvenido!", description: "Has iniciado sesion correctamente." });
      } else {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/crm`, data: { full_name: fullName || email } } });
        if (error) { if (error.message.includes("already registered")) throw new Error("Este email ya esta registrado."); throw error; }
        toast({ title: "Cuenta creada!", description: "Redirigiendo al panel..." });
      }
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Error en la autenticacion", variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (error) toast({ title: "Error", description: "No se pudo iniciar sesion con Google", variant: "destructive" });
  };

  const inputClass = "w-full h-12 pl-10 pr-4 rounded-lg text-slate-900 placeholder-slate-400 border border-slate-200 bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-none transition-colors text-sm";

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Form */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">B3TA</span>
          <h1 className="text-xl font-semibold text-slate-900 mt-8 mb-6">
            {isLogin ? "Iniciar sesion" : "Crear cuenta"}
          </h1>

          <button onClick={handleGoogleLogin} disabled={isLoading} className="w-full flex items-center justify-center gap-3 h-12 rounded-lg font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuar con Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-xs"><span className="px-3 text-slate-400 bg-slate-50">O</span></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <input type="text" placeholder="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading} className={inputClass} />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required className={inputClass} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input type={showPassword ? "text" : "password"} placeholder="Contrasena" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} required className={inputClass + " pr-12"} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <button type="submit" disabled={isLoading} className="w-full h-12 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-semibold transition-colors disabled:opacity-50 cursor-pointer">
              {isLoading ? "Procesando..." : isLogin ? "Iniciar Sesion" : "Crear Cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-slate-500 hover:text-teal-700 transition-colors cursor-pointer" disabled={isLoading}>
              {isLogin ? "No tienes cuenta? Registrate" : "Ya tienes cuenta? Inicia sesion"}
            </button>
          </div>
          <p className="mt-8 text-xs text-slate-400 text-center">
            Al continuar, aceptas nuestros <a href="/terminos" className="text-teal-600 hover:underline">Terminos</a> y <a href="/privacidad" className="text-teal-600 hover:underline">Privacidad</a>.
          </p>
        </div>
      </div>

      {/* Right: Welcome */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-12 bg-teal-800">
        <div className="max-w-lg text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Bienvenido a B3TA</h2>
          <p className="text-xl text-teal-100 leading-relaxed">
            Gestiona tu negocio con herramientas de CRM, cotizaciones e informes. Todo en un solo lugar.
          </p>
        </div>
      </div>
    </div>
  );
}
