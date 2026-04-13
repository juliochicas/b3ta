"use client";

import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Upload,
  Palette,
  Globe,
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Sparkles,
  Users,
  Target,
  Briefcase,
} from "lucide-react";

const styleOptions = [
  { value: "moderno", label: "Moderno y Minimalista", emoji: "✨" },
  { value: "corporativo", label: "Corporativo y Profesional", emoji: "🏢" },
  { value: "creativo", label: "Creativo y Colorido", emoji: "🎨" },
  { value: "elegante", label: "Elegante y Premium", emoji: "💎" },
  { value: "tecnologico", label: "Tecnologico y Futurista", emoji: "🚀" },
  { value: "natural", label: "Natural y Organico", emoji: "🌿" },
];

export default function BriefPage() {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    company_name: "",
    industry: "",
    business_description: "",
    target_audience: "",
    services_offered: "",
    brand_colors: "",
    style_preference: "",
    reference_websites: "",
  });

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Archivo muy grande", description: "Maximo 5MB", variant: "destructive" });
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name || !form.client_email || !form.company_name || !form.industry || !form.business_description) {
      toast({ title: "Campos requeridos", description: "Llena nombre, email, empresa, rubro y descripcion", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      let logo_url = null;

      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("briefs")
          .upload(path, logoFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("briefs").getPublicUrl(path);
        logo_url = urlData.publicUrl;
      }

      const { error } = await (supabase as any)
        .from("briefs")
        .insert({
          ...form,
          logo_url,
        });

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "No se pudo enviar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-10">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Brief recibido!</h1>
          <p className="text-slate-500 mb-6">
            Revisaremos tu informacion y te contactaremos pronto con una propuesta personalizada.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl py-6">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            b3ta.us
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-700 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Brief Creativo</h1>
              <p className="text-sm text-slate-500">
                Cuentanos sobre tu proyecto para preparar tu propuesta
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="container mx-auto px-4 sm:px-6 max-w-3xl py-8 space-y-8">
        {/* Seccion 1: Datos de contacto */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-5 w-5 text-teal-700" />
            <h2 className="text-lg font-semibold text-slate-900">Datos de contacto</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={form.client_name}
                  onChange={(e) => set("client_name", e.target.value)}
                  placeholder="Tu nombre"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={form.client_email}
                  onChange={(e) => set("client_email", e.target.value)}
                  placeholder="tu@empresa.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Telefono / WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  value={form.client_phone}
                  onChange={(e) => set("client_phone", e.target.value)}
                  placeholder="+502 1234 5678"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre de la empresa *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) => set("company_name", e.target.value)}
                  placeholder="Mi Empresa S.A."
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Seccion 2: Sobre el negocio */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-5 w-5 text-teal-700" />
            <h2 className="text-lg font-semibold text-slate-900">Sobre tu negocio</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Rubro / Industria *
            </label>
            <input
              type="text"
              value={form.industry}
              onChange={(e) => set("industry", e.target.value)}
              placeholder="Ej: Restaurantes, Construccion, Salud, Tecnologia..."
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripcion del negocio *
            </label>
            <textarea
              value={form.business_description}
              onChange={(e) => set("business_description", e.target.value)}
              placeholder="Que hace tu empresa? Cual es tu propuesta de valor? Que te diferencia de la competencia?"
              required
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                Publico objetivo
              </div>
            </label>
            <textarea
              value={form.target_audience}
              onChange={(e) => set("target_audience", e.target.value)}
              placeholder="A quien le vendes? Edad, ubicacion, intereses, nivel socioeconomico..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Servicios o productos principales
            </label>
            <textarea
              value={form.services_offered}
              onChange={(e) => set("services_offered", e.target.value)}
              placeholder="Lista tus servicios o productos principales que quieres mostrar en la pagina"
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        </section>

        {/* Seccion 3: Diseno */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-5 w-5 text-teal-700" />
            <h2 className="text-lg font-semibold text-slate-900">Diseno y estilo</h2>
          </div>

          {/* Logo upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Logotipo
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-colors"
            >
              {logoPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-20 object-contain"
                  />
                  <p className="text-xs text-slate-500">{logoFile?.name}</p>
                  <p className="text-xs text-teal-600 font-medium">
                    Click para cambiar
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-slate-300" />
                  <p className="text-sm text-slate-500">
                    Arrastra tu logo aqui o{" "}
                    <span className="text-teal-600 font-medium">
                      click para subir
                    </span>
                  </p>
                  <p className="text-xs text-slate-400">
                    PNG, JPG, SVG — Maximo 5MB
                  </p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.svg"
                onChange={handleLogo}
                className="hidden"
              />
            </div>
          </div>

          {/* Colores */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Colores de la marca
            </label>
            <input
              type="text"
              value={form.brand_colors}
              onChange={(e) => set("brand_colors", e.target.value)}
              placeholder="Ej: Azul marino, dorado, blanco — o codigos hex: #1a237e, #ffd700"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Estilo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estilo visual preferido
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {styleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set("style_preference", opt.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                    form.style_preference === opt.value
                      ? "border-teal-500 bg-teal-50 text-teal-700 font-medium ring-2 ring-teal-200"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Referencia */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                Paginas web de referencia
              </div>
            </label>
            <textarea
              value={form.reference_websites}
              onChange={(e) => set("reference_websites", e.target.value)}
              placeholder="URLs de paginas que te gustan o que son de tu competencia. Una por linea."
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        </section>

        {/* Submit */}
        <div className="flex flex-col items-center gap-3 pb-12">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-10 py-3.5 rounded-full transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Enviar Brief
              </>
            )}
          </button>
          <p className="text-xs text-slate-400 text-center">
            Tu informacion es confidencial. Solo la usamos para preparar tu propuesta.
          </p>
        </div>
      </form>
    </div>
  );
}
