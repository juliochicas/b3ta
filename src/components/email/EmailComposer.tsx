import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, X } from "lucide-react";
import { EmailAIAssistant } from "./EmailAIAssistant";

interface EmailComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  defaultTo?: string;
  defaultSubject?: string;
  leadId?: string;
  customerId?: string;
  accountId?: string;
}

export const EmailComposer = ({
  open,
  onOpenChange,
  onSuccess,
  defaultTo = "",
  defaultSubject = "",
  leadId,
  customerId,
  accountId,
}: EmailComposerProps) => {
  const [to, setTo] = useState(defaultTo);
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const handleSend = async () => {
    if (!to || !subject || !body) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    if (!accountId) {
      toast.error("Por favor selecciona una cuenta de correo");
      return;
    }

    setIsSending(true);

    try {
      const { error } = await supabase.functions.invoke("send-email", {
        body: {
          to: to.split(",").map((email) => email.trim()),
          cc: cc ? cc.split(",").map((email) => email.trim()) : undefined,
          bcc: bcc ? bcc.split(",").map((email) => email.trim()) : undefined,
          subject,
          body,
          leadId,
          customerId,
          accountId,
        },
      });

      if (error) throw error;

      toast.success("Correo enviado exitosamente");
      onSuccess?.();
      onOpenChange(false);
      
      // Reset form
      setTo(defaultTo);
      setCc("");
      setBcc("");
      setSubject(defaultSubject);
      setBody("");
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast.error(error.message || "Error al enviar el correo");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Correo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Para *</Label>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="destinatario@ejemplo.com"
              type="email"
            />
            <div className="flex gap-2 mt-2">
              {!showCc && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCc(true)}
                >
                  Cc
                </Button>
              )}
              {!showBcc && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBcc(true)}
                >
                  Bcc
                </Button>
              )}
            </div>
          </div>

          {showCc && (
            <div>
              <div className="flex items-center justify-between">
                <Label>Cc</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCc(false);
                    setCc("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="copia@ejemplo.com"
                type="email"
              />
            </div>
          )}

          {showBcc && (
            <div>
              <div className="flex items-center justify-between">
                <Label>Bcc</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowBcc(false);
                    setBcc("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder="copia-oculta@ejemplo.com"
                type="email"
              />
            </div>
          )}

          <div>
            <Label>Asunto *</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Asunto del correo"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Mensaje *</Label>
              <EmailAIAssistant 
                currentText={body}
                onApply={(text) => setBody(text)}
              />
            </div>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              rows={12}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSending}
            >
              Cancelar
            </Button>
            <Button onClick={handleSend} disabled={isSending}>
              <Send className="mr-2 h-4 w-4" />
              {isSending ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
