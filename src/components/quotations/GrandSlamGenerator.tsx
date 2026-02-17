import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2, Target, Download, CheckCircle2, Save, Pencil, X, Check, FileText, FileDown } from "lucide-react";
import jsPDF from "jspdf";

interface QuotationSection {
  title: string;
  icon: string;
  description: string;
  features: string[];
}

interface GrandSlamResult {
  analysis: {
    dream_outcome: string;
    pain_points: string[];
    perceived_probability: string;
    time_delay: string;
    effort_sacrifice: string;
  };
  quotation: {
    title: string;
    sections: QuotationSection[];
    pricing: {
      base_price: number;
      currency: string;
      terms: string;
    };
  };
  professional_summary: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (result: GrandSlamResult) => void;
  htmlContent?: string | null;
  customerName?: string;
  customerCompany?: string;
  clientPageId?: string;
  /** If provided, load this saved quotation instead of generating */
  savedResult?: GrandSlamResult | null;
  savedId?: string | null;
}

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "GTQ", label: "GTQ (Q)" },
  { value: "MXN", label: "MXN ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "COP", label: "COP ($)" },
  { value: "ARS", label: "ARS ($)" },
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", GTQ: "Q", MXN: "$", EUR: "€", COP: "$", ARS: "$",
};

// Strip emojis from text for jsPDF (it can't render them)
const stripEmoji = (text: string): string => {
  return text.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F900}-\u{1F9FF}]|[\u{200D}]|[\u{20E3}]|[\u{E0020}-\u{E007F}]|[^\x00-\x7F\xA0-\xFF\u0100-\u024F\u1E00-\u1EFF]/gu, '').trim();
};

