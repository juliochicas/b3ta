import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, CheckCheck, FileEdit, ListOrdered, Briefcase, Expand } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  text: string;
  section: string;
  onTextImproved: (newText: string) => void;
}

type Action = 'correct' | 'improve' | 'structure' | 'professional' | 'expand';

export const AITextHelper = ({ text, section, onTextImproved }: Props) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const improveText = async (action: Action) => {
    if (!text.trim()) {
      toast({
        title: "Campo vacío",
        description: "Escribe algo de texto primero para que la IA pueda ayudarte",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('improve-report-text', {
        body: { text, action, section }
      });

      if (error) {
        if (error.message.includes("429")) {
          toast({
            title: "Límite excedido",
            description: "Has hecho muchas solicitudes. Espera un momento e intenta de nuevo.",
            variant: "destructive",
          });
        } else if (error.message.includes("402")) {
          toast({
            title: "Créditos agotados",
            description: "Recarga tus créditos de Lovable AI en la configuración.",
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
          title: "✨ Texto mejorado",
          description: getSuccessMessage(action),
        });
      }
    } catch (error: any) {
      console.error('Error mejorando texto:', error);
      toast({
        title: "Error",
        description: "No se pudo mejorar el texto. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSuccessMessage = (action: Action): string => {
    const messages = {
      correct: "Ortografía y gramática corregidas",
      improve: "Redacción mejorada",
      structure: "Texto estructurado y organizado",
      professional: "Texto profesionalizado",
      expand: "Texto expandido con más detalles"
    };
    return messages[action];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading}
          className="gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Mejorando...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Mejorar con IA
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => improveText('correct')}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Corregir ortografía
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => improveText('improve')}>
          <FileEdit className="mr-2 h-4 w-4" />
          Mejorar redacción
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => improveText('structure')}>
          <ListOrdered className="mr-2 h-4 w-4" />
          Dar estructura
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => improveText('professional')}>
          <Briefcase className="mr-2 h-4 w-4" />
          Hacer más profesional
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => improveText('expand')}>
          <Expand className="mr-2 h-4 w-4" />
          Expandir contenido
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
