import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sparkles, CheckCircle2, Type, Smile, Zap, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  text: string;
  section: string;
  onTextImproved: (newText: string) => void;
}

type Action = 'correct' | 'improve' | 'professional' | 'friendly' | 'expand' | 'summarize';

export const AITextHelper = ({ text, section, onTextImproved }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleImprove = async (action: Action, actionLabel: string) => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Escriba texto antes de usar IA",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setOpen(false);

    try {
      const { data, error } = await supabase.functions.invoke('improve-report-text', {
        body: { text, action, section }
      });

      if (error) {
        if (error.message.includes("429")) {
          toast({
            title: "Límite alcanzado",
            description: "Has alcanzado el límite de solicitudes. Intenta de nuevo en unos minutos.",
            variant: "destructive",
          });
        } else if (error.message.includes("402")) {
          toast({
            title: "Créditos agotados",
            description: "No tienes suficientes créditos. Recarga tu saldo en configuración.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      if (data?.improvedText) {
        onTextImproved(data.improvedText);
        toast({
          title: "Texto mejorado",
          description: `${actionLabel} aplicado exitosamente`,
        });
      }
    } catch (error: any) {
      console.error('Error improving report text:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo procesar el texto",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const actions = [
    {
      action: "correct" as Action,
      label: "Corregir ortografía",
      icon: CheckCircle2,
      description: "Corrige errores ortográficos y gramaticales"
    },
    {
      action: "improve" as Action,
      label: "Mejorar redacción",
      icon: Sparkles,
      description: "Mejora claridad y profesionalismo"
    },
    {
      action: "professional" as Action,
      label: "Tono profesional",
      icon: Type,
      description: "Convierte a tono más formal y técnico"
    },
    {
      action: "friendly" as Action,
      label: "Tono amigable",
      icon: Smile,
      description: "Hace el texto más cercano y accesible"
    },
    {
      action: "expand" as Action,
      label: "Expandir",
      icon: Zap,
      description: "Añade más detalles y explicaciones"
    },
    {
      action: "summarize" as Action,
      label: "Resumir",
      icon: FileText,
      description: "Condensa manteniendo puntos clave"
    }
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isProcessing || !text.trim()}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isProcessing ? "Procesando..." : "IA"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm mb-3">Mejorar con IA</h4>
          <div className="space-y-1">
            {actions.map(({ action, label, icon: Icon, description }) => (
              <Button
                key={action}
                variant="ghost"
                className="w-full justify-start h-auto py-3"
                onClick={() => handleImprove(action, label)}
                disabled={isProcessing}
              >
                <div className="flex items-start gap-3 text-left">
                  <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{label}</div>
                    <div className="text-xs text-muted-foreground">{description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
