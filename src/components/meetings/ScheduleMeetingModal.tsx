import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
}: ScheduleMeetingModalProps) => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [timezone, setTimezone] = useState("America/Mexico_City");
  const [selectedLeadId, setSelectedLeadId] = useState(leadId || "");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    } else {
      setDate(undefined);
      setTime("");
      setDuration("30");
      setTimezone("America/Mexico_City");
      setSelectedLeadId(leadId || "");
      setNotes("");
      setStatus("scheduled");
    }
  }, [meetingToEdit, leadId]);

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
      };


  const addAttendee = () => {
    try {
      if (newAttendeeType === 'external') {
        if (!externalName || !externalEmail) return;
        const exists = attendees.some(a => a.email.toLowerCase() === externalEmail.toLowerCase());
        if (exists) {
          toast.error('Este invitado ya fue añadido');
          return;
        }
        setAttendees([...attendees, { type: 'external', name: externalName, email: externalEmail }]);
        setExternalName("");
        setExternalEmail("");
      } else {
        if (!selectedAttendeeId) return;
        const list = newAttendeeType === 'lead' ? leads : customers;
        const selected = list?.find((item: any) => item.id === selectedAttendeeId);
        if (!selected) return;
        const exists = attendees.some(a => a.email.toLowerCase() === selected.email.toLowerCase());
        if (exists) {
          toast.error('Este invitado ya fue añadido');
          return;
        }
        setAttendees([...attendees, {
          type: newAttendeeType,
          id: selected.id,
          name: selected.name,
          email: selected.email,
        }]);
        setSelectedAttendeeId("");
      }
    } catch (e) {
      console.error('addAttendee error', e);
    }
  };
      if (meetingToEdit) {
        const { error } = await supabase
          .from("meetings")
          .update(meetingData)
          .eq("id", meetingToEdit.id);

        if (error) throw error;
        toast.success("Reunión actualizada");
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
        
        // Send confirmation email
        if (newMeeting) {
          try {
            await supabase.functions.invoke("send-meeting-confirmation", {
              body: { meetingId: newMeeting.id },
            });
          } catch (emailError) {
            console.error("Error sending confirmation email:", emailError);
          }
        }
        
        toast.success("Reunión agendada con " + attendees.length + " invitado(s)");
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
