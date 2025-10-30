import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Reply, ReplyAll, Forward, Trash2, Star, MessageSquare, AlertOctagon, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  onEmailChange?: () => void;
}

export const EmailViewer = ({ email, onBack, onReply, onEmailChange }: EmailViewerProps) => {
  const [threadEmails, setThreadEmails] = useState<Email[]>([]);
  const [showThread, setShowThread] = useState(true); // Activado por defecto
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (email?.thread_id) {
      loadThreadEmails(email.thread_id);
      setShowThread(true); // Mostrar conversación automáticamente
    } else {
      setThreadEmails([]);
      setShowThread(false);
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

  const handleMoveToTrash = async () => {
    if (!email) return;
    
    try {
      const { error } = await supabase
        .from("emails")
        .update({ folder: "trash" })
        .eq("id", email.id);

      if (error) throw error;

      toast.success("Correo movido a papelera");
      onEmailChange?.();
      onBack();
    } catch (error: any) {
      console.error("Error moving to trash:", error);
      toast.error("Error al mover a papelera");
    }
  };

  const handleMarkAsSpam = async () => {
    if (!email) return;
    
    try {
      const { error } = await supabase
        .from("emails")
        .update({ folder: "spam" })
        .eq("id", email.id);

      if (error) throw error;

      toast.success("Correo marcado como spam");
      onEmailChange?.();
      onBack();
    } catch (error: any) {
      console.error("Error marking as spam:", error);
      toast.error("Error al marcar como spam");
    }
  };

  const handlePermanentDelete = async () => {
    if (!email) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("emails")
        .delete()
        .eq("id", email.id);

      if (error) throw error;

      toast.success("Correo eliminado permanentemente");
      onEmailChange?.();
      setShowDeleteDialog(false);
      onBack();
    } catch (error: any) {
      console.error("Error deleting permanently:", error);
      toast.error("Error al eliminar. Es posible que no tengas permisos.");
    } finally {
      setIsDeleting(false);
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
        {email.folder !== "spam" && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleMarkAsSpam}
            title="Marcar como spam"
          >
            <AlertOctagon className="h-4 w-4" />
          </Button>
        )}
        {email.folder !== "trash" && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleMoveToTrash}
            title="Mover a papelera"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        {email.folder === "trash" && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            title="Eliminar permanentemente"
            className="text-destructive hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {showThread && hasThread ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  Conversación: {email.subject}
                </h2>
                <Badge variant="outline">{threadEmails.length} mensajes</Badge>
              </div>
              
              {threadEmails.map((threadEmail, index) => {
                const isLast = index === threadEmails.length - 1;
                const isUnread = !threadEmail.is_read;
                const isSent = threadEmail.folder === "sent";
                
                return (
                  <div key={threadEmail.id} className="relative">
                    <Card 
                      className={`
                        ${threadEmail.id === email.id ? "border-primary shadow-md" : ""}
                        ${isUnread ? "bg-accent/10 border-accent" : ""}
                        ${isLast ? "ring-2 ring-primary/20" : ""}
                      `}
                    >
                      <CardHeader className="pb-3 bg-muted/30">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                {isSent ? (
                                  <Badge variant="secondary" className="text-xs">
                                    Enviado por ti
                                  </Badge>
                                ) : (
                                  <Badge variant="default" className="text-xs">
                                    Recibido
                                  </Badge>
                                )}
                                {isUnread && (
                                  <Badge className="text-xs bg-blue-500">
                                    NUEVO
                                  </Badge>
                                )}
                                {isLast && (
                                  <Badge variant="outline" className="text-xs">
                                    Último mensaje
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-semibold text-base">{threadEmail.from_email}</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              <span className="font-medium">Para:</span> {threadEmail.to_email.join(", ")}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {format(
                                new Date(threadEmail.sent_at || threadEmail.received_at || threadEmail.created_at),
                                "dd MMM yyyy",
                                { locale: es }
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(
                                new Date(threadEmail.sent_at || threadEmail.received_at || threadEmail.created_at),
                                "HH:mm",
                                { locale: es }
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <Separator />
                      <CardContent className="pt-4">
                        <div className="prose max-w-none text-sm">
                          {threadEmail.body_html ? (
                            <div dangerouslySetInnerHTML={{ __html: threadEmail.body_html }} />
                          ) : (
                            <p className="whitespace-pre-wrap">{threadEmail.body_text}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Línea conectora visual entre mensajes */}
                    {index < threadEmails.length - 1 && (
                      <div className="flex justify-center py-2">
                        <div className="w-px h-4 bg-border"></div>
                      </div>
                    )}
                  </div>
                );
              })}
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

      {/* Dialog de confirmación de eliminación permanente */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar permanentemente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El correo será eliminado permanentemente de la base de datos.
              Solo los administradores pueden realizar esta acción.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermanentDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar Permanentemente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
