import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Calendar, HelpCircle } from "lucide-react";
import { getISOWeekSlot, getWeekDaySlots, addWeeks, formatWeekDisplay } from "@/lib/dates";
import { useWeekPlan } from "@/hooks/useWeekPlan";
import * as storage from "@/lib/storage";
import type { Task } from "@/types/task";
import { IntentionsEditor } from "./IntentionsEditor";
import { WeekDayCard } from "./WeekDayCard";
import { BacklogSection } from "./BacklogSection";

interface WeekViewProps {
  onSwitchToDay: () => void;
  onNavigateToDay: (daySlot: string) => void;
  onOpenHelp: () => void;
}

export function WeekView({ onSwitchToDay, onNavigateToDay, onOpenHelp }: WeekViewProps) {
  const [weekSlot, setWeekSlot] = useState(() => getISOWeekSlot(new Date()));
  const { plan, saveIntentions, reload } = useWeekPlan(weekSlot);
  const [weekTasks, setWeekTasks] = useState<Task[]>([]);

  useEffect(() => {
    reload();
    setWeekTasks(storage.getTasksByWeek(weekSlot));
  }, [weekSlot, reload]);

  const daySlots = getWeekDaySlots(weekSlot);
  const backlogTasks = weekTasks.filter((t) => !t.daySlot);

  function tasksByDay(daySlot: string) {
    return weekTasks.filter((t) => t.daySlot === daySlot);
  }

  return (
    <div className="mx-auto w-full max-w-2xl min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between py-4 px-4">
        <Button variant="ghost" size="icon" onClick={() => setWeekSlot((w) => addWeeks(w, -1))}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-semibold">{formatWeekDisplay(weekSlot)}</h1>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onOpenHelp} title="Cómo usar">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onSwitchToDay} title="Vista diaria">
            <Calendar className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setWeekSlot((w) => addWeeks(w, 1))}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Intentions editor */}
      <div className="mt-4">
        <IntentionsEditor
          intentions={plan?.intentions ?? []}
          onSave={saveIntentions}
        />
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-5 gap-2 mx-4 mb-4">
        {daySlots.map((daySlot) => (
          <WeekDayCard
            key={daySlot}
            daySlot={daySlot}
            tasks={tasksByDay(daySlot)}
            onClick={() => onNavigateToDay(daySlot)}
          />
        ))}
      </div>

      <Separator className="mb-4" />

      {/* Backlog */}
      <BacklogSection tasks={backlogTasks} />
    </div>
  );
}
