import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
        
        // Send confirmation email
        if (newMeeting && selectedLeadId && selectedLeadId !== "none") {
          try {
            await supabase.functions.invoke("send-meeting-confirmation", {
              body: { meetingId: newMeeting.id },
            });
          } catch (emailError) {
            console.error("Error sending confirmation email:", emailError);
            // Don't fail the whole operation if email fails
          }
        }
        
        toast.success("Reunión agendada y correo de confirmación enviado");
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
