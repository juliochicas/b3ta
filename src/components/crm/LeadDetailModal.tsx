import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, Phone, Building2, MessageSquare, Calendar, 
  Star, Sparkles, Save, Activity 
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadActivities();
  }, [lead.id]);

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
      const { error } = await supabase.functions.invoke('ai-lead-scorer', {
        body: { leadId: lead.id }
      });

      if (error) throw error;

      toast({
        title: "Análisis completado",
        description: "La IA ha analizado el lead exitosamente",
      });

      onUpdate();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo analizar el lead",
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
        notes
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{lead.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Información del Lead */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5" />
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
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Mensaje Original
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {lead.message}
                </p>
              </Card>
            )}

            {lead.ai_summary && (
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Análisis de IA
                </h3>
                {lead.ai_score && (
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    <span className="font-bold text-lg">{lead.ai_score}/100</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{lead.ai_summary}</p>
              </Card>
            )}
          </div>

          {/* Gestión del Lead */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Estado y Prioridad</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Estado</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="new">Nuevo</option>
                    <option value="contacted">Contactado</option>
                    <option value="qualified">Calificado</option>
                    <option value="converted">Convertido</option>
                    <option value="lost">Perdido</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Prioridad</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Notas</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Agrega notas sobre este lead..."
                    rows={4}
                  />
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={saveChanges}
                disabled={isSaving}
                className="flex-1"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>

              {!lead.ai_score && (
                <Button
                  onClick={analyzeWithAI}
                  disabled={isAnalyzing}
                  variant="outline"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isAnalyzing ? 'Analizando...' : 'Analizar con IA'}
                </Button>
              )}
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
    </Dialog>
  );
};