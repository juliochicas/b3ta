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
import { Sparkles, Loader2, Target, Download, CheckCircle2, Save, Pencil, X, Check, FileText } from "lucide-react";
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
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const checkPage = (needed: number) => {
      if (y + needed > pageHeight - 15) {
        doc.addPage();
        y = 20;
      }
    };

    const addTitle = (text: string, size = 14) => {
      checkPage(12);
      doc.setFontSize(size);
      doc.setFont("helvetica", "bold");
      const clean = stripEmoji(text);
      doc.text(clean, margin, y);
      y += size * 0.5 + 4;
    };

    const addText = (text: string, size = 10) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", "normal");
      const clean = stripEmoji(text);
      const lines = doc.splitTextToSize(clean, maxWidth);
      checkPage(lines.length * (size * 0.4 + 1));
      doc.text(lines, margin, y);
      y += lines.length * (size * 0.4 + 1) + 2;
    };

    const addBullet = (text: string) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const clean = stripEmoji(text);
      const bulletText = `- ${clean}`;
      const lines = doc.splitTextToSize(bulletText, maxWidth - 5);
      checkPage(lines.length * 5);
      doc.text(lines, margin + 3, y);
      y += lines.length * 5 + 1;
    };

    // Header
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Propuesta para: ${editName || "Cliente"}`, margin, y);
    y += 5;
    if (editCompany) {
      doc.text(`Empresa: ${editCompany}`, margin, y);
      y += 5;
    }
    doc.text(`Moneda: ${currency}`, margin, y);
    y += 8;
    doc.setTextColor(0);

    // Title
    addTitle(stripEmoji(result.quotation.title), 16);
    y += 2;

    // Professional Summary
    if (result.professional_summary) {
      addText(result.professional_summary);
      y += 4;
    }

    // Valor Propuesto
    if (result.analysis?.dream_outcome) {
      addTitle("Valor Propuesto", 12);
      addText(result.analysis.dream_outcome);
      y += 4;
    }

    // Sections
    result.quotation.sections.forEach((section) => {
      checkPage(20);
      const sectionTitle = stripEmoji(section.title);
      addTitle(sectionTitle, 12);
      if (section.description) {
        addText(section.description);
        y += 1;
      }
      section.features.forEach(feature => addBullet(feature));
      y += 3;
    });

    // Pricing
    checkPage(20);
    doc.setDrawColor(150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Inversion:", margin, y);
    doc.text(`${currency} ${formatPrice(result.quotation.pricing.base_price)}`, pageWidth - margin, y, { align: "right" });
    y += 10;

    // Terms
    if (result.quotation.pricing.terms) {
      addTitle("Terminos", 11);
      addText(result.quotation.pricing.terms);
    }

    const fileName = `Cotizacion-${stripEmoji(editCompany || editName || "Propuesta")}.pdf`.replace(/\s+/g, "-");
    doc.save(fileName);
    toast.success("PDF profesional exportado");
  };

  const exportSalesPDF = () => {
    if (!result) return;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const checkPage = (needed: number) => {
      if (y + needed > pageHeight - 15) { doc.addPage(); y = 20; }
    };

    const addTitle = (text: string, size = 14) => {
      checkPage(12);
      doc.setFontSize(size);
      doc.setFont("helvetica", "bold");
      doc.text(stripEmoji(text), margin, y);
      y += size * 0.5 + 4;
    };

    const addText = (text: string, size = 10) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(stripEmoji(text), maxWidth);
      checkPage(lines.length * (size * 0.4 + 1));
      doc.text(lines, margin, y);
      y += lines.length * (size * 0.4 + 1) + 2;
    };

    const addBullet = (text: string) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(`- ${stripEmoji(text)}`, maxWidth - 5);
      checkPage(lines.length * 5);
      doc.text(lines, margin + 3, y);
      y += lines.length * 5 + 1;
    };

    // Header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(150, 0, 0);
    doc.text("DOCUMENTO INTERNO - TECNICAS DE VENTA", margin, y);
    y += 8;
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Cliente: ${editName || "No especificado"}`, margin, y);
    y += 5;
    if (editCompany) { doc.text(`Empresa: ${editCompany}`, margin, y); y += 5; }
    doc.text(`Precio propuesto: ${currency} ${formatPrice(result.quotation.pricing.base_price)}`, margin, y);
    y += 10;

    // Analisis Hormozi
    addTitle("Analisis de Valor (Framework Hormozi)", 14);
    y += 2;

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
      addTitle("Probabilidad Percibida de Exito", 11);
      addText(result.analysis.perceived_probability);
      y += 3;
    }

    if (result.analysis.time_delay) {
      addTitle("Tiempo de Implementacion", 11);
      addText(result.analysis.time_delay);
      y += 3;
    }

    if (result.analysis.effort_sacrifice) {
      addTitle("Esfuerzo / Sacrificio del Cliente", 11);
      addText(result.analysis.effort_sacrifice);
      y += 3;
    }

    // Secciones de la cotización (resumen)
    checkPage(15);
    addTitle("Resumen de Secciones de la Cotizacion", 12);
    result.quotation.sections.forEach((section) => {
      checkPage(10);
      addBullet(`${stripEmoji(section.title)}: ${stripEmoji(section.description || '')}`);
    });

    // Terms
    if (result.quotation.pricing.terms) {
      y += 5;
      addTitle("Terminos Propuestos", 11);
      addText(result.quotation.pricing.terms);
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
                El resultado sera una cotizacion profesional limpia, sin frameworks visibles.
              </p>
            </Card>

            <Button onClick={generate} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generando Cotizacion...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generar Cotizacion
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
                    placeholder="Titulo de seccion"
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
                  <p className="text-muted-foreground text-sm mb-1">Inversion Total</p>
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
