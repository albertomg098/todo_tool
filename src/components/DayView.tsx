"use client";

import { useState, useEffect, useCallback } from "react";
import type { Task, Status, Category } from "@/types/task";
import { toDaySlot, addDays, getISOWeekSlot, parseDaySlot, isToday, getYesterday } from "@/lib/dates";
import { useTasks } from "@/hooks/useTasks";
import { useWeekPlan } from "@/hooks/useWeekPlan";
import { fetchTasksByDay } from "@/app/actions/tasks";
import { Separator } from "@/components/ui/separator";
import { DayHeader } from "./DayHeader";
import { WeekIntentionsBanner } from "./WeekIntentionsBanner";
import { TaskInput } from "./TaskInput";
import { TaskSection } from "./TaskSection";
import { TaskSheet } from "./TaskSheet";
import { YesterdayBanner } from "./YesterdayBanner";
import { BlockedNoteDialog } from "./BlockedNoteDialog";
import { DayViewSkeleton } from "./DayViewSkeleton";

const sectionOrder: Status[] = ["TODAY", "TODO", "BLOCKED", "DONE"];

interface DayViewProps {
  initialDay?: string;
}

export function DayView({ initialDay }: DayViewProps) {
  const [currentDay, setCurrentDay] = useState(() => initialDay ?? toDaySlot(new Date()));
  const weekSlot = getISOWeekSlot(parseDaySlot(currentDay));

  const { tasks, loading, addTask, updateStatus, updateTask, moveTaskToDay, removeTask } =
    useTasks(currentDay);
  const { plan } = useWeekPlan(weekSlot);

  // Yesterday's pending tasks
  const [yesterdayTasks, setYesterdayTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (isToday(currentDay)) {
      const yesterday = getYesterday();
      fetchTasksByDay(yesterday).then((data) => {
        const mapped: Task[] = data
          .filter((t) => t.status === "TODAY")
          .map((row) => ({
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
        setYesterdayTasks(mapped);
      });
    } else {
      setYesterdayTasks([]);
    }
  }, [currentDay]);

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetTask, setSheetTask] = useState<Task | null>(null);
  const [sheetInitialTitle, setSheetInitialTitle] = useState<string>("");

  // Blocked note dialog state
  const [blockedDialog, setBlockedDialog] = useState<{
    taskId: string;
    targetStatus: Status;
  } | null>(null);

  const handlePrev = () => setCurrentDay((d) => addDays(d, -1));
  const handleNext = () => setCurrentDay((d) => addDays(d, 1));

  const handleAdd = useCallback(
    (title: string) => {
      addTask(title);
    },
    [addTask],
  );

  const handleAddWithDetails = useCallback(
    (title: string) => {
      setSheetTask(null);
      setSheetInitialTitle(title);
      setSheetOpen(true);
    },
    [],
  );

  const handleComplete = useCallback(
    (taskId: string) => {
      updateStatus(taskId, "DONE");
    },
    [updateStatus],
  );

  const handleChangeStatus = useCallback(
    (taskId: string, newStatus: Status) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      if (task.status === "BLOCKED" && (newStatus === "TODO" || newStatus === "TODAY")) {
        setBlockedDialog({ taskId, targetStatus: newStatus });
        return;
      }

      updateStatus(taskId, newStatus);
    },
    [tasks, updateStatus],
  );

  const handleOpenSheet = useCallback((task: Task) => {
    setSheetTask(task);
    setSheetInitialTitle("");
    setSheetOpen(true);
  }, []);

  const handleSheetSave = useCallback(
    (data: { title: string; category: Category; notes?: string }) => {
      if (sheetTask) {
        updateTask(sheetTask.id, data);
      } else {
        addTask(data.title, data.category, data.notes);
      }
    },
    [sheetTask, updateTask, addTask],
  );

  const handleMoveYesterday = useCallback(async () => {
    for (const task of yesterdayTasks) {
      await moveTaskToDay(task.id, currentDay);
    }
    setYesterdayTasks([]);
  }, [yesterdayTasks, currentDay, moveTaskToDay]);

  const handleBlockedConfirm = useCallback(
    (notes: string) => {
      if (!blockedDialog) return;
      updateStatus(blockedDialog.taskId, blockedDialog.targetStatus, notes);
      setBlockedDialog(null);
    },
    [blockedDialog, updateStatus],
  );

  const grouped = sectionOrder.map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status),
  }));

  if (loading) {
    return <DayViewSkeleton />;
  }

  return (
    <div>
      <DayHeader daySlot={currentDay} onPrev={handlePrev} onNext={handleNext} />
      <Separator />

      <div className="mt-4">
        <YesterdayBanner tasks={yesterdayTasks} onMoveToToday={handleMoveYesterday} />

        {plan && <WeekIntentionsBanner intentions={plan.intentions} />}

        <TaskInput onAdd={handleAdd} onAddWithDetails={handleAddWithDetails} />
      </div>

      <Separator className="my-4" />

      {grouped.map(({ status, tasks: sectionTasks }) => (
        <TaskSection
          key={status}
          status={status}
          tasks={sectionTasks}
          defaultOpen={status !== "DONE"}
          onComplete={handleComplete}
          onChangeStatus={handleChangeStatus}
          onOpenSheet={handleOpenSheet}
        />
      ))}

      <TaskSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        task={sheetTask}
        initialTitle={sheetInitialTitle}
        onSave={handleSheetSave}
        onDelete={removeTask}
      />

      <BlockedNoteDialog
        open={blockedDialog !== null}
        targetStatus={blockedDialog?.targetStatus ?? "TODO"}
        onClose={() => setBlockedDialog(null)}
        onConfirm={handleBlockedConfirm}
      />
    </div>
  );
}
