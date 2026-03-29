"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import * as queries from "@/db/queries";
import type { Category, Status } from "@/types/task";

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function fetchTasksByDay(daySlot: string) {
  const userId = await requireUserId();
  return queries.getTasksByDay(db, userId, daySlot);
}

export async function fetchTasksByWeek(weekSlot: string) {
  const userId = await requireUserId();
  return queries.getTasksByWeek(db, userId, weekSlot);
}

export async function fetchBacklogTasks(weekSlot: string) {
  const userId = await requireUserId();
  return queries.getBacklogTasks(db, userId, weekSlot);
}

export async function addTask(
  title: string,
  category: Category | undefined,
  notes: string | undefined,
  daySlot: string | undefined,
  weekSlot: string
) {
  const userId = await requireUserId();
  return queries.createTask(db, userId, {
    title,
    category,
    notes,
    daySlot,
    weekSlot,
  });
}

export async function changeTaskStatus(
  taskId: string,
  newStatus: Status,
  notes?: string
) {
  const userId = await requireUserId();
  return queries.updateTaskStatus(db, userId, taskId, newStatus, notes);
}

export async function editTask(
  taskId: string,
  updates: { title?: string; category?: Category; notes?: string }
) {
  const userId = await requireUserId();
  return queries.updateTask(db, userId, taskId, updates);
}

export async function moveTask(taskId: string, targetDaySlot: string) {
  const userId = await requireUserId();
  return queries.moveTaskToDay(db, userId, taskId, targetDaySlot);
}

export async function removeTask(taskId: string) {
  const userId = await requireUserId();
  return queries.deleteTask(db, userId, taskId);
}