export function GrandSlamGenerator({ open, onClose, onApply, htmlContent, customerName, customerCompany, clientPageId, savedResult, savedId }: Props) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<GrandSlamResult | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [currency, setCurrency] = useState("USD");
  const [editingPrice, setEditingPrice] = useState(false);
  const [editPrice, setEditPrice] = useState("");
  const [currentSavedId, setCurrentSavedId] = useState<string | null>(null);
  const [editName, setEditName] = useState(customerName || "");
  const [editCompany, setEditCompany] = useState(customerCompany || "");

  useEffect(() => {
    if (open) {
      loadProducts();
      setEditName(customerName || "");
      setEditCompany(customerCompany || "");
      if (savedResult) {
        setResult(savedResult);
        setCurrentSavedId(savedId || null);
        setCurrency(savedResult.quotation?.pricing?.currency || "USD");
      } else {
        setResult(null);
        setCurrentSavedId(null);
      }
    }
  }, [open, savedResult, savedId, customerName, customerCompany]);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products_services')
      .select('*')
      .eq('is_active', true)
      .order('name');
    setProducts(data || []);
  };

  const generate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-grand-slam-quotation', {
        body: {
          html_content: htmlContent,
          customer_name: editName,
          customer_company: editCompany,
          products_catalog: products,
          custom_prompt: customPrompt,
          currency,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data);
      setCurrentSavedId(null);
      toast.success("¡Cotización generada!");
    } catch (err: any) {
      toast.error(err.message || "Error generando cotización");
    } finally {
      setLoading(false);
    }
  };

  const saveQuotation = async () => {
    if (!result) return;
    setSaving(true);
    try {
      if (currentSavedId) {
        // Update existing
        const { error } = await supabase
          .from('generated_quotations')
          .update({
            result_json: result as any,
            currency,
            customer_name: editName,
            customer_company: editCompany,
          })
          .eq('id', currentSavedId);
        if (error) throw error;
        toast.success("Cotización actualizada");
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('generated_quotations')
          .insert({
            result_json: result as any,
            currency,
            customer_name: editName || null,
            customer_company: editCompany || null,
            client_page_id: clientPageId || null,
          })
          .select('id')
          .single();
        if (error) throw error;
        setCurrentSavedId(data.id);
        toast.success("Cotización guardada");
      }
    } catch (err: any) {
      toast.error(err.message || "Error guardando");
    } finally {
      setSaving(false);
    }
  };

  const sym = CURRENCY_SYMBOLS[currency] || "$";

  const formatPrice = (amount: number) => {
    return `${sym}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const updatePrice = (newPrice: number) => {
    if (!result) return;
    setResult({
      ...result,
      quotation: {
        ...result.quotation,
        pricing: { ...result.quotation.pricing, base_price: newPrice },
      },
    });
  };

  const updateSectionFeature = (sectionIdx: number, featureIdx: number, value: string) => {
    if (!result) return;
    const newSections = [...result.quotation.sections];
    newSections[sectionIdx] = {
      ...newSections[sectionIdx],
      features: newSections[sectionIdx].features.map((f, i) => i === featureIdx ? value : f),
    };
    setResult({
      ...result,
      quotation: { ...result.quotation, sections: newSections },
    });
  };

  const updateSectionTitle = (sectionIdx: number, value: string) => {
    if (!result) return;
    const newSections = [...result.quotation.sections];
    newSections[sectionIdx] = { ...newSections[sectionIdx], title: value };
    setResult({
      ...result,
      quotation: { ...result.quotation, sections: newSections },
    });
  };

  const updateSectionDescription = (sectionIdx: number, value: string) => {
    if (!result) return;
    const newSections = [...result.quotation.sections];
    newSections[sectionIdx] = { ...newSections[sectionIdx], description: value };
    setResult({
      ...result,
      quotation: { ...result.quotation, sections: newSections },
    });
  };

  const exportPDF = () => {
    if (!result) return;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;
    const maxWidth = pageWidth - margin * 2;
    let y = 0;

    const brandBlue = [43, 79, 224] as const;  // #2B4FE0
    const brandCyan = [0, 201, 167] as const;   // #00C9A7
    const brandDark = [26, 31, 46] as const;    // #1A1F2E

    const checkPage = (needed: number) => {
      if (y + needed > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }
    };

    const addTitle = (text: string, size = 14) => {
      checkPage(12);
      doc.setFontSize(size);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...brandDark);
      doc.text(stripEmoji(text), margin, y);
      y += size * 0.5 + 4;
    };

    const addText = (text: string, size = 10) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(stripEmoji(text), maxWidth);
      checkPage(lines.length * (size * 0.4 + 1));
      doc.text(lines, margin, y);
      y += lines.length * (size * 0.4 + 1) + 2;
    };

    const addBullet = (text: string) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const clean = stripEmoji(text);
      const lines = doc.splitTextToSize(clean, maxWidth - 8);
      checkPage(lines.length * 5);
      // Cyan bullet dot
      doc.setFillColor(...brandCyan);
      doc.circle(margin + 2, y - 1.5, 1, 'F');
      doc.text(lines, margin + 6, y);
      y += lines.length * 5 + 1;
    };

    // ── BRANDED HEADER ──
    doc.setFillColor(...brandDark);
    doc.rect(0, 0, pageWidth, 42, 'F');
    // Accent line
    doc.setFillColor(...brandCyan);
    doc.rect(0, 42, pageWidth, 2, 'F');

    // Logo text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("B3TA", margin, 16);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 200, 220);
    doc.text("Tecnolog\u00eda que escala contigo", margin, 22);

    // Client info in header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Propuesta para: ${editName || "Cliente"}`, margin, 32);
    if (editCompany) {
      doc.text(`Empresa: ${editCompany}`, margin, 37);
    }
    doc.setFontSize(9);
    doc.setTextColor(180, 200, 220);
    doc.text(`Moneda: ${currency}`, pageWidth - margin, 32, { align: "right" });
    doc.text(new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth - margin, 37, { align: "right" });

    y = 52;
    doc.setTextColor(0, 0, 0);

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...brandBlue);
    doc.text(stripEmoji(result.quotation.title), margin, y);
    y += 10;

    // Professional Summary
    if (result.professional_summary) {
      addText(result.professional_summary);
      y += 4;
    }

    // Valor Propuesto
    if (result.analysis?.dream_outcome) {
      doc.setFillColor(240, 245, 255);
      doc.roundedRect(margin - 2, y - 4, maxWidth + 4, 6 + Math.ceil(result.analysis.dream_outcome.length / 80) * 5, 2, 2, 'F');
      addTitle("Valor Propuesto", 12);
      addText(result.analysis.dream_outcome);
      y += 4;
    }

    // Sections
    result.quotation.sections.forEach((section) => {
      checkPage(20);
      // Section header with accent bar
      doc.setFillColor(...brandBlue);
      doc.rect(margin, y - 3, 3, 8, 'F');
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...brandDark);
      doc.text(stripEmoji(section.title), margin + 6, y + 2);
      y += 10;
      if (section.description) {
        addText(section.description);
        y += 1;
      }
      section.features.forEach(feature => addBullet(feature));
      y += 3;
    });

    // Pricing block
    checkPage(25);
    doc.setFillColor(...brandDark);
    doc.roundedRect(margin, y, maxWidth, 22, 3, 3, 'F');
    doc.setFillColor(...brandCyan);
    doc.rect(margin, y, 4, 22, 'F');
    doc.setTextColor(180, 200, 220);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Inversi\u00f3n Total", margin + 10, y + 8);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`${currency} ${formatPrice(result.quotation.pricing.base_price)}`, margin + 10, y + 17);
    y += 30;

    // Terms
    if (result.quotation.pricing.terms) {
      addTitle("T\u00e9rminos", 11);
      addText(result.quotation.pricing.terms);
    }

    // ── BRANDED FOOTER on all pages ──
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(...brandDark);
      doc.rect(0, pageHeight - 18, pageWidth, 18, 'F');
      doc.setFillColor(...brandCyan);
      doc.rect(0, pageHeight - 18, pageWidth, 1.5, 'F');
      doc.setTextColor(180, 200, 220);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("consulting@b3ta.us | b3ta.us | +1 435 534 8065", margin, pageHeight - 9);
      doc.text(`P\u00e1gina ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: "right" });
      doc.setFontSize(6);
      doc.setTextColor(120, 140, 160);
      doc.text("Consultor\u00eda en infraestructura, automatizaci\u00f3n y soluciones digitales", margin, pageHeight - 5);
    }

    const fileName = `Cotizacion-${stripEmoji(editCompany || editName || "Propuesta")}.pdf`.replace(/\s+/g, "-");
    doc.save(fileName);
    toast.success("PDF profesional exportado");
  };

  const exportConcisePDF = () => {
    if (!result) return;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = 0;

    const brandDark = [26, 31, 46] as const;
    const brandCyan = [0, 201, 167] as const;

    // ── Minimal header ──
    doc.setFillColor(...brandDark);
    doc.rect(0, 0, pageWidth, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("B3TA", margin, 14);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 200, 220);
    doc.text(new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth - margin, 14, { align: "right" });
    doc.setFillColor(...brandCyan);
    doc.rect(0, 28, pageWidth, 1.5, 'F');

    y = 38;

    // Client & title
    doc.setTextColor(...brandDark);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(stripEmoji(result.quotation.title), margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Para: ${editName || "Cliente"}${editCompany ? ` — ${editCompany}` : ""}`, margin, y);
    y += 10;

    // Thin separator
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Sections as compact list
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...brandDark);
    doc.text("Alcance del Proyecto", margin, y);
    y += 7;

    result.quotation.sections.forEach((section) => {
      if (y + 12 > pageHeight - 40) { doc.addPage(); y = 20; }
      // Section title
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text(stripEmoji(section.title), margin, y);
      y += 5;
      // Features as bullet list (no truncation)
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      section.features.forEach(f => {
        const clean = stripEmoji(f).replace(/^\*\*([^*]+?):?\*\*:?\s*/, '$1: ').replace(/:\s*:\s*/g, ': ');
        const fLines = doc.splitTextToSize(`- ${clean}`, maxWidth - 4);
        if (y + fLines.length * 3.8 > pageHeight - 40) { doc.addPage(); y = 20; }
        doc.text(fLines, margin + 2, y);
        y += fLines.length * 3.8 + 1;
      });
      y += 3;
    });

    // Price block
    if (y + 30 > pageHeight - 40) { doc.addPage(); y = 20; }
    y += 4;
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Inversi\u00f3n Total", margin, y);
    y += 7;
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...brandDark);
    doc.text(`${currency} ${formatPrice(result.quotation.pricing.base_price)}`, margin, y);
    y += 10;

    // Terms (compact)
    if (result.quotation.pricing.terms) {
      y += 4;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(130, 130, 130);
      const termLines = doc.splitTextToSize(stripEmoji(result.quotation.pricing.terms), maxWidth);
      if (y + termLines.length * 3.5 > pageHeight - 25) { doc.addPage(); y = 20; }
      doc.text(termLines, margin, y);
    }

    // Minimal footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setTextColor(160, 160, 160);
      doc.setFontSize(7);
      doc.text("consulting@b3ta.us | b3ta.us | +1 435 534 8065", margin, pageHeight - 8);
      doc.text(`${i}/${pageCount}`, pageWidth - margin, pageHeight - 8, { align: "right" });
    }

    const fileName = `Cotizacion-Concisa-${stripEmoji(editCompany || editName || "Propuesta")}.pdf`.replace(/\s+/g, "-");
    doc.save(fileName);
    toast.success("PDF conciso exportado");
  };

  const exportSalesPDF = () => {
    if (!result) return;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;
    const maxWidth = pageWidth - margin * 2;
    let y = 0;

    const brandBlue = [43, 79, 224] as const;
    const brandCyan = [0, 201, 167] as const;
    const brandDark = [26, 31, 46] as const;

    const checkPage = (needed: number) => {
      if (y + needed > pageHeight - 30) { doc.addPage(); y = 20; }
    };

    const addTitle = (text: string, size = 14) => {
      checkPage(12);
      doc.setFontSize(size);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...brandDark);
      doc.text(stripEmoji(text), margin, y);
      y += size * 0.5 + 4;
    };

    const addText = (text: string, size = 10) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(stripEmoji(text), maxWidth);
      checkPage(lines.length * (size * 0.4 + 1));
      doc.text(lines, margin, y);
      y += lines.length * (size * 0.4 + 1) + 2;
    };

    const addBullet = (text: string) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(stripEmoji(text), maxWidth - 8);
      checkPage(lines.length * 5);
      doc.setFillColor(...brandCyan);
      doc.circle(margin + 2, y - 1.5, 1, 'F');
      doc.text(lines, margin + 6, y);
      y += lines.length * 5 + 1;
    };

    // ── BRANDED HEADER (red accent for internal) ──
    doc.setFillColor(...brandDark);
    doc.rect(0, 0, pageWidth, 42, 'F');
    doc.setFillColor(220, 50, 50);
    doc.rect(0, 42, pageWidth, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("B3TA", margin, 16);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 120, 120);
    doc.text("DOCUMENTO INTERNO - TECNICAS DE VENTA", margin, 23);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`Cliente: ${editName || "No especificado"}`, margin, 32);
    if (editCompany) doc.text(`Empresa: ${editCompany}`, margin, 37);
    doc.setTextColor(180, 200, 220);
    doc.setFontSize(9);
    doc.text(`Precio: ${currency} ${formatPrice(result.quotation.pricing.base_price)}`, pageWidth - margin, 32, { align: "right" });
    doc.text(new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth - margin, 37, { align: "right" });

    y = 52;

    // Analisis Hormozi
    doc.setFillColor(255, 245, 245);
    doc.roundedRect(margin - 2, y - 4, maxWidth + 4, 10, 2, 2, 'F');
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...brandBlue);
    doc.text("An\u00e1lisis de Valor (Framework Hormozi)", margin, y + 2);
    y += 14;

    if (result.analysis.dream_outcome) {
      addTitle("Dream Outcome", 11);
      addText(result.analysis.dream_outcome);
      y += 3;
    }

    if (result.analysis.pain_points?.length) {
      addTitle("Puntos de Dolor Identificados", 11);
      result.analysis.pain_points.forEach(p => addBullet(p));
      y += 3;
    }

    if (result.analysis.perceived_probability) {
      addTitle("Probabilidad Percibida de \u00c9xito", 11);
      addText(result.analysis.perceived_probability);
      y += 3;
    }

    if (result.analysis.time_delay) {
      addTitle("Tiempo de Implementaci\u00f3n", 11);
      addText(result.analysis.time_delay);
      y += 3;
    }

    if (result.analysis.effort_sacrifice) {
      addTitle("Esfuerzo / Sacrificio del Cliente", 11);
      addText(result.analysis.effort_sacrifice);
      y += 3;
    }

    checkPage(15);
    addTitle("Resumen de Secciones de la Cotizaci\u00f3n", 12);
    result.quotation.sections.forEach((section) => {
      checkPage(10);
      addBullet(`${stripEmoji(section.title)}: ${stripEmoji(section.description || '')}`);
    });

    if (result.quotation.pricing.terms) {
      y += 5;
      addTitle("T\u00e9rminos Propuestos", 11);
      addText(result.quotation.pricing.terms);
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(...brandDark);
      doc.rect(0, pageHeight - 18, pageWidth, 18, 'F');
      doc.setFillColor(220, 50, 50);
      doc.rect(0, pageHeight - 18, pageWidth, 1.5, 'F');
      doc.setTextColor(255, 120, 120);
      doc.setFontSize(7);
      doc.text("CONFIDENCIAL - USO INTERNO", margin, pageHeight - 9);
      doc.setTextColor(180, 200, 220);
      doc.text(`P\u00e1gina ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: "right" });
    }

    const fileName = `Ventas-${stripEmoji(editCompany || editName || "Analisis")}.pdf`.replace(/\s+/g, "-");
    doc.save(fileName);
    toast.success("PDF de ventas exportado");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Generador de Cotización Profesional
          </DialogTitle>
          <DialogDescription>
            Análisis de valor + Cotización profesional para el cliente.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <Card className="p-4 bg-muted/50">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Cliente</Label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nombre del cliente"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Empresa</Label>
                  <Input
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    placeholder="Nombre de la empresa"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Demo HTML:</span>{" "}
                  <Badge variant={htmlContent ? "default" : "secondary"}>
                    {htmlContent ? "Disponible" : "No disponible"}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Productos:</span>{" "}
                  <span className="font-medium">{products.length} en catalogo</span>
                </div>
              </div>
            </Card>

            <div className="space-y-2">
              <Label>Moneda</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Instrucciones adicionales (opcional)</Label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ej: Enfocate en automatizacion. El cliente tiene 50 empleados..."
                rows={3}
              />
            </div>

            <Card className="p-4 border-primary/20 bg-primary/5">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                La IA usara analisis Hormozi internamente:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Ecuacion de Valor
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Dream Outcome
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Pain Points
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Redaccion Persuasiva
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                El resultado será una cotización profesional limpia, sin frameworks visibles.
              </p>
            </Card>

            <Button onClick={generate} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generando Cotización...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generar Cotización
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Analysis Section (Internal) */}
            <Card className="p-4 bg-muted/30 border-muted">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-muted-foreground" />
                Analisis Hormozi (solo para ti, no aparece en el PDF)
              </h3>
              <div className="space-y-2 text-xs">
                <p><span className="font-medium">Resultado:</span> {result.analysis.dream_outcome}</p>
                <div>
                  <span className="font-medium">Puntos de Dolor:</span>
                  <ul className="ml-4 list-disc text-muted-foreground">
                    {result.analysis.pain_points?.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Editable Quotation Title */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Titulo (editable)</Label>
              <Input
                value={result.quotation.title}
                onChange={(e) => setResult({ ...result, quotation: { ...result.quotation, title: e.target.value } })}
                className="text-lg font-bold"
              />
            </div>

            {/* Editable Summary */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Resumen (editable)</Label>
              <Textarea
                value={result.professional_summary}
                onChange={(e) => setResult({ ...result, professional_summary: e.target.value })}
                rows={3}
              />
            </div>

            {/* Editable Sections */}
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground">Secciones (editables)</Label>
              {result.quotation.sections.map((section, i) => (
                <Card key={i} className="p-3 space-y-2">
                  <Input
                    value={section.title}
                    onChange={(e) => updateSectionTitle(i, e.target.value)}
                    className="font-semibold"
                    placeholder="Título de sección"
                  />
                  <Textarea
                    value={section.description}
                    onChange={(e) => updateSectionDescription(i, e.target.value)}
                    rows={2}
                    placeholder="Descripcion"
                  />
                  <div className="space-y-1">
                    {section.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <span className="text-primary text-xs">•</span>
                        <Input
                          value={feature}
                          onChange={(e) => updateSectionFeature(i, j, e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Editable Pricing */}
            <Card className="p-4 border-2 border-primary bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm mb-1">Inversión Total</p>
                  {editingPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">{sym}</span>
                      <Input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="text-2xl font-bold w-48"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          const val = parseFloat(editPrice);
                          if (!isNaN(val)) updatePrice(val);
                          setEditingPrice(false);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditingPrice(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-primary">
                        {formatPrice(result.quotation.pricing.base_price)}
                      </p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditPrice(String(result.quotation.pricing.base_price));
                          setEditingPrice(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{currency}</p>
                </div>
              </div>
              {result.quotation.pricing.terms && (
                <div className="mt-4 pt-4 border-t space-y-1">
                  <Label className="text-xs text-muted-foreground">Terminos (editables)</Label>
                  <Textarea
                    value={result.quotation.pricing.terms}
                    onChange={(e) => setResult({
                      ...result,
                      quotation: {
                        ...result.quotation,
                        pricing: { ...result.quotation.pricing, terms: e.target.value },
                      },
                    })}
                    rows={3}
                  />
                </div>
              )}
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cerrar
              </Button>
              <Button variant="secondary" onClick={saveQuotation} disabled={saving} className="flex-1">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {currentSavedId ? "Actualizar" : "Guardar"}
              </Button>
              <Button onClick={exportPDF} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                PDF Cliente
              </Button>
              <Button variant="outline" onClick={exportConcisePDF} className="flex-1">
                <FileDown className="mr-2 h-4 w-4" />
                PDF Conciso
              </Button>
              <Button variant="secondary" onClick={exportSalesPDF} className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                PDF Ventas
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
