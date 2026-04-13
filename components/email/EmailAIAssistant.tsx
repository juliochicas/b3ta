"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Check, X, Loader2 } from "lucide-react";

interface EmailAIAssistantProps {
  currentText: string;
  onApply: (text: string) => void;
}

const AI_ACTIONS = [
  { id: "correct", label: "Corregir ortografía y gramática", icon: "✓" },
  { id: "improve", label: "Mejorar redacción", icon: "✨" },
  { id: "formal", label: "Hacer más formal", icon: "👔" },
  { id: "friendly", label: "Hacer más amigable", icon: "😊" },
  { id: "expand", label: "Expandir texto", icon: "📝" },
  { id: "summarize", label: "Resumir", icon: "📋" },
  { id: "translate", label: "Traducir", icon: "🌍" },
  { id: "generate", label: "Generar desde instrucciones", icon: "🤖" },
];

export const EmailAIAssistant = ({
  currentText,
  onApply,
}: EmailAIAssistantProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [improvedText, setImprovedText] = useState("");
  const [showTranslateDialog, setShowTranslateDialog] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("inglés");
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [generateInstructions, setGenerateInstructions] = useState("");

  const handleAIAction = async (action: string, language?: string) => {
    if (!currentText && action !== "generate") {
      toast.error("Escribe algo primero");
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "improve-email-text",
        {
          body: {
            text: action === "generate" ? generateInstructions : currentText,
            action,
            language,
          },
        }
      );

      if (error) throw error;

      setImprovedText(data.improvedText);
      setShowPreview(true);
      toast.success("Texto procesado con IA");
    } catch (error: any) {
      console.error("Error processing text:", error);
      toast.error(error.message || "Error al procesar el texto");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    onApply(improvedText);
    setShowPreview(false);
    setImprovedText("");
    toast.success("Texto aplicado");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Asistente IA
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {AI_ACTIONS.map((action, index) => (
            <div key={action.id}>
              <DropdownMenuItem
                onClick={() => {
                  if (action.id === "translate") {
                    setShowTranslateDialog(true);
                  } else if (action.id === "generate") {
                    setShowGenerateDialog(true);
                  } else {
                    handleAIAction(action.id);
                  }
                }}
              >
                <span className="mr-2">{action.icon}</span>
                {action.label}
              </DropdownMenuItem>
              {(index === 1 || index === 3 || index === 5) && (
                <DropdownMenuSeparator />
              )}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Vista previa del texto mejorado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Texto original:</Label>
              <div className="mt-2 p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                {currentText}
              </div>
            </div>
            <div>
              <Label>Texto mejorado por IA:</Label>
              <Textarea
                value={improvedText}
                onChange={(e) => setImprovedText(e.target.value)}
                rows={8}
                className="mt-2"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button onClick={handleApply}>
                <Check className="mr-2 h-4 w-4" />
                Aplicar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Translate Dialog */}
      <Dialog open={showTranslateDialog} onOpenChange={setShowTranslateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Traducir texto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Idioma destino</Label>
              <Input
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                placeholder="ej: inglés, francés, alemán..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowTranslateDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  handleAIAction("translate", targetLanguage);
                  setShowTranslateDialog(false);
                }}
              >
                Traducir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generar correo con IA</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Instrucciones para la IA</Label>
              <Textarea
                value={generateInstructions}
                onChange={(e) => setGenerateInstructions(e.target.value)}
                placeholder="Ej: Escribe un correo de seguimiento para un cliente interesado en nuestros servicios de consultoría..."
                rows={5}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowGenerateDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  handleAIAction("generate");
                  setShowGenerateDialog(false);
                  setGenerateInstructions("");
                }}
                disabled={!generateInstructions}
              >
                Generar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
