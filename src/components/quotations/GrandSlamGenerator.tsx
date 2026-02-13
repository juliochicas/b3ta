import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2, Target, Download, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";

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
    sections: Array<{
      title: string;
      icon: string;
      description: string;
      features: string[];
    }>;
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
}

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "MXN", label: "MXN ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "COP", label: "COP ($)" },
  { value: "ARS", label: "ARS ($)" },
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", MXN: "$", EUR: "€", COP: "$", ARS: "$",
};

export function GrandSlamGenerator({ open, onClose, onApply, htmlContent, customerName, customerCompany }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GrandSlamResult | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open]);

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
          customer_name: customerName,
          customer_company: customerCompany,
          products_catalog: products,
          custom_prompt: customPrompt,
          currency,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data);
      toast.success("¡Cotización generada!");
    } catch (err: any) {
      toast.error(err.message || "Error generando cotización");
    } finally {
      setLoading(false);
    }
  };

  const sym = CURRENCY_SYMBOLS[currency] || "$";

  const formatPrice = (amount: number) => {
    return `${sym}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const exportPDF = () => {
    if (!result) return;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const checkPage = (needed: number) => {
      if (y + needed > doc.internal.pageSize.getHeight() - 15) {
        doc.addPage();
        y = 20;
      }
    };

    const addTitle = (text: string, size = 14) => {
      checkPage(12);
      doc.setFontSize(size);
      doc.setFont("helvetica", "bold");
      doc.text(text, margin, y);
      y += size * 0.5 + 4;
    };

    const addText = (text: string, size = 10) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(text, maxWidth);
      checkPage(lines.length * (size * 0.4 + 1));
      doc.text(lines, margin, y);
      y += lines.length * (size * 0.4 + 1) + 2;
    };

    const addBullet = (text: string) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(`• ${text}`, maxWidth - 5);
      checkPage(lines.length * 5);
      doc.text(lines, margin + 3, y);
      y += lines.length * 5 + 1;
    };

    // Header
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Propuesta para: ${customerName || "Cliente"}`, margin, y);
    y += 6;
    if (customerCompany) {
      doc.text(`Empresa: ${customerCompany}`, margin, y);
      y += 6;
    }
    doc.text(`Moneda: ${currency}`, margin, y);
    y += 10;
    doc.setTextColor(0);

    // Title
    addTitle(result.quotation.title, 16);
    y += 2;

    // Professional Summary
    addText(result.professional_summary);
    y += 4;

    // Analysis (Hormozi internamente)
    addTitle("Valor Propuesto", 12);
    addText(`${result.analysis.dream_outcome}`);
    y += 2;

    // Sections
    result.quotation.sections.forEach((section) => {
      checkPage(20);
      addTitle(`${section.icon} ${section.title}`, 12);
      addText(section.description);
      y += 2;
      section.features.forEach(feature => addBullet(feature));
      y += 3;
    });

    // Pricing
    checkPage(15);
    doc.setDrawColor(150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Inversión:", margin, y);
    doc.text(formatPrice(result.quotation.pricing.base_price), pageWidth - margin, y, { align: "right" });
    y += 10;

    // Terms
    if (result.quotation.pricing.terms) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Términos:", margin, y);
      y += 5;
      addText(result.quotation.pricing.terms);
    }

    const fileName = `Cotizacion-${customerCompany || customerName || "Propuesta"}.pdf`.replace(/\s+/g, "-");
    doc.save(fileName);
    toast.success("PDF exportado correctamente");
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
            Análisis de valor + Cotización profesional limpia para el cliente.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <Card className="p-4 bg-muted/50">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Cliente:</span>{" "}
                  <span className="font-medium">{customerName || "No especificado"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Empresa:</span>{" "}
                  <span className="font-medium">{customerCompany || "No especificada"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Demo HTML:</span>{" "}
                  <Badge variant={htmlContent ? "default" : "secondary"}>
                    {htmlContent ? "Disponible" : "No disponible"}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Productos:</span>{" "}
                  <span className="font-medium">{products.length} en catálogo</span>
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
                placeholder="Ej: Enfócate en automatización. El cliente tiene 50 empleados..."
                rows={3}
              />
            </div>

            <Card className="p-4 border-primary/20 bg-primary/5">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                La IA usará análisis Hormozi internamente:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Ecuación de Valor
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
                  Redacción Persuasiva
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                El resultado será una cotización profesional limpia, sin frameworks visibles, pero con la persuasión de Hormozi atrás.
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
            <Card className="p-4 bg-secondary/20 border-secondary/40">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary-foreground" />
                Análisis Hormozi (Interno)
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-secondary-foreground">🎯 Resultado Soñado:</span>
                  <p className="ml-6 text-muted-foreground">{result.analysis.dream_outcome}</p>
                </div>
                <div>
                  <span className="font-medium text-secondary-foreground">🔥 Puntos de Dolor:</span>
                  <ul className="ml-6 list-disc text-muted-foreground">
                    {result.analysis.pain_points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2 rounded bg-green-50 dark:bg-green-950/30">
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">📈 Probabilidad</span>
                    <p className="text-xs mt-1">{result.analysis.perceived_probability}</p>
                  </div>
                  <div className="p-2 rounded bg-blue-50 dark:bg-blue-950/30">
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-400">⏱ Tiempo</span>
                    <p className="text-xs mt-1">{result.analysis.time_delay}</p>
                  </div>
                  <div className="p-2 rounded bg-purple-50 dark:bg-purple-950/30">
                    <span className="text-xs font-medium text-purple-700 dark:text-purple-400">💪 Esfuerzo</span>
                    <p className="text-xs mt-1">{result.analysis.effort_sacrifice}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quotation Sections */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h2 className="text-2xl font-bold text-foreground mb-2">{result.quotation.title}</h2>
              <p className="text-muted-foreground text-sm mb-4">{result.professional_summary}</p>
              
              <div className="space-y-4">
                {result.quotation.sections.map((section, i) => (
                  <div key={i} className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-semibold text-lg mb-1">
                      {section.icon} {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{section.description}</p>
                    <ul className="space-y-1">
                      {section.features.map((feature, j) => (
                        <li key={j} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-4 border-2 border-primary bg-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Inversión Total</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(result.quotation.pricing.base_price)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{result.quotation.pricing.currency}</p>
                </div>
                <Badge variant="outline" className="h-fit text-lg px-4 py-2">
                  Profesional
                </Badge>
              </div>
              {result.quotation.pricing.terms && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">TÉRMINOS:</p>
                  <p className="text-sm">{result.quotation.pricing.terms}</p>
                </div>
              )}
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cerrar
              </Button>
              <Button onClick={exportPDF} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
