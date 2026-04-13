"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Building2,
  Mail,
  Phone,
  Palette,
  Globe,
  FileText,
  Users,
  Target,
  ExternalLink,
  CheckCircle2,
  Clock,
  Eye,
  LinkIcon,
  Image as ImageIcon,
  Download,
  Printer,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Brief {
  id: string;
  created_at: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  company_name: string;
  industry: string;
  business_description: string;
  target_audience: string | null;
  services_offered: string | null;
  brand_colors: string | null;
  style_preference: string | null;
  reference_websites: string | null;
  logo_url: string | null;
  lead_id: string | null;
  quotation_id: string | null;
  status: string;
  notes: string | null;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-800" },
  reviewed: { label: "Revisado", color: "bg-blue-100 text-blue-800" },
  in_progress: { label: "En progreso", color: "bg-purple-100 text-purple-800" },
  completed: { label: "Completado", color: "bg-emerald-100 text-emerald-800" },
};

const styleLabels: Record<string, string> = {
  moderno: "Moderno y Minimalista",
  corporativo: "Corporativo y Profesional",
  creativo: "Creativo y Colorido",
  elegante: "Elegante y Premium",
  tecnologico: "Tecnologico y Futurista",
  natural: "Natural y Organico",
};

export function BriefsList() {
  const { toast } = useToast();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Brief | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Brief | null>(null);

  const fetchBriefs = async () => {
    const { data, error } = await (supabase as any)
      .from("briefs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setBriefs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBriefs();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await (supabase as any)
      .from("briefs")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Actualizado" });
      fetchBriefs();
      if (selected?.id === id) setSelected({ ...selected, status });
    }
  };

  const deleteBrief = async (brief: Brief) => {
    const { error } = await (supabase as any)
      .from("briefs")
      .delete()
      .eq("id", brief.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Brief eliminado" });
      setSelected(null);
      setDeleteTarget(null);
      fetchBriefs();
    }
  };

  const generatePrintContent = (brief: Brief) => {
    return `
      <html>
      <head>
        <title>Brief - ${brief.company_name}</title>
        <style>
          body { font-family: 'Segoe UI', system-ui, sans-serif; max-width: 700px; margin: 0 auto; padding: 40px 20px; color: #1e293b; }
          h1 { font-size: 24px; margin-bottom: 4px; }
          h2 { font-size: 16px; color: #0f766e; margin-top: 28px; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
          .subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
          .field { margin-bottom: 10px; font-size: 14px; line-height: 1.6; }
          .field strong { color: #334155; }
          .logo { max-height: 60px; margin-bottom: 16px; }
          .meta { font-size: 12px; color: #94a3b8; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        ${brief.logo_url ? `<img src="${brief.logo_url}" class="logo" />` : ""}
        <h1>${brief.company_name}</h1>
        <p class="subtitle">Brief creativo — ${brief.client_name}</p>

        <h2>Contacto</h2>
        <div class="field"><strong>Nombre:</strong> ${brief.client_name}</div>
        <div class="field"><strong>Email:</strong> ${brief.client_email}</div>
        ${brief.client_phone ? `<div class="field"><strong>Telefono:</strong> ${brief.client_phone}</div>` : ""}

        <h2>Negocio</h2>
        <div class="field"><strong>Rubro:</strong> ${brief.industry}</div>
        <div class="field"><strong>Descripcion:</strong> ${brief.business_description}</div>
        ${brief.target_audience ? `<div class="field"><strong>Publico objetivo:</strong> ${brief.target_audience}</div>` : ""}
        ${brief.services_offered ? `<div class="field"><strong>Servicios:</strong> ${brief.services_offered}</div>` : ""}

        <h2>Diseno</h2>
        ${brief.brand_colors ? `<div class="field"><strong>Colores:</strong> ${brief.brand_colors}</div>` : ""}
        ${brief.style_preference ? `<div class="field"><strong>Estilo:</strong> ${styleLabels[brief.style_preference] || brief.style_preference}</div>` : ""}
        ${brief.reference_websites ? `<div class="field"><strong>Referencias:</strong><br/>${brief.reference_websites.replace(/\n/g, "<br/>")}</div>` : ""}

        <div class="meta">Recibido: ${format(new Date(brief.created_at), "d 'de' MMMM yyyy, HH:mm", { locale: es })}</div>
      </body>
      </html>
    `;
  };

  const handlePrint = (brief: Brief) => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(generatePrintContent(brief));
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  const handleDownload = async (brief: Brief) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const addText = (text: string, size: number, bold: boolean, color: [number, number, number] = [30, 41, 59]) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, maxWidth);
      if (y + lines.length * (size * 0.5) > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(lines, margin, y);
      y += lines.length * (size * 0.45) + 2;
    };

    const addField = (label: string, value: string | null) => {
      if (!value) return;
      addText(`${label}: ${value}`, 10, false);
    };

    const addSection = (title: string) => {
      y += 4;
      doc.setDrawColor(15, 118, 110);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
      addText(title, 13, true, [15, 118, 110]);
      y += 2;
    };

    // Header
    addText(brief.company_name, 22, true);
    addText(`Brief creativo — ${brief.client_name}`, 11, false, [100, 116, 139]);
    y += 4;

    // Contacto
    addSection("Contacto");
    addField("Nombre", brief.client_name);
    addField("Email", brief.client_email);
    addField("Telefono", brief.client_phone);

    // Negocio
    addSection("Negocio");
    addField("Rubro", brief.industry);
    addField("Descripcion", brief.business_description);
    addField("Publico objetivo", brief.target_audience);
    addField("Servicios", brief.services_offered);

    // Diseno
    addSection("Diseno");
    addField("Colores", brief.brand_colors);
    addField("Estilo", brief.style_preference ? (styleLabels[brief.style_preference] || brief.style_preference) : null);
    addField("Referencias", brief.reference_websites);
    if (brief.logo_url) {
      addField("Logo", brief.logo_url);
    }

    // Footer
    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
    addText(`Recibido: ${format(new Date(brief.created_at), "d 'de' MMMM yyyy, HH:mm", { locale: es })}`, 8, false, [148, 163, 184]);

    doc.save(`brief-${brief.company_name.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {briefs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No hay briefs recibidos aun</p>
              <p className="text-sm text-muted-foreground mt-1">
                Comparte el link <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">b3ta.us/brief</span> con tus clientes
              </p>
            </CardContent>
          </Card>
        ) : (
          briefs.map((brief) => {
            const sc = statusConfig[brief.status] || statusConfig.pending;
            return (
              <Card
                key={brief.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelected(brief)}
              >
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {brief.logo_url ? (
                      <img src={brief.logo_url} alt="" className="h-10 w-10 rounded-lg object-contain bg-slate-50 border" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{brief.company_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {brief.client_name} — {brief.industry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.color}`}>
                      {sc.label}
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {format(new Date(brief.created_at), "d MMM yyyy", { locale: es })}
                    </span>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selected.logo_url && (
                    <img src={selected.logo_url} alt="" className="h-8 w-8 rounded object-contain" />
                  )}
                  {selected.company_name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Status + actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {Object.entries(statusConfig).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => updateStatus(selected.id, key)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                        selected.status === key
                          ? val.color + " ring-2 ring-offset-1 ring-current"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {val.label}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(selected)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Descargar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrint(selected)}
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Imprimir
                  </Button>
                  <div className="flex-1" />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(selected)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>

                {/* Contacto */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1">
                    <Users className="h-4 w-4" /> Contacto
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <a href={`mailto:${selected.client_email}`} className="text-primary hover:underline">
                        {selected.client_email}
                      </a>
                    </p>
                    {selected.client_phone && (
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <a href={`https://wa.me/${selected.client_phone.replace(/\D/g, "")}`} className="text-primary hover:underline">
                          {selected.client_phone}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {/* Negocio */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-4 w-4" /> Negocio
                  </h3>
                  <div className="text-sm space-y-2">
                    <p><span className="font-medium">Rubro:</span> {selected.industry}</p>
                    <p><span className="font-medium">Descripcion:</span> {selected.business_description}</p>
                    {selected.target_audience && (
                      <p><span className="font-medium">Publico:</span> {selected.target_audience}</p>
                    )}
                    {selected.services_offered && (
                      <p><span className="font-medium">Servicios:</span> {selected.services_offered}</p>
                    )}
                  </div>
                </div>

                {/* Diseno */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1">
                    <Palette className="h-4 w-4" /> Diseno
                  </h3>
                  <div className="text-sm space-y-2">
                    {selected.brand_colors && (
                      <p><span className="font-medium">Colores:</span> {selected.brand_colors}</p>
                    )}
                    {selected.style_preference && (
                      <p><span className="font-medium">Estilo:</span> {styleLabels[selected.style_preference] || selected.style_preference}</p>
                    )}
                    {selected.reference_websites && (
                      <div>
                        <span className="font-medium">Referencias:</span>
                        <div className="mt-1 space-y-1">
                          {selected.reference_websites.split("\n").filter(Boolean).map((url, i) => (
                            <a
                              key={i}
                              href={url.startsWith("http") ? url : `https://${url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {url.trim()}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    {selected.logo_url && (
                      <div>
                        <span className="font-medium">Logo:</span>
                        <a href={selected.logo_url} target="_blank" rel="noopener noreferrer" className="block mt-2">
                          <img src={selected.logo_url} alt="Logo" className="h-20 object-contain bg-slate-50 border rounded-lg p-2" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fecha */}
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Recibido {format(new Date(selected.created_at), "d 'de' MMMM yyyy, HH:mm", { locale: es })}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar brief</AlertDialogTitle>
            <AlertDialogDescription>
              Estas seguro que quieres eliminar el brief de{" "}
              <strong>{deleteTarget?.company_name}</strong>? Esta accion no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteBrief(deleteTarget)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
