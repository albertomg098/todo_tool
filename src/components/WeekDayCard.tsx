import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types/task";
import { getShortDayName, isToday } from "@/lib/dates";

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

  return (
    <Card
      className={`cursor-pointer hover:bg-muted/50 transition-colors ${
        todayHighlight ? "ring-2 ring-orange-400" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-1 pt-3 px-3">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>{getShortDayName(daySlot)} {dayNum}</span>
          {todayHighlight && (
            <span className="text-xs text-orange-600 font-normal">Hoy</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-1">
        {total === 0 ? (
          <p className="text-xs text-muted-foreground">Sin tareas</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {done > 0 && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                {done} done
              </Badge>
            )}
            {today > 0 && (
              <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                {today} today
              </Badge>
            )}
            {blocked > 0 && (
              <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">
                {blocked} blocked
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
