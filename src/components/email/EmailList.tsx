import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Mail, MailOpen, Star, Paperclip, Inbox } from "lucide-react";
import { toast } from "sonner";

interface Email {
  id: string;
  from_email: string;
  to_email: string[];
  subject: string;
  body_text: string;
  is_read: boolean;
  is_starred: boolean;
  has_attachments: boolean;
  folder: string;
  created_at: string;
  sent_at: string | null;
  received_at: string | null;
}

interface EmailListProps {
  folder: string;
  onEmailSelect: (email: Email) => void;
  selectedEmail: Email | null;
  accountId?: string;
}

export const EmailList = ({ folder, onEmailSelect, selectedEmail, accountId }: EmailListProps) => {
  const { data: emails, refetch } = useQuery({
    queryKey: ["emails", folder, accountId],
    queryFn: async () => {
      // Consulta principal por cuenta seleccionada
      let primaryQuery = supabase
        .from("emails")
        .select("*")
        .eq("folder", folder)
        .eq("account_id", accountId as string);

      const { data: mainData, error: mainError } = await primaryQuery.order("created_at", { ascending: false });
      if (mainError) throw mainError;

      // Fallback: incluir correos antiguos sin account_id pero dirigidos a la cuenta seleccionada
      // (algunas inserciones antiguas pudieron no guardar account_id)
      const { data: account } = await supabase
        .from("email_accounts")
        .select("email")
        .eq("id", accountId as string)
        .single();

      if (!account?.email) {
        return (mainData || []) as Email[];
      }

      const { data: legacyData, error: legacyError } = await supabase
        .from("emails")
        .select("*")
        .eq("folder", folder)
        .is("account_id", null)
        .contains("to_email", [account.email])
        .order("created_at", { ascending: false });

      if (legacyError) {
        // Si el fallback falla, devolver lo principal para no romper la UI
        return (mainData || []) as Email[];
      }

      const merged = [...(mainData || [])];
      for (const item of legacyData || []) {
        if (!merged.find((e) => e.id === item.id)) merged.push(item);
      }

      // Orden descendente por fecha de creación/recepción
      merged.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return merged as Email[];
    },
  });

  const toggleRead = async (emailId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("emails")
      .update({ is_read: !currentStatus })
      .eq("id", emailId);

    if (error) {
      toast.error("Error al actualizar el correo");
      return;
    }

    refetch();
  };

  const toggleStar = async (emailId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("emails")
      .update({ is_starred: !currentStatus })
      .eq("id", emailId);

    if (error) {
      toast.error("Error al actualizar el correo");
      return;
    }

    refetch();
  };

  // Si no hay cuenta seleccionada
  if (!accountId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <Mail className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <p className="text-sm text-muted-foreground">
          Selecciona una cuenta de correo para ver los mensajes
        </p>
      </div>
    );
  }

  if (!emails || emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <Inbox className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <p className="text-sm font-medium text-foreground mb-1">
          No hay correos en esta carpeta
        </p>
        <p className="text-xs text-muted-foreground">
          Presiona "Sincronizar" para obtener nuevos mensajes
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {emails.map((email) => (
        <Card
          key={email.id}
          className={`p-3.5 cursor-pointer transition-all border-l-2 ${
            selectedEmail?.id === email.id
              ? "bg-accent/30 border-l-primary shadow-sm"
              : email.is_read
              ? "bg-background hover:bg-accent/10 border-l-transparent"
              : "bg-accent/5 hover:bg-accent/15 border-l-primary"
          }`}
          onClick={() => onEmailSelect(email)}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <p className={`text-sm truncate ${!email.is_read ? 'font-semibold text-foreground' : 'font-normal text-foreground/90'}`}>
                    {folder === "sent" 
                      ? (email.to_email?.[0] || "Sin destinatario")
                      : (email.from_email || "Sin remitente")}
                  </p>
                  {email.has_attachments && (
                    <Paperclip className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                  {formatDistanceToNow(new Date(email.received_at || email.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </div>
              
              <p className={`text-sm truncate ${!email.is_read ? 'font-semibold text-foreground' : 'font-normal text-foreground/80'}`}>
                {email.subject || "(Sin asunto)"}
              </p>
              
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {email.body_text?.substring(0, 120) || "Sin contenido"}
              </p>
            </div>
            
            <div className="flex flex-col gap-1 flex-shrink-0 pt-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-accent/50"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRead(email.id, email.is_read);
                }}
              >
                {email.is_read ? (
                  <MailOpen className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <Mail className="h-3.5 w-3.5 text-primary" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-accent/50"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(email.id, email.is_starred);
                }}
              >
                {email.is_starred ? (
                  <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                ) : (
                  <Star className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
