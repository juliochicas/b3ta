import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, List, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MeetingFiltersProps {
  viewMode: 'calendar' | 'list';
  onViewModeChange: (mode: 'calendar' | 'list') => void;
  statusFilters: string[];
  onStatusFiltersChange: (filters: string[]) => void;
}

const statusOptions = [
  { value: 'scheduled', label: 'Programadas' },
  { value: 'completed', label: 'Completadas' },
  { value: 'cancelled', label: 'Canceladas' },
  { value: 'no_show', label: 'No asistió' },
];

export const MeetingFilters = ({
  viewMode,
  onViewModeChange,
  statusFilters,
  onStatusFiltersChange,
}: MeetingFiltersProps) => {
  const toggleStatus = (status: string) => {
    if (statusFilters.includes(status)) {
      onStatusFiltersChange(statusFilters.filter(s => s !== status));
    } else {
      onStatusFiltersChange([...statusFilters, status]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* View Mode Toggle */}
      <div className="inline-flex rounded-lg border border-border bg-background p-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewModeChange('calendar')}
          className={cn(
            "h-8 px-3 transition-all duration-200",
            viewMode === 'calendar' && "bg-primary text-primary-foreground shadow-sm"
          )}
        >
          <CalendarIcon className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewModeChange('list')}
          className={cn(
            "h-8 px-3 transition-all duration-200",
            viewMode === 'list' && "bg-primary text-primary-foreground shadow-sm"
          )}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {statusFilters.length > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {statusFilters.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-background">
          {statusOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={statusFilters.includes(option.value)}
              onCheckedChange={() => toggleStatus(option.value)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
