import { useState, useCallback } from "react";
import { v4 as uuid } from "uuid";
import type { Task, Status, Category } from "@/types/task";
import { getISOWeekSlot, parseDaySlot } from "@/lib/dates";
import { validateTransition } from "@/lib/state-machine";
import * as storage from "@/lib/storage";

export function useTasks(daySlot: string) {
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasksByDay(daySlot));

  const reload = useCallback(() => {
    setTasks(storage.getTasksByDay(daySlot));
  }, [daySlot]);

  const addTask = useCallback(
    (title: string, category: Category = "Producto", notes?: string) => {
      const task: Task = {
        id: uuid(),
        title,
        status: "TODO",
        category,
        notes,
        createdAt: new Date().toISOString(),
        daySlot,
        weekSlot: getISOWeekSlot(parseDaySlot(daySlot)),
      };
      storage.saveTask(task);
      setTasks(storage.getTasksByDay(daySlot));
      return task;
    },
    [daySlot],
  );

  const updateStatus = useCallback(
    (taskId: string, newStatus: Status, notes?: string) => {
      const allTasks = storage.loadTasks();
      const task = allTasks.find((t) => t.id === taskId);
      if (!task) return;

      const error = validateTransition(task.status, newStatus, notes ?? task.notes);
      if (error) return error;

      task.status = newStatus;
      if (newStatus === "DONE") {
        task.completedAt = new Date().toISOString();
      }
      if (notes !== undefined) {
        task.notes = notes;
      }
      storage.saveTask(task);
      setTasks(storage.getTasksByDay(daySlot));
      return null;
    },
    [daySlot],
  );

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Pick<Task, "title" | "category" | "notes">>) => {
      const allTasks = storage.loadTasks();
      const task = allTasks.find((t) => t.id === taskId);
      if (!task) return;
      Object.assign(task, updates);
      storage.saveTask(task);
      setTasks(storage.getTasksByDay(daySlot));
    },
    [daySlot],
  );

  const moveTaskToDay = useCallback(
    (taskId: string, targetDaySlot: string) => {
      const allTasks = storage.loadTasks();
      const task = allTasks.find((t) => t.id === taskId);
      if (!task) return;
      task.daySlot = targetDaySlot;
      task.weekSlot = getISOWeekSlot(parseDaySlot(targetDaySlot));
      storage.saveTask(task);
      setTasks(storage.getTasksByDay(daySlot));
    },
    [daySlot],
  );

  const removeTask = useCallback(
    (taskId: string) => {
      storage.deleteTask(taskId);
      setTasks(storage.getTasksByDay(daySlot));
    },
    [daySlot],
  );

  return { tasks, addTask, updateStatus, updateTask, moveTaskToDay, removeTask, reload };
}
