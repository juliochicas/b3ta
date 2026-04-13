"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import type { Metadata } from "next";

const authSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres"),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/crm");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) router.push("/crm");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try { authSchema.parse({ email, password }); } catch (error) {
      if (error instanceof z.ZodError) { toast({ title: "Error", description: error.issues[0].message, variant: "destructive" }); return; }
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

  const inputClass = "w-full h-12 pl-10 pr-4 rounded-lg text-slate-900 placeholder-slate-400 border border-slate-200 bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-none transition-colors text-sm";

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">B3TA</span>
          <h1 className="text-xl font-semibold text-slate-900 mt-8 mb-6">
            {isLogin ? "Iniciar sesion" : "Crear cuenta"}
          </h1>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
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
