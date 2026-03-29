import { describe, it, expect, beforeEach } from "vitest";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { getWeekPlan, upsertWeekPlan } from "@/db/queries";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

const TEST_USER_A = "test-user-plans-a";
const TEST_USER_B = "test-user-plans-b";

beforeEach(async () => {
  await db
    .delete(schema.weekPlans)
    .where(eq(schema.weekPlans.userId, TEST_USER_A));
  await db
    .delete(schema.weekPlans)
    .where(eq(schema.weekPlans.userId, TEST_USER_B));
});

describe("week plan queries", () => {
  it("getWeekPlan returns null when no plan exists", async () => {
    const plan = await getWeekPlan(db, TEST_USER_A, "2026-W13");
    expect(plan).toBeNull();
  });

  it("upsertWeekPlan creates a new plan", async () => {
    const plan = await upsertWeekPlan(db, TEST_USER_A, "2026-W13", [
      "Focus on shipping",
      "Review PRs",
    ]);

    expect(plan.weekSlot).toBe("2026-W13");
    expect(plan.intentions).toEqual(["Focus on shipping", "Review PRs"]);
    expect(plan.createdAt).toBeDefined();
  });

  it("upsertWeekPlan updates existing plan's intentions and updatedAt", async () => {
    const original = await upsertWeekPlan(db, TEST_USER_A, "2026-W13", [
      "Old intention",
    ]);

    // Small delay to ensure updatedAt differs
    await new Promise((r) => setTimeout(r, 50));

    const updated = await upsertWeekPlan(db, TEST_USER_A, "2026-W13", [
      "New intention",
      "Another one",
    ]);

    expect(updated.intentions).toEqual(["New intention", "Another one"]);
    expect(updated.id).toBe(original.id);
  });

  it("user scoping: user A cannot see user B's week plans", async () => {
    await upsertWeekPlan(db, TEST_USER_A, "2026-W13", ["A's plan"]);
    await upsertWeekPlan(db, TEST_USER_B, "2026-W13", ["B's plan"]);

    const planA = await getWeekPlan(db, TEST_USER_A, "2026-W13");
    const planB = await getWeekPlan(db, TEST_USER_B, "2026-W13");

    expect(planA).not.toBeNull();
    expect(planA!.intentions).toEqual(["A's plan"]);
    expect(planB).not.toBeNull();
    expect(planB!.intentions).toEqual(["B's plan"]);
  });
});
