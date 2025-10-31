import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { Clock, MapPin, User, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ScheduleMeetingModal } from "./ScheduleMeetingModal";

interface Meeting {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  timezone: string;
  status: string;
  meeting_type: string;
  notes?: string;
  lead_id?: string;
  customer_id?: string;
  leads_b3ta?: {
    name: string;
    email: string;
  };
  customers?: {
    name: string;
    email: string;
  };
}

export const MeetingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const { data: meetings, refetch } = useQuery({
    queryKey: ["meetings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select(`
          *,
          leads_b3ta!fk_meetings_lead (name, email),
          customers!fk_meetings_customer (name, email)
        `)
        .order("scheduled_at");

      if (error) throw error;
      return data as Meeting[];
    },
  });

  const selectedDateMeetings = meetings?.filter((meeting) =>
    isSameDay(new Date(meeting.scheduled_at), selectedDate)
  );

  const handleDeleteMeeting = async (meetingId: string) => {
    const { error } = await supabase
      .from("meetings")
      .delete()
      .eq("id", meetingId);

    if (error) {
      toast.error("Error al eliminar la reunión");
      return;
    }

    toast.success("Reunión eliminada");
    refetch();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "no_show":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Programada";
      case "completed":
        return "Completada";
      case "cancelled":
        return "Cancelada";
      case "no_show":
        return "No asistió";
      default:
        return status;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Calendario</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />
          <Button
            onClick={() => {
              setSelectedMeeting(null);
              setIsScheduleModalOpen(true);
            }}
            className="w-full mt-4"
          >
            Agendar Nueva Reunión
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            Reuniones para {format(selectedDate, "d 'de' MMMM, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedDateMeetings || selectedDateMeetings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay reuniones programadas para este día
            </p>
          ) : (
            <div className="space-y-4">
              {selectedDateMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {format(new Date(meeting.scheduled_at), "HH:mm")} -{" "}
                        {format(
                          new Date(
                            new Date(meeting.scheduled_at).getTime() +
                              meeting.duration_minutes * 60000
                          ),
                          "HH:mm"
                        )}
                      </span>
                      <Badge className={getStatusColor(meeting.status)}>
                        {getStatusLabel(meeting.status)}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedMeeting(meeting);
                          setIsScheduleModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteMeeting(meeting.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {meeting.leads_b3ta?.name ||
                          meeting.customers?.name ||
                          "Sin asignar"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{meeting.timezone}</span>
                    </div>
                    {meeting.notes && (
                      <p className="text-muted-foreground mt-2">
                        {meeting.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ScheduleMeetingModal
        open={isScheduleModalOpen}
        onOpenChange={setIsScheduleModalOpen}
        onSuccess={() => {
          refetch();
          setIsScheduleModalOpen(false);
          setSelectedMeeting(null);
        }}
        meetingToEdit={selectedMeeting}
      />
    </div>
  );
};
