import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2, Target, Gift, Shield, Clock, Zap, Eye, CheckCircle2 } from "lucide-react";

interface GrandSlamResult {
  analysis: {
    dream_outcome: string;
    pain_points: string[];
    perceived_probability: string;
    time_delay: string;
    effort_sacrifice: string;
  };
  items: Array<{
    item_name: string;
    description: string;
    quantity: number;
    unit_price: number;
    suggested_price: number;
  }>;
  bonuses: Array<{
    name: string;
    description: string;
    perceived_value: number;
  }>;
  guarantee: {
    type: string;
    description: string;
  };
  scarcity: {
    type: string;
    description: string;
  };
  urgency: {
    reason: string;
    deadline: string;
  };
  offer_name: string;
  grand_slam_section_html: string;
  terms_suggestion: string;
  notes: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (result: GrandSlamResult) => void;
  htmlContent?: string | null;
  customerName?: string;
  customerCompany?: string;
}

export function GrandSlamGenerator({ open, onClose, onApply, htmlContent, customerName, customerCompany }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GrandSlamResult | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

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
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data);
      toast.success("¡Cotización Grand Slam generada!");
    } catch (err: any) {
      toast.error(err.message || "Error generando cotización");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Generador de Cotización Grand Slam
          </DialogTitle>
          <DialogDescription>
            Usa los frameworks de Alex Hormozi para crear una oferta irresistible basada en el demo del cliente.
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
              <Label>Instrucciones adicionales (opcional)</Label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ej: Enfócate en automatización de procesos. El cliente tiene 50 empleados y factura $2M anuales. Quiere reducir costos operativos..."
                rows={3}
              />
            </div>

            <Card className="p-4 border-primary/20 bg-primary/5">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                La IA aplicará estos frameworks de Hormozi:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Ecuación de Valor
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Oferta Grand Slam
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Escasez y Urgencia
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Bonos y Garantías
                </div>
              </div>
            </Card>

            <Button onClick={generate} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generando Oferta Grand Slam...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generar Cotización Grand Slam
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Analysis */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Análisis de Valor (Ecuación Hormozi)
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-primary">🎯 Resultado Soñado:</span>
                  <p className="ml-6 text-muted-foreground">{result.analysis.dream_outcome}</p>
                </div>
                <div>
                  <span className="font-medium text-primary">🔥 Puntos de Dolor:</span>
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

            {/* Offer Name */}
            <Card className="p-4 bg-primary/5 border-primary/20 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Nombre de la Oferta</p>
              <h2 className="text-xl font-bold text-primary mt-1">{result.offer_name}</h2>
            </Card>

            {/* Items */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">📦 Items de la Cotización</h3>
              <div className="space-y-2">
                {result.items.map((item, i) => (
                  <div key={i} className="flex items-start justify-between p-2 rounded bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.item_name}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="font-semibold">${item.suggested_price || item.unit_price}</p>
                      <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Bonuses */}
            {result.bonuses?.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-amber-500" />
                  Bonos Incluidos
                </h3>
                <div className="space-y-2">
                  {result.bonuses.map((bonus, i) => (
                    <div key={i} className="flex items-start justify-between p-2 rounded bg-amber-50 dark:bg-amber-950/20">
                      <div>
                        <p className="font-medium text-sm">🎁 {bonus.name}</p>
                        <p className="text-xs text-muted-foreground">{bonus.description}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 ml-2">
                        Valor: ${bonus.perceived_value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Guarantee + Scarcity + Urgency */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3">
                <h4 className="text-xs font-semibold flex items-center gap-1 mb-2">
                  <Shield className="h-3 w-3 text-green-600" />
                  Garantía
                </h4>
                <p className="text-xs font-medium">{result.guarantee?.type}</p>
                <p className="text-xs text-muted-foreground mt-1">{result.guarantee?.description}</p>
              </Card>
              <Card className="p-3">
                <h4 className="text-xs font-semibold flex items-center gap-1 mb-2">
                  <Zap className="h-3 w-3 text-red-600" />
                  Escasez
                </h4>
                <p className="text-xs font-medium">{result.scarcity?.type}</p>
                <p className="text-xs text-muted-foreground mt-1">{result.scarcity?.description}</p>
              </Card>
              <Card className="p-3">
                <h4 className="text-xs font-semibold flex items-center gap-1 mb-2">
                  <Clock className="h-3 w-3 text-orange-600" />
                  Urgencia
                </h4>
                <p className="text-xs font-medium">{result.urgency?.reason}</p>
                <p className="text-xs text-muted-foreground mt-1">{result.urgency?.deadline}</p>
              </Card>
            </div>

            {/* Preview Grand Slam HTML */}
            {result.grand_slam_section_html && (
              <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                {showPreview ? "Ocultar" : "Ver"} Sección Visual Grand Slam
              </Button>
            )}
            {showPreview && result.grand_slam_section_html && (
              <Card className="p-0 overflow-hidden">
                <iframe
                  srcDoc={result.grand_slam_section_html}
                  title="Grand Slam Preview"
                  className="w-full h-[500px] border-0"
                  sandbox="allow-scripts"
                />
              </Card>
            )}

            <Separator />

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => { setResult(null); }}>
                🔄 Regenerar
              </Button>
              <Button onClick={() => onApply(result)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Aplicar a Cotización
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
