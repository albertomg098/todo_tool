"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { tasks, weekPlans } from "@/db/schema";
import type { Category, Status } from "@/types/task";

interface LocalTask {
  id: string;
  title: string;
  status: Status;
  category: Category;
  notes?: string;
  createdAt: string;
  completedAt?: string;
  daySlot?: string;
  weekSlot: string;
}

interface LocalWeekPlan {
  weekSlot: string;
  intentions: string[];
  createdAt: string;
  updatedAt: string;
}

export async function importLocalData(
  localTasks: LocalTask[],
  localPlans: LocalWeekPlan[]
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Import tasks
  if (localTasks.length > 0) {
    await db.insert(tasks).values(
      localTasks.map((t) => ({
        userId,
        title: t.title,
        status: t.status,
        category: t.category,
        notes: t.notes,
        createdAt: new Date(t.createdAt),
        completedAt: t.completedAt ? new Date(t.completedAt) : null,
        daySlot: t.daySlot,
        weekSlot: t.weekSlot,
      }))
    );
  }

  // Import week plans
  for (const p of localPlans) {
    await db.insert(weekPlans).values({
      userId,
      weekSlot: p.weekSlot,
      intentions: p.intentions,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    });
  }

  return { tasksImported: localTasks.length, plansImported: localPlans.length };
}
