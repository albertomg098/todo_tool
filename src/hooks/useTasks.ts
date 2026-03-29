import { useState, useCallback, useEffect } from "react";
import type { Task, Status, Category } from "@/types/task";
import {
  fetchTasksByDay,
  addTask as addTaskAction,
  changeTaskStatus,
  editTask,
  moveTask,
  removeTask as removeTaskAction,
} from "@/app/actions/tasks";

export function useTasks(daySlot: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await fetchTasksByDay(daySlot);
    // Map DB rows to Task interface
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
    setTasks(mapped);
    setLoading(false);
  }, [daySlot]);

  useEffect(() => {
    setLoading(true);
    reload();
  }, [reload]);

  const addTask = useCallback(
    async (title: string, category: Category = "Producto", notes?: string) => {
      const { getISOWeekSlot, parseDaySlot } = await import("@/lib/dates");
      const weekSlot = getISOWeekSlot(parseDaySlot(daySlot));
      await addTaskAction(title, category, notes, daySlot, weekSlot);
      await reload();
    },
    [daySlot, reload]
  );

  const updateStatus = useCallback(
    async (taskId: string, newStatus: Status, notes?: string) => {
      const result = await changeTaskStatus(taskId, newStatus, notes);
      if (result.error) return result.error;
      await reload();
      return null;
    },
    [reload]
  );

  const updateTask = useCallback(
    async (
      taskId: string,
      updates: Partial<Pick<Task, "title" | "category" | "notes">>
    ) => {
      await editTask(taskId, updates);
      await reload();
    },
    [reload]
  );

  const moveTaskToDay = useCallback(
    async (taskId: string, targetDaySlot: string) => {
      await moveTask(taskId, targetDaySlot);
      await reload();
    },
    [reload]
  );

  const removeTask = useCallback(
    async (taskId: string) => {
      await removeTaskAction(taskId);
      await reload();
    },
    [reload]
  );

  return {
    tasks,
    loading,
    addTask,
    updateStatus,
    updateTask,
    moveTaskToDay,
    removeTask,
    reload,
  };
}
