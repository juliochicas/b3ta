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
    scheduled: { label: "Programada", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
    completed: { label: "Completada", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" },
    cancelled: { label: "Cancelada", className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800" },
    no_show: { label: "No asistió", className: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800" },
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
