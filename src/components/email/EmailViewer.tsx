import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Reply, ReplyAll, Forward, Trash2, Star, MessageSquare } from "lucide-react";

interface Email {
  id: string;
  from_email: string;
  to_email: string[];
  cc_email: string[] | null;
  subject: string;
  body_html: string | null;
  body_text: string | null;
  is_read: boolean;
  is_starred: boolean;
  has_attachments: boolean;
  folder: string;
  created_at: string;
  sent_at: string | null;
  received_at: string | null;
  thread_id: string | null;
  in_reply_to: string | null;
}

interface EmailViewerProps {
  email: Email | null;
  onBack: () => void;
  onReply: (email: Email) => void;
}

export const EmailViewer = ({ email, onBack, onReply }: EmailViewerProps) => {
  const [threadEmails, setThreadEmails] = useState<Email[]>([]);
  const [showThread, setShowThread] = useState(false);

  useEffect(() => {
    if (email?.thread_id) {
      loadThreadEmails(email.thread_id);
    } else {
      setThreadEmails([]);
    }
  }, [email?.id]);

  const loadThreadEmails = async (threadId: string) => {
    const { data, error } = await supabase
      .from("emails")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setThreadEmails(data);
    }
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Selecciona un correo para verlo
      </div>
    );
  }

  const hasThread = threadEmails.length > 1;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        {hasThread && (
          <Button 
            variant={showThread ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => setShowThread(!showThread)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {showThread ? "Ocultar conversación" : `Ver conversación (${threadEmails.length})`}
          </Button>
        )}
        <Separator orientation="vertical" className="h-6" />
        <Button variant="ghost" size="sm" onClick={() => onReply(email)}>
          <Reply className="h-4 w-4 mr-2" />
          Responder
        </Button>
        <Button variant="ghost" size="sm">
          <ReplyAll className="h-4 w-4 mr-2" />
          Responder a todos
        </Button>
        <Button variant="ghost" size="sm">
          <Forward className="h-4 w-4 mr-2" />
          Reenviar
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="ghost" size="sm">
          <Star className={`h-4 w-4 ${email.is_starred ? "fill-yellow-500 text-yellow-500" : ""}`} />
        </Button>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {showThread && hasThread ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">
                Conversación: {email.subject}
              </h2>
              {threadEmails.map((threadEmail) => (
                <Card key={threadEmail.id} className={threadEmail.id === email.id ? "border-primary" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{threadEmail.from_email}</span>
                          {threadEmail.id === email.id && (
                            <Badge>Actual</Badge>
                          )}
                          {!threadEmail.is_read && (
                            <Badge variant="secondary" className="text-xs">
                              Nuevo
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Para: {threadEmail.to_email.join(", ")}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(
                          new Date(threadEmail.sent_at || threadEmail.received_at || threadEmail.created_at),
                          "PPP 'a las' p",
                          { locale: es }
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none text-sm">
                      {threadEmail.body_html ? (
                        <div dangerouslySetInnerHTML={{ __html: threadEmail.body_html }} />
                      ) : (
                        <p className="whitespace-pre-wrap">{threadEmail.body_text}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">{email.subject}</h1>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{email.from_email}</span>
                      {!email.is_read && (
                        <Badge variant="secondary" className="text-xs">
                          Nuevo
                        </Badge>
                      )}
                      {email.in_reply_to && (
                        <Badge variant="outline" className="text-xs">
                          Respuesta
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Para: {email.to_email.join(", ")}
                    </div>
                    {email.cc_email && email.cc_email.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Cc: {email.cc_email.join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(
                      new Date(email.sent_at || email.received_at || email.created_at),
                      "PPP 'a las' p",
                      { locale: es }
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="prose max-w-none">
                {email.body_html ? (
                  <div dangerouslySetInnerHTML={{ __html: email.body_html }} />
                ) : (
                  <p className="whitespace-pre-wrap">{email.body_text}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
