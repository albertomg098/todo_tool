import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays, HelpCircle } from "lucide-react";
import { formatDayDisplay, isToday } from "@/lib/dates";

interface DayHeaderProps {
  daySlot: string;
  onPrev: () => void;
  onNext: () => void;
  onSwitchToWeek?: () => void;
  onOpenHelp?: () => void;
}

export function DayHeader({ daySlot, onPrev, onNext, onSwitchToWeek, onOpenHelp }: DayHeaderProps) {
  return (
    <div className="flex items-center justify-between py-4 px-4">
      <Button variant="ghost" size="icon" onClick={onPrev}>
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div className="text-center">
        <h1 className="text-xl font-semibold">{formatDayDisplay(daySlot)}</h1>
        {isToday(daySlot) && (
          <span className="text-sm text-muted-foreground">Hoy</span>
        )}
      </div>
      <div className="flex gap-1">
        {onOpenHelp && (
          <Button variant="ghost" size="icon" onClick={onOpenHelp} title="Cómo usar">
            <HelpCircle className="h-5 w-5" />
          </Button>
        )}
        {onSwitchToWeek && (
          <Button variant="ghost" size="icon" onClick={onSwitchToWeek} title="Vista semanal">
            <CalendarDays className="h-5 w-5" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onNext}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
