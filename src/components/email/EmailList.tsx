import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Mail, MailOpen, Star, Paperclip } from "lucide-react";
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
      let query = supabase
        .from("emails")
        .select("*")
        .eq("folder", folder);

      if (accountId) {
        query = query.eq("account_id", accountId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data as Email[];
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

  if (!emails || emails.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hay correos en esta carpeta
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {emails.map((email) => (
        <Card
          key={email.id}
          className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
            selectedEmail?.id === email.id ? "bg-accent" : ""
          } ${!email.is_read ? "border-l-4 border-l-primary" : ""}`}
          onClick={() => onEmailSelect(email)}
        >
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRead(email.id, email.is_read);
                }}
              >
                {email.is_read ? (
                  <MailOpen className="h-4 w-4" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(email.id, email.is_starred);
                }}
              >
                <Star
                  className={`h-4 w-4 ${
                    email.is_starred ? "fill-warning text-warning" : ""
                  }`}
                />
              </Button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-medium truncate ${!email.is_read ? "font-bold" : ""}`}>
                  {folder === "sent" ? email.to_email[0] : email.from_email}
                </span>
                {email.has_attachments && (
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <p className={`text-sm truncate mb-1 ${!email.is_read ? "font-semibold" : ""}`}>
                {email.subject}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {email.body_text}
              </p>
            </div>

            <div className="text-xs text-muted-foreground whitespace-nowrap">
              {format(
                new Date(email.sent_at || email.received_at || email.created_at),
                "d MMM",
                { locale: es }
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
