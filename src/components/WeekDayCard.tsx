"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types/task";
import { isToday, parseDaySlot } from "@/lib/dates";
import { useTranslations } from "next-intl";

interface WeekDayCardProps {
  daySlot: string;
  tasks: Task[];
  onClick: () => void;
}

export function WeekDayCard({ daySlot, tasks, onClick }: WeekDayCardProps) {
  const done = tasks.filter((t) => t.status === "DONE").length;
  const today = tasks.filter((t) => t.status === "TODAY").length;
  const blocked = tasks.filter((t) => t.status === "BLOCKED").length;
  const total = tasks.length;
  const dayNum = daySlot.split("-")[2];
  const todayHighlight = isToday(daySlot);
  const date = parseDaySlot(daySlot);

  const t = useTranslations("weekDayCard");
  const tDates = useTranslations("dates");
  const shortDays: string[] = tDates.raw("shortDays");

  return (
    <Card
      className={`cursor-pointer hover:bg-muted/50 transition-colors ${
        todayHighlight ? "ring-2 ring-orange-400" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-1 pt-3 px-3">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>{shortDays[date.getDay()]} {dayNum}</span>
          {todayHighlight && (
            <span className="text-xs text-orange-600 font-normal">{tDates("today")}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-1">
        {total === 0 ? (
          <p className="text-xs text-muted-foreground">{t("noTasks")}</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {done > 0 && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                {t("done", { count: done })}
              </Badge>
            )}
            {today > 0 && (
              <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                {t("today", { count: today })}
              </Badge>
            )}
            {blocked > 0 && (
              <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">
                {t("blocked", { count: blocked })}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
