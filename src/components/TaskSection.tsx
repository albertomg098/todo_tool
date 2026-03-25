import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import type { Task, Status } from "@/types/task";
import { TaskItem } from "./TaskItem";

const sectionColors: Record<Status, string> = {
  TODAY: "text-orange-600",
  TODO: "text-slate-500",
  BLOCKED: "text-yellow-600",
  DONE: "text-green-600",
};

interface TaskSectionProps {
  status: Status;
  tasks: Task[];
  defaultOpen?: boolean;
  onComplete: (taskId: string) => void;
  onChangeStatus: (taskId: string, status: Status) => void;
  onOpenSheet: (task: Task) => void;
}

export function TaskSection({
  status,
  tasks,
  defaultOpen = true,
  onComplete,
  onChangeStatus,
  onOpenSheet,
}: TaskSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const showWarning = status === "TODAY" && tasks.length > 5;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mx-4 mb-3">
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-muted/50">
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "" : "-rotate-90"}`}
        />
        <span className={sectionColors[status]}>{status}</span>
        <span className="text-muted-foreground text-xs">({tasks.length})</span>
        {showWarning && (
          <Badge variant="destructive" className="text-xs ml-auto">
            +5 tareas
          </Badge>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-1 pt-1">
          {tasks.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">Sin tareas</p>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={onComplete}
                onChangeStatus={onChangeStatus}
                onOpenSheet={onOpenSheet}
              />
            ))
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
