import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { ScheduleMeetingModal } from "./ScheduleMeetingModal";
import { MeetingCalendarDay } from "./MeetingCalendarDay";
import { MeetingListItem } from "./MeetingListItem";
import { MeetingFilters } from "./MeetingFilters";
import { cn } from "@/lib/utils";

interface Meeting {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  timezone: string;
  status: string;
  meeting_type: string;
  notes?: string;
  meeting_link?: string;
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
  meeting_attendees?: Array<{
    id: string;
    attendee_type: string;
    attendance_status: string;
    leads_b3ta?: { name: string; email: string };
    customers?: { name: string; email: string };
    external_name?: string;
    external_email?: string;
  }>;
}

export const MeetingCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [statusFilters, setStatusFilters] = useState<string[]>(['scheduled']);
  const [preSelectedDate, setPreSelectedDate] = useState<Date | null>(null);

  const { data: meetings, refetch } = useQuery({
    queryKey: ["meetings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select(`
          *,
          leads_b3ta!fk_meetings_lead (name, email),
          customers!fk_meetings_customer (name, email),
          meeting_attendees (
            id,
            attendee_type,
            attendance_status,
            leads_b3ta (name, email),
            customers (name, email),
            external_name,
            external_email
          )
        `)
        .order("scheduled_at");

      if (error) throw error;
      return data as Meeting[];
    },
  });

  const filteredMeetings = meetings?.filter(m => 
    statusFilters.length === 0 || statusFilters.includes(m.status)
  ) || [];

  const selectedDateMeetings = filteredMeetings.filter((meeting) =>
    isSameDay(new Date(meeting.scheduled_at), selectedDate)
  );

  const upcomingMeetings = filteredMeetings.filter((meeting) => {
    const meetingDate = new Date(meeting.scheduled_at);
    return meetingDate >= startOfDay(new Date());
  }).slice(0, 10);

  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      // Send cancellation email before deleting
      const { error: emailError } = await supabase.functions.invoke("send-meeting-cancellation", {
        body: { meetingId },
      });
      
      if (emailError) {
        console.error("Error sending cancellation email:", emailError);
        toast.error("No se pudo enviar la notificación de cancelación");
      }

      // Delete the meeting
      const { error } = await supabase
        .from("meetings")
        .delete()
        .eq("id", meetingId);

      if (error) {
        toast.error("Error al eliminar la reunión");
        return;
      }

      toast.success("Reunión eliminada y notificación enviada");
      refetch();
    } catch (error) {
      console.error("Error in handleDeleteMeeting:", error);
      toast.error("Error al procesar la cancelación");
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setPreSelectedDate(date);
    setIsScheduleModalOpen(true);
  };

  // Calendar grid calculation
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reuniones</h1>
          <p className="text-muted-foreground">Gestiona tu calendario y reuniones</p>
        </div>
        <MeetingFilters
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          statusFilters={statusFilters}
          onStatusFiltersChange={setStatusFilters}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        {viewMode === 'calendar' && (
          <Card className="lg:col-span-2 shadow-sm border-border/50">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-semibold">
                  {format(currentMonth, "MMMM yyyy", { locale: es })}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="h-9 w-9 hover:bg-accent hover:scale-105 transition-all duration-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMonth(new Date());
                      setSelectedDate(new Date());
                    }}
                    className="hover:bg-accent hover:scale-105 transition-all duration-200"
                  >
                    Hoy
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="h-9 w-9 hover:bg-accent hover:scale-105 transition-all duration-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => (
                  <MeetingCalendarDay
                    key={idx}
                    date={day}
                    meetings={filteredMeetings}
                    isSelected={isSameDay(day, selectedDate)}
                    isCurrentMonth={isSameMonth(day, currentMonth)}
                    onClick={() => handleDayClick(day)}
                  />
                ))}
              </div>

              <Button
                onClick={() => {
                  setSelectedMeeting(null);
                  setPreSelectedDate(null);
                  setIsScheduleModalOpen(true);
                }}
                className="w-full mt-6 h-11 font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agendar Nueva Reunión
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Meetings List */}
        <Card className={cn(
          "shadow-sm border-border/50",
          viewMode === 'list' ? "lg:col-span-3" : "lg:col-span-1"
        )}>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {viewMode === 'calendar' 
                ? format(selectedDate, "d 'de' MMMM", { locale: es })
                : "Próximas Reuniones"}
            </CardTitle>
            {viewMode === 'calendar' && selectedDateMeetings.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedDateMeetings.length} {selectedDateMeetings.length === 1 ? 'reunión' : 'reuniones'}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
            {viewMode === 'calendar' ? (
              selectedDateMeetings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No hay reuniones para este día
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPreSelectedDate(selectedDate);
                      setIsScheduleModalOpen(true);
                    }}
                    className="hover:bg-accent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agendar reunión
                  </Button>
                </div>
              ) : (
                selectedDateMeetings.map((meeting) => (
                  <MeetingListItem
                    key={meeting.id}
                    meeting={meeting}
                    onEdit={() => {
                      setSelectedMeeting(meeting);
                      setIsScheduleModalOpen(true);
                    }}
                    onDelete={() => handleDeleteMeeting(meeting.id)}
                  />
                ))
              )
            ) : (
              upcomingMeetings.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  No hay reuniones próximas
                </p>
              ) : (
                <div className={cn(
                  "grid gap-3",
                  viewMode === 'list' && "md:grid-cols-2 lg:grid-cols-3"
                )}>
                  {upcomingMeetings.map((meeting) => (
                    <MeetingListItem
                      key={meeting.id}
                      meeting={meeting}
                      onEdit={() => {
                        setSelectedMeeting(meeting);
                        setIsScheduleModalOpen(true);
                      }}
                      onDelete={() => handleDeleteMeeting(meeting.id)}
                    />
                  ))}
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>

      <ScheduleMeetingModal
        open={isScheduleModalOpen}
        onOpenChange={(open) => {
          setIsScheduleModalOpen(open);
          if (!open) {
            setSelectedMeeting(null);
            setPreSelectedDate(null);
          }
        }}
        onSuccess={() => {
          refetch();
          setIsScheduleModalOpen(false);
          setSelectedMeeting(null);
          setPreSelectedDate(null);
        }}
        meetingToEdit={selectedMeeting}
        preSelectedDate={preSelectedDate}
      />
    </div>
  );
};
