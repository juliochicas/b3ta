"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Reply, ReplyAll, Forward, Trash2, Star, MessageSquare, AlertOctagon, Trash, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      // Llamar a la función de edge para eliminar del servidor IMAP y DB
      const { error } = await supabase.functions.invoke("delete-email-imap", {
        body: { emailId: email.id }
      });

      if (error) throw error;

      toast.success("Correo eliminado permanentemente del servidor y base de datos");
      onEmailChange?.();
      setShowDeleteDialog(false);
      onBack();
    } catch (error: any) {
      console.error("Error deleting permanently:", error);
      toast.error("Error al eliminar. " + (error.message || "Intenta de nuevo."));
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
      {/* Header con acciones - Responsivo */}
      <div className="flex items-center gap-2 p-3 md:p-4 border-b">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Button>
        
        <div className="flex-1" />
        
        {/* Botón de conversación - Visible en desktop */}
        {hasThread && (
          <Button 
            variant={showThread ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => setShowThread(!showThread)}
            className="hidden md:flex"
          >
            <MessageSquare className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">
              {showThread ? "Ocultar conversación" : `Ver conversación (${threadEmails.length})`}
            </span>
          </Button>
        )}
        
        {/* Acciones principales - Siempre visibles */}
        <Button variant="ghost" size="sm" onClick={() => onReply(email)} className="hidden sm:flex">
          <Reply className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Responder</span>
        </Button>
        
        {/* Menú desplegable para más acciones */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Más acciones</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* Acción de responder en móvil */}
            <DropdownMenuItem onClick={() => onReply(email)} className="sm:hidden">
              <Reply className="h-4 w-4 mr-2" />
              Responder
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <ReplyAll className="h-4 w-4 mr-2" />
              Responder a todos
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <Forward className="h-4 w-4 mr-2" />
              Reenviar
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem>
              <Star className={`h-4 w-4 mr-2 ${email.is_starred ? "fill-warning text-warning" : ""}`} />
              {email.is_starred ? "Quitar favorito" : "Marcar favorito"}
            </DropdownMenuItem>
            
            {/* Conversación en móvil */}
            {hasThread && (
              <DropdownMenuItem onClick={() => setShowThread(!showThread)} className="md:hidden">
                <MessageSquare className="h-4 w-4 mr-2" />
                {showThread ? "Ocultar conversación" : `Ver conversación (${threadEmails.length})`}
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            {email.folder !== "spam" && (
              <DropdownMenuItem onClick={handleMarkAsSpam}>
                <AlertOctagon className="h-4 w-4 mr-2" />
                Marcar como spam
              </DropdownMenuItem>
            )}
            
            {email.folder !== "trash" && (
              <DropdownMenuItem onClick={handleMoveToTrash}>
                <Trash2 className="h-4 w-4 mr-2" />
                Mover a papelera
              </DropdownMenuItem>
            )}
            
            {email.folder === "trash" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Eliminar permanentemente
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
                                  <Badge className="text-xs bg-status-new">
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
                            <div 
                              dangerouslySetInnerHTML={{ 
                                __html: DOMPurify.sanitize(threadEmail.body_html, {
                                  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'img', 'ul', 'ol', 'li', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'tr', 'td', 'th', 'thead', 'tbody'],
                                  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'style', 'class'],
                                  ALLOW_DATA_ATTR: false,
                                  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
                                  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
                                })
                              }} 
                            />
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
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(email.body_html, {
                        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'img', 'ul', 'ol', 'li', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'tr', 'td', 'th', 'thead', 'tbody'],
                        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'style', 'class'],
                        ALLOW_DATA_ATTR: false,
                        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
                        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
                      })
                    }} 
                  />
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
