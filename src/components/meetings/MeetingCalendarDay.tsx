import { cn } from "@/lib/utils";
import { isSameDay, isToday } from "date-fns";

interface MeetingCalendarDayProps {
  date: Date;
  meetings: Array<{ scheduled_at: string; status: string }>;
  isSelected: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
}

export const MeetingCalendarDay = ({
  date,
  meetings,
  isSelected,
  isCurrentMonth,
  onClick,
}: MeetingCalendarDayProps) => {
  const dayMeetings = meetings.filter((m) =>
    isSameDay(new Date(m.scheduled_at), date)
  );
  
  const hasScheduled = dayMeetings.some(m => m.status === 'scheduled');
  const todayDate = isToday(date);

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-square rounded-lg p-2 text-sm font-medium transition-all duration-200",
        "hover:bg-accent hover:scale-105 active:scale-95",
        isSelected && "bg-primary text-primary-foreground shadow-md scale-105",
        !isSelected && todayDate && "bg-accent/50 font-semibold",
        !isCurrentMonth && "text-muted-foreground opacity-40",
        "group"
      )}
    >
      <span className="block">{date.getDate()}</span>
      {dayMeetings.length > 0 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
          {dayMeetings.slice(0, 3).map((meeting, idx) => (
            <div
              key={idx}
              className={cn(
                "w-1 h-1 rounded-full transition-all duration-200",
                meeting.status === 'scheduled' && "bg-blue-500",
                meeting.status === 'completed' && "bg-green-500",
                meeting.status === 'cancelled' && "bg-red-500",
                isSelected && "bg-primary-foreground",
                "group-hover:w-1.5 group-hover:h-1.5"
              )}
            />
          ))}
          {dayMeetings.length > 3 && (
            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
          )}
        </div>
      )}
    </button>
  );
};
