import { eq, and, isNull } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { tasks, weekPlans } from "./schema";
import type * as schemaTypes from "./schema";
import { validateTransition } from "@/lib/state-machine";
import type { Status, Category } from "@/types/task";

type DB = PostgresJsDatabase<typeof schemaTypes>;

// --- Tasks ---

export async function createTask(
  db: DB,
  userId: string,
  data: {
    title: string;
    category?: Category;
    notes?: string;
    daySlot?: string;
    weekSlot: string;
  }
) {
  const [task] = await db
    .insert(tasks)
    .values({
      userId,
      title: data.title,
      category: data.category ?? "Producto",
      notes: data.notes,
      daySlot: data.daySlot,
      weekSlot: data.weekSlot,
    })
    .returning();
  return task;
}

export async function getTasksByDay(db: DB, userId: string, daySlot: string) {
  return db
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.daySlot, daySlot)));
}

export async function getTasksByWeek(
  db: DB,
  userId: string,
  weekSlot: string
) {
  return db
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.weekSlot, weekSlot)));
}

export async function getBacklogTasks(
  db: DB,
  userId: string,
  weekSlot: string
) {
  return db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.weekSlot, weekSlot),
        isNull(tasks.daySlot)
      )
    );
}

export async function updateTask(
  db: DB,
  userId: string,
  taskId: string,
  updates: { title?: string; category?: Category; notes?: string }
) {
  const [updated] = await db
    .update(tasks)
    .set(updates)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .returning();
  return updated ?? null;
}

export async function updateTaskStatus(
  db: DB,
  userId: string,
  taskId: string,
  newStatus: Status,
  notes?: string
): Promise<{ error?: string }> {
  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

  if (!task) return { error: "Task not found" };

  const error = validateTransition(task.status as Status, newStatus, notes);
  if (error) return { error };

  const updateData: Record<string, unknown> = { status: newStatus };
  if (notes !== undefined) updateData.notes = notes;
  if (newStatus === "DONE") updateData.completedAt = new Date();

  await db
    .update(tasks)
    .set(updateData)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

  return {};
}

export async function deleteTask(db: DB, userId: string, taskId: string) {
  await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
}

export async function moveTaskToDay(
  db: DB,
  userId: string,
  taskId: string,
  targetDaySlot: string
) {
  await db
    .update(tasks)
    .set({ daySlot: targetDaySlot })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
}

// --- Week Plans ---

export async function getWeekPlan(
  db: DB,
  userId: string,
  weekSlot: string
) {
  const [plan] = await db
    .select()
    .from(weekPlans)
    .where(
      and(eq(weekPlans.userId, userId), eq(weekPlans.weekSlot, weekSlot))
    );
  return plan ?? null;
}

export async function upsertWeekPlan(
  db: DB,
  userId: string,
  weekSlot: string,
  intentions: string[]
) {
  const existing = await getWeekPlan(db, userId, weekSlot);

  if (existing) {
    const [updated] = await db
      .update(weekPlans)
      .set({ intentions, updatedAt: new Date() })
      .where(eq(weekPlans.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(weekPlans)
    .values({ userId, weekSlot, intentions })
    .returning();
  return created;
}
