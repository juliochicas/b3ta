import { format } from "date-fns";
import { Clock, User, Edit, Trash2, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  leads_b3ta?: { name: string; email: string };
  customers?: { name: string; email: string };
  meeting_attendees?: Array<{
    id: string;
    attendee_type: string;
    leads_b3ta?: { name: string; email: string };
    customers?: { name: string; email: string };
    external_name?: string;
  }>;
}

interface MeetingListItemProps {
  meeting: Meeting;
  onEdit: () => void;
  onDelete: () => void;
}

const getStatusConfig = (status: string) => {
  const configs = {
    scheduled: { label: "Programada", className: "bg-status-scheduled/10 text-status-scheduled border-status-scheduled/20" },
    completed: { label: "Completada", className: "bg-status-completed/10 text-status-completed border-status-completed/20" },
    cancelled: { label: "Cancelada", className: "bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20" },
    no_show: { label: "No asistió", className: "bg-status-no-show/10 text-status-no-show border-status-no-show/20" },
  };
  return configs[status as keyof typeof configs] || configs.scheduled;
};

export const MeetingListItem = ({ meeting, onEdit, onDelete }: MeetingListItemProps) => {
  const statusConfig = getStatusConfig(meeting.status);
  const endTime = new Date(
    new Date(meeting.scheduled_at).getTime() + meeting.duration_minutes * 60000
  );

  return (
    <div className="group relative bg-card rounded-xl p-4 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in">
      {/* Time and Status Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(meeting.scheduled_at), "HH:mm")}</span>
            <span className="text-muted-foreground">-</span>
            <span>{format(endTime, "HH:mm")}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {meeting.duration_minutes} min
          </span>
        </div>
        <Badge 
          variant="outline" 
          className={cn("border transition-colors duration-200", statusConfig.className)}
        >
          {statusConfig.label}
        </Badge>
      </div>

      {/* Participant Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="font-medium">
            {meeting.leads_b3ta?.name || meeting.customers?.name || "Sin asignar"}
          </span>
        </div>

        {meeting.meeting_attendees && meeting.meeting_attendees.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {meeting.meeting_attendees.map((att, idx) => (
                <span key={att.id} className="text-muted-foreground">
                  {att.attendee_type === 'lead' ? att.leads_b3ta?.name :
                   att.attendee_type === 'customer' ? att.customers?.name :
                   att.external_name}
                  {idx < meeting.meeting_attendees!.length - 1 && ","}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span>{meeting.timezone}</span>
        </div>
      </div>

      {/* Notes */}
      {meeting.notes && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 italic">
          {meeting.notes}
        </p>
      )}

      {/* Video Link */}
      {meeting.meeting_link && (
        <div className="mb-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 gap-2 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
            onClick={() => window.open(meeting.meeting_link, '_blank')}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Unirse a Reunión Virtual
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          size="sm"
          variant="ghost"
          onClick={onEdit}
          className="flex-1 h-8 hover:bg-primary/10 hover:text-primary"
        >
          <Edit className="h-3 w-3 mr-1" />
          Editar
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="h-8 hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
