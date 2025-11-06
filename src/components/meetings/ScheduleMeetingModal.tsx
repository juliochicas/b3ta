import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ScheduleMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  leadId?: string;
  meetingToEdit?: any;
  preSelectedDate?: Date | null;
}

const TIMEZONES = [
  { value: "America/Mexico_City", label: "Ciudad de México (GMT-6)" },
  { value: "America/New_York", label: "Nueva York (GMT-5)" },
  { value: "America/Los_Angeles", label: "Los Ángeles (GMT-8)" },
  { value: "Europe/Madrid", label: "Madrid (GMT+1)" },
  { value: "Europe/London", label: "Londres (GMT+0)" },
];

export const ScheduleMeetingModal = ({
  open,
  onOpenChange,
  onSuccess,
  leadId,
  meetingToEdit,
  preSelectedDate,
}: ScheduleMeetingModalProps) => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [timezone, setTimezone] = useState("America/Mexico_City");
  const [selectedLeadId, setSelectedLeadId] = useState(leadId || "");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  
  // Attendees management
  interface Attendee {
    type: 'lead' | 'customer' | 'external';
    id?: string;
    name: string;
    email: string;
  }
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [newAttendeeType, setNewAttendeeType] = useState<'lead' | 'customer' | 'external'>('lead');
  const [selectedAttendeeId, setSelectedAttendeeId] = useState("");
  const [externalName, setExternalName] = useState("");
  const [externalEmail, setExternalEmail] = useState("");
  
  // Track original date/time for reschedule detection
  const [originalScheduledAt, setOriginalScheduledAt] = useState<string | null>(null);

  useEffect(() => {
    if (meetingToEdit) {
      const meetingDate = new Date(meetingToEdit.scheduled_at);
      setDate(meetingDate);
      setTime(format(meetingDate, "HH:mm"));
      setDuration(meetingToEdit.duration_minutes.toString());
      setTimezone(meetingToEdit.timezone);
      setSelectedLeadId(meetingToEdit.lead_id || "");
      setNotes(meetingToEdit.notes || "");
      setStatus(meetingToEdit.status);
      setOriginalScheduledAt(meetingToEdit.scheduled_at);
      setMeetingLink(meetingToEdit.meeting_link || "");
    } else {
      setDate(preSelectedDate || undefined);
      setTime("");
      setDuration("30");
      setTimezone("America/Mexico_City");
      setSelectedLeadId(leadId || "");
      setNotes("");
      setStatus("scheduled");
      setAttendees([]);
      setOriginalScheduledAt(null);
      // Generate meeting link immediately for new meetings
      const roomName = `b3ta-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setMeetingLink(`https://meet.jit.si/${roomName}`);
    }
  }, [meetingToEdit, leadId, preSelectedDate]);

  const { data: leads } = useQuery({
    queryKey: ["leads-for-meeting"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads_b3ta")
        .select("id, name, email")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: customers } = useQuery({
    queryKey: ["customers-for-meeting"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("id, name, email")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
  const addAttendee = () => {
    try {
      if (newAttendeeType === 'external') {
        if (!externalName || !externalEmail) return;
        const exists = attendees.some(a => a.email.toLowerCase() === externalEmail.toLowerCase());
        if (exists) { toast.error('Este invitado ya fue añadido'); return; }
        setAttendees([...attendees, { type: 'external', name: externalName, email: externalEmail }]);
        setExternalName("");
        setExternalEmail("");
      } else {
        if (!selectedAttendeeId) return;
        const list = newAttendeeType === 'lead' ? leads : customers;
        const selected = list?.find((item: any) => item.id === selectedAttendeeId);
        if (!selected) return;
        const exists = attendees.some(a => a.email.toLowerCase() === selected.email.toLowerCase());
        if (exists) { toast.error('Este invitado ya fue añadido'); return; }
        setAttendees([...attendees, { type: newAttendeeType, id: selected.id, name: selected.name, email: selected.email }]);
        setSelectedAttendeeId("");
      }
    } catch (e) { console.error('addAttendee error', e); }
  };

  const handleSubmit = async () => {
    if (!date || !time) {
      toast.error("Por favor selecciona fecha y hora");
      return;
    }

    setIsSubmitting(true);

    try {
      const [hours, minutes] = time.split(":").map(Number);
      const scheduledAt = new Date(date);
      scheduledAt.setHours(hours, minutes, 0, 0);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("No user found");

      const meetingData = {
        lead_id: selectedLeadId && selectedLeadId !== "none" ? selectedLeadId : null,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: parseInt(duration),
        timezone,
        notes,
        status,
        created_by: userData.user.id,
        meeting_link: meetingToEdit ? undefined : meetingLink, // Only set on creation
      };


      // duplicate addAttendee removed

      if (meetingToEdit) {
        // Check if date/time changed for reschedule notification
        const hasDateTimeChanged = originalScheduledAt && 
          new Date(originalScheduledAt).getTime() !== scheduledAt.getTime();
        
        const { error } = await supabase
          .from("meetings")
          .update(meetingData)
          .eq("id", meetingToEdit.id);

        if (error) throw error;
        
        // Send reschedule notification if date/time changed
        if (hasDateTimeChanged) {
          try {
            const oldDate = new Date(originalScheduledAt);
            const oldTime = format(oldDate, "HH:mm");
            
            const { error: emailError } = await supabase.functions.invoke("send-meeting-reschedule", {
              body: { 
                meetingId: meetingToEdit.id,
                oldDate: originalScheduledAt,
                oldTime: oldTime
              },
            });
            
            if (emailError) {
              console.error("Error sending reschedule email:", emailError);
              toast.error("Reunión actualizada pero no se pudo enviar notificación");
            } else {
              toast.success("Reunión reprogramada y notificación enviada");
            }
          } catch (emailError) {
            console.error("Error invoking reschedule function:", emailError);
            toast.success("Reunión actualizada");
          }
        } else {
          toast.success("Reunión actualizada");
        }
      } else {
        const { data: newMeeting, error } = await supabase
          .from("meetings")
          .insert([meetingData])
          .select()
          .single();

        if (error) throw error;
        
        // Insert attendees
        if (newMeeting && attendees.length > 0) {
          const attendeesData = attendees.map(att => ({
            meeting_id: newMeeting.id,
            attendee_type: att.type,
            lead_id: att.type === 'lead' ? att.id : null,
            customer_id: att.type === 'customer' ? att.id : null,
            external_name: att.type === 'external' ? att.name : null,
            external_email: att.type === 'external' ? att.email : null,
          }));
          
          const { error: attendeesError } = await supabase
            .from("meeting_attendees")
            .insert(attendeesData);
            
          if (attendeesError) {
            console.error("Error inserting attendees:", attendeesError);
          }
        }
        
        // Send confirmation email to all attendees
        if (newMeeting) {
          try {
            const { data: fnData, error: fnError } = await supabase.functions.invoke("send-meeting-confirmation", {
              body: { meetingId: newMeeting.id },
            });
            if (fnError) {
              console.error("send-meeting-confirmation error", fnError);
              toast.error("No se pudieron enviar las invitaciones");
            } else {
              const msg = (fnData as any)?.message || "Invitaciones enviadas";
              toast.success(msg);
            }
          } catch (emailError) {
            console.error("Error invoking send-meeting-confirmation:", emailError);
            toast.error("Error al enviar las invitaciones");
          }
        }
        
        // Show success with meeting link
        if (newMeeting?.meeting_link) {
          toast.success(
            <div className="space-y-2">
              <div className="font-semibold">Reunión agendada con {attendees.length} invitado(s)</div>
              <div className="text-sm space-y-1">
                <div className="font-medium">Link de videollamada:</div>
                <div className="flex items-center gap-2">
                  <a 
                    href={newMeeting.meeting_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate max-w-xs"
                  >
                    {newMeeting.meeting_link}
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(newMeeting.meeting_link);
                      toast.success("Link copiado al portapapeles");
                    }}
                    className="text-xs px-2 py-1 bg-primary/10 hover:bg-primary/20 rounded"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>,
            { duration: 8000 }
          );
        } else {
          toast.success("Reunión agendada con " + attendees.length + " invitado(s)");
        }
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Error al agendar reunión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {meetingToEdit ? "Editar Reunión" : "Agendar Nueva Reunión"}
          </DialogTitle>
          <DialogDescription>
            {meetingToEdit 
              ? "Modifica los detalles de la reunión" 
              : "Completa los detalles para agendar una nueva reunión"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Prospecto (opcional)</Label>
            <Select value={selectedLeadId || "none"} onValueChange={setSelectedLeadId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un prospecto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin asignar</SelectItem>
                {leads?.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.name} - {lead.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Selecciona una fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Hora</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div>
              <Label>Duración (minutos)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="90">1.5 horas</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!meetingToEdit && meetingLink && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Link de Videollamada Generado
              </div>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  Este link se compartirá automáticamente con todos los invitados
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    value={meetingLink} 
                    readOnly 
                    className="text-sm font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(meetingLink);
                      toast.success("Link copiado al portapapeles");
                    }}
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label>Zona Horaria</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Agregar Invitados</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Select value={newAttendeeType} onValueChange={(v: any) => setNewAttendeeType(v)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Prospecto</SelectItem>
                    <SelectItem value="customer">Cliente</SelectItem>
                    <SelectItem value="external">Externo</SelectItem>
                  </SelectContent>
                </Select>
                
                {newAttendeeType !== 'external' ? (
                  <>
                    <Select 
                      value={selectedAttendeeId} 
                      onValueChange={(value) => setSelectedAttendeeId(value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={`Seleccionar ${newAttendeeType === 'lead' ? 'prospecto' : 'cliente'}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {(newAttendeeType === 'lead' ? leads : customers)?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} - {item.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={addAttendee}>Agregar</Button>
                  </>
                ) : (
                  <div className="flex-1 flex gap-2">
                    <Input 
                      placeholder="Nombre"
                      value={externalName}
                      onChange={(e) => setExternalName(e.target.value)}
                    />
                    <Input 
                      placeholder="Email"
                      type="email"
                      value={externalEmail}
                      onChange={(e) => setExternalEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addAttendee();
                        }
                      }}
                    />
                    <Button type="button" onClick={addAttendee}>Agregar</Button>
                  </div>
                )}
              </div>
              
              {attendees.length > 0 && (
                <div className="border rounded-md p-2 space-y-1">
                  {attendees.map((att, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-muted px-3 py-1 rounded">
                      <span className="text-sm">
                        {att.name} ({att.email}) - {att.type === 'lead' ? 'Prospecto' : att.type === 'customer' ? 'Cliente' : 'Externo'}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAttendees(attendees.filter((_, i) => i !== idx))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {meetingToEdit && (
            <div>
              <Label>Estado</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Programada</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                  <SelectItem value="no_show">No asistió</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Notas</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas adicionales sobre la reunión..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando..."
                : meetingToEdit
                ? "Actualizar"
                : "Agendar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
