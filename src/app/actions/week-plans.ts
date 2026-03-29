"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import * as queries from "@/db/queries";

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function fetchWeekPlan(weekSlot: string) {
  const userId = await requireUserId();
  return queries.getWeekPlan(db, userId, weekSlot);
}

export async function saveWeekIntentions(
  weekSlot: string,
  intentions: string[]
) {
  const userId = await requireUserId();
  return queries.upsertWeekPlan(db, userId, weekSlot, intentions);
}
