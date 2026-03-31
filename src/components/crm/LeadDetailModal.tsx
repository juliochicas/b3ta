import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, Phone, Building2, MessageSquare, Calendar, 
  Star, Sparkles, Save, Activity, Trash2, FileText 
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CreateReportModal } from "@/components/reports/CreateReportModal";
import { ScheduleMeetingModal } from "@/components/meetings/ScheduleMeetingModal";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  service_interest: string | null;
  message: string | null;
  status: string;
  priority: string;
  ai_score: number | null;
  ai_summary: string | null;
  created_at: string;
  last_contact: string | null;
  notes: string | null;
  assigned_to: string | null;
}

interface LeadActivity {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
}

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: () => void;
}

export const LeadDetailModal = ({ lead, onClose, onUpdate }: LeadDetailModalProps) => {
  const [status, setStatus] = useState(lead.status);
  const [priority, setPriority] = useState(lead.priority);
  const [notes, setNotes] = useState(lead.notes || "");
  const [assignedTo, setAssignedTo] = useState(lead.assigned_to || "");
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [teamMembers, setTeamMembers] = useState<{id: string, full_name: string | null, email: string | null}[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [showScheduleMeeting, setShowScheduleMeeting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadActivities();
    loadTeamMembers();
  }, [lead.id]);

  const loadTeamMembers = async () => {
    const { data, error } = await supabase.from('profiles').select('id, full_name, email');
    if (data && !error) {
      setTeamMembers(data);
    }
  };

  const loadActivities = async () => {
    const { data } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: false })
      .limit(10);

    setActivities(data || []);
  };

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY no está configurada");
      }

      const aiPrompt = `Eres un experto en calificación de leads B2B. Analiza este lead y dame:
1. Score de calidad (0-100)
2. Prioridad sugerida (high/medium/low)
3. Resumen breve (2-3 líneas)
4. Próximos pasos recomendados

Lead:
- Nombre: ${lead.name}
- Email: ${lead.email}
- Empresa: ${lead.company || 'No especificada'}
- Teléfono: ${lead.phone || 'No especificado'}
- Servicio de interés: ${lead.service_interest || 'No especificado'}
- Mensaje: ${lead.message || 'Sin mensaje'}

Responde ESTRICTAMENTE en este formato JSON (sin markdown, solo el JSON raw):
{"score": 85, "priority": "high", "summary": "Este lead busca...", "next_steps": "Contactar..."}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: aiPrompt }] }],
            generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini error ${response.status}: ${errText}`);
      }

      const aiData = await response.json();
      let aiContent = aiData.candidates[0].content.parts[0].text;
      aiContent = aiContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

      let analysisData: any;
      try {
        analysisData = JSON.parse(aiContent);
      } catch {
        analysisData = { score: 50, priority: "medium", summary: aiContent.substring(0, 200), next_steps: "Calificación manual requerida" };
      }

      // Guardar en Supabase
      const { error: updateError } = await supabase
        .from("leads_b3ta")
        .update({
          ai_score: analysisData.score,
          priority: analysisData.priority,
          ai_summary: JSON.stringify(analysisData),
        })
        .eq("id", lead.id);

      if (updateError) throw updateError;

      // Registrar actividad
      await supabase.from("lead_activities").insert({
        lead_id: lead.id,
        activity_type: "ai_analysis",
        description: `IA analizó el lead. Score: ${analysisData.score}/100, Prioridad: ${analysisData.priority}`,
      });

      toast({
        title: "Análisis completado ✨",
        description: `Score: ${analysisData.score}/100 · Prioridad: ${analysisData.priority}`,
      });

      onUpdate();
      onClose();
    } catch (error: any) {
      console.error("AI Analysis Error:", error);
      toast({
        title: "Error en análisis IA",
        description: error.message || "No se pudo analizar el lead",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };


  const saveChanges = async () => {
    setIsSaving(true);
    try {
      const updates: any = {
        status,
        priority,
        notes,
        assigned_to: assignedTo || null
      };

      // Si se contactó, actualizar last_contact
      if (status === 'contacted' && !lead.last_contact) {
        updates.last_contact = new Date().toISOString();
      }

      const { error } = await supabase
        .from('leads_b3ta')
        .update(updates)
        .eq('id', lead.id);

      if (error) throw error;

      // Registrar actividad
      await supabase
        .from('lead_activities')
        .insert({
          lead_id: lead.id,
          activity_type: 'update',
          description: `Estado actualizado a: ${status}, Prioridad: ${priority}`
        });

      toast({
        title: "Cambios guardados",
        description: "El lead se actualizó correctamente",
      });

      onUpdate();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteLead = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('leads_b3ta')
        .delete()
        .eq('id', lead.id);

      if (error) throw error;

      toast({
        title: "Lead eliminado",
        description: "El lead se eliminó correctamente",
      });

      onUpdate();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el lead",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:rounded-[32px] p-0 md:p-8 border-none bg-background/95 backdrop-blur-2xl shadow-2xl">
        <DialogHeader className="px-6 pt-6 md:p-0">
          <DialogTitle className="text-3xl font-semibold tracking-tight">{lead.name}</DialogTitle>
        </DialogHeader>
        <span className="sr-only">Detalles del lead y opciones de gestión</span>

        <div className="grid md:grid-cols-2 gap-6 p-6 md:p-0">
          {/* Información del Lead */}
          <div className="space-y-6">
            <Card className="p-6 rounded-2xl border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
              <h3 className="font-semibold mb-5 flex items-center gap-2 text-lg tracking-tight">
                <Mail className="h-5 w-5 text-muted-foreground" />
                Información de Contacto
              </h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{lead.email}</p>
                </div>

                {lead.phone && (
                  <div>
                    <span className="text-muted-foreground">Teléfono:</span>
                    <p className="font-medium">{lead.phone}</p>
                  </div>
                )}

                {lead.company && (
                  <div>
                    <span className="text-muted-foreground">Empresa:</span>
                    <p className="font-medium">{lead.company}</p>
                  </div>
                )}

                {lead.service_interest && (
                  <div>
                    <span className="text-muted-foreground">Servicio:</span>
                    <p className="font-medium">{lead.service_interest}</p>
                  </div>
                )}

                <div>
                  <span className="text-muted-foreground">Creado:</span>
                  <p className="font-medium">
                    {format(new Date(lead.created_at), "PPP 'a las' p", { locale: es })}
                  </p>
                </div>
              </div>
            </Card>

            {lead.message && (
              <Card className="p-6 rounded-2xl border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg tracking-tight">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  Mensaje Original
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {lead.message}
                </p>
              </Card>
            )}

            {lead.ai_summary && (() => {
              try {
                const analysis = JSON.parse(lead.ai_summary);
                return (
                  <Card className="p-6 rounded-2xl border-purple-100 dark:border-purple-900/50 shadow-sm bg-gradient-to-br from-purple-50/80 to-blue-50/80 dark:from-purple-950/20 dark:to-blue-950/20 backdrop-blur-sm">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg tracking-tight">
                      <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      Análisis de IA
                    </h3>
                    {lead.ai_score && (
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-5 w-5 fill-warning text-warning" />
                        <span className="font-bold text-lg">{lead.ai_score}/100</span>
                      </div>
                    )}
                    {analysis.summary && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Resumen:</p>
                        <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                      </div>
                    )}
                    {analysis.next_steps && (
                      <div>
                        <p className="text-sm font-medium mb-1">Próximos pasos:</p>
                        <p className="text-sm text-muted-foreground">{analysis.next_steps}</p>
                      </div>
                    )}
                  </Card>
                );
              } catch (e) {
                return (
                  <Card className="p-6 rounded-2xl border-purple-100 dark:border-purple-900/50 shadow-sm bg-gradient-to-br from-purple-50/80 to-blue-50/80 dark:from-purple-950/20 dark:to-blue-950/20 backdrop-blur-sm">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg tracking-tight">
                      <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      Análisis de IA
                    </h3>
                    {lead.ai_score && (
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-5 w-5 fill-warning text-warning" />
                        <span className="font-bold text-lg">{lead.ai_score}/100</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{lead.ai_summary}</p>
                  </Card>
                );
              }
            })()}
          </div>

          {/* Gestión del Lead */}
          <div className="space-y-4">
            <Card className="p-6 rounded-2xl border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
              <h3 className="font-semibold mb-5 text-lg tracking-tight">Estado y Prioridad</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">Estado</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 h-12 bg-muted/50 border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all cursor-pointer appearance-none"
                  >
                    <option value="new">Nuevo</option>
                    <option value="contacted">Contactado</option>
                    <option value="qualified">Calificado</option>
                    <option value="converted">Convertido</option>
                    <option value="lost">Perdido</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">Asignado a</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-4 h-12 bg-muted/50 border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all cursor-pointer appearance-none"
                  >
                    <option value="">Sin asignar</option>
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.full_name || member.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">Prioridad</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 h-12 bg-muted/50 border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all cursor-pointer appearance-none"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">Notas</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Agrega notas sobre este lead..."
                    rows={4}
                    className="w-full p-4 bg-muted/50 border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all resize-none"
                  />
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={saveChanges}
                disabled={isSaving}
                className="flex-1 h-12 rounded-xl font-medium text-[15px] shadow-sm transition-all"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>

              {!lead.ai_score && (
                <Button
                  onClick={analyzeWithAI}
                  disabled={isAnalyzing}
                  variant="outline"
                  className="h-12 rounded-xl border-border/50 bg-background/50 hover:bg-muted font-medium text-[15px] shadow-sm transition-all"
                >
                  <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
                  {isAnalyzing ? 'Analizando...' : 'Analizar con IA'}
                </Button>
              )}
            </div>

            <Button
              onClick={() => setShowCreateReport(true)}
              variant="outline"
              className="w-full h-12 rounded-xl border-border/50 bg-background/50 hover:bg-muted font-medium text-[15px] shadow-sm transition-all"
            >
              <FileText className="mr-2 h-4 w-4" />
              Crear Informe de Consultoría
            </Button>

            <Button
              onClick={() => setShowScheduleMeeting(true)}
              variant="secondary"
              className="w-full h-12 rounded-xl font-medium text-[15px] shadow-sm transition-all"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Agendar Reunión
            </Button>

            <div className="pt-4 mt-2 border-t border-border/40">
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="ghost"
                className="w-full h-12 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 font-medium text-[15px] transition-all"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Lead
              </Button>
            </div>

            {activities.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Actividad Reciente
                </h3>
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(activity.created_at), "PPp", { locale: es })}
                      </div>
                      <p className="text-foreground">{activity.description}</p>
                      <Separator className="mt-3" />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el lead de{" "}
              <strong>{lead.name}</strong> y toda su información asociada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteLead}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showCreateReport && (
        <CreateReportModal
          onClose={() => setShowCreateReport(false)}
          onSuccess={() => {
            setShowCreateReport(false);
            onUpdate();
          }}
          leadId={lead.id}
          leadData={{
            name: lead.name,
            email: lead.email,
            company: lead.company,
            phone: lead.phone,
          }}
        />
      )}

      <ScheduleMeetingModal
        open={showScheduleMeeting}
        onOpenChange={setShowScheduleMeeting}
        onSuccess={() => {
          setShowScheduleMeeting(false);
          toast({
            title: "Reunión agendada",
            description: "La reunión se ha agendado exitosamente",
          });
        }}
        leadId={lead.id}
      />
    </Dialog>
  );
};