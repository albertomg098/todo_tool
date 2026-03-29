"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getISOWeekSlot, getWeekDaySlots, addWeeks, getMondayOfWeek } from "@/lib/dates";
import { useWeekPlan } from "@/hooks/useWeekPlan";
import { fetchTasksByWeek } from "@/app/actions/tasks";
import { useTranslations } from "next-intl";
import type { Task, Status, Category } from "@/types/task";
import { IntentionsEditor } from "./IntentionsEditor";
import { WeekDayCard } from "./WeekDayCard";
import { BacklogSection } from "./BacklogSection";

interface WeekViewProps {
  onNavigateToDay: (daySlot: string) => void;
}

export function WeekView({ onNavigateToDay }: WeekViewProps) {
  const [weekSlot, setWeekSlot] = useState(() => getISOWeekSlot(new Date()));
  const { plan, saveIntentions, reload } = useWeekPlan(weekSlot);
  const [weekTasks, setWeekTasks] = useState<Task[]>([]);
  const t = useTranslations("dates");

  useEffect(() => {
    reload();
    fetchTasksByWeek(weekSlot).then((data) => {
      const mapped: Task[] = data.map((row) => ({
        id: row.id,
        title: row.title,
        status: row.status as Status,
        category: row.category as Category,
        notes: row.notes ?? undefined,
        createdAt: row.createdAt.toISOString(),
        completedAt: row.completedAt?.toISOString(),
        daySlot: row.daySlot ?? undefined,
        weekSlot: row.weekSlot,
      }));
      setWeekTasks(mapped);
    });
  }, [weekSlot, reload]);

  const daySlots = getWeekDaySlots(weekSlot);
  const backlogTasks = weekTasks.filter((t) => !t.daySlot);

  function tasksByDay(daySlot: string) {
    return weekTasks.filter((t) => t.daySlot === daySlot);
  }

  // Build localized week display
  const [, weekStr] = weekSlot.split("-W");
  const monday = getMondayOfWeek(weekSlot);
  const months: string[] = t.raw("months");
  const weekDisplay = t("weekFormat", {
    week: String(Number(weekStr)),
    month: months[monday.getMonth()],
    year: String(monday.getFullYear()),
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <Button variant="ghost" size="icon" onClick={() => setWeekSlot((w) => addWeeks(w, -1))} className="cursor-pointer">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-semibold">{weekDisplay}</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setWeekSlot((w) => addWeeks(w, 1))} className="cursor-pointer">
          <ChevronRight className="h-5 w-5" />
        </Button>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
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
