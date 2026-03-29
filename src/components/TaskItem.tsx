"use client";

import type { Task, Status } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { StatusButton } from "./StatusButton";
import { Circle, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

const categoryVariant: Record<string, "default" | "secondary" | "outline"> = {
  Cliente: "default",
  Producto: "secondary",
  Admin: "outline",
};

interface TaskItemProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onChangeStatus: (taskId: string, status: Status) => void;
  onOpenSheet: (task: Task) => void;
}

export function TaskItem({ task, onComplete, onChangeStatus, onOpenSheet }: TaskItemProps) {
  const isDone = task.status === "DONE";
  const isBlocked = task.status === "BLOCKED";
  const tCat = useTranslations("category");

  return (
    <div
      className={`rounded-md border px-3 py-2 hover:bg-muted/30 transition-colors ${isDone ? "opacity-60" : ""}`}
    >
      {/* Row 1: checkbox + title + (on sm+) badge + buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (!isDone && task.status === "TODAY") onComplete(task.id);
          }}
          disabled={isDone || task.status !== "TODAY"}
          className="shrink-0 cursor-pointer disabled:cursor-default"
        >
          {isDone ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : isBlocked ? (
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          ) : (
            <Circle className="h-5 w-5 text-slate-400" />
          )}
        </button>

        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onOpenSheet(task)}
        >
          <span className={`text-sm ${isDone ? "line-through text-muted-foreground" : ""}`}>
            {task.title}
          </span>
        </div>

        <Badge variant={categoryVariant[task.category]} className="shrink-0 text-xs hidden sm:inline-flex">
          {tCat(task.category)}
        </Badge>

        <div className="hidden sm:flex">
          <StatusButton
            status={task.status}
            onChangeStatus={(s) => onChangeStatus(task.id, s)}
          />
        </div>
      </div>

      {/* Blocked note */}
      {isBlocked && task.notes && (
        <p className="text-xs text-yellow-700 mt-1 ml-7 truncate">{task.notes}</p>
      )}

      {/* Row 2 (mobile only): badge + buttons */}
      <div className="flex items-center justify-between mt-1 ml-7 sm:hidden">
        <Badge variant={categoryVariant[task.category]} className="text-xs">
          {tCat(task.category)}
        </Badge>
        <StatusButton
          status={task.status}
          onChangeStatus={(s) => onChangeStatus(task.id, s)}
        />
      </div>
    </div>
  );
}
