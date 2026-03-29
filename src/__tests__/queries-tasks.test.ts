import { describe, it, expect, beforeEach } from "vitest";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import {
  createTask,
  getTasksByDay,
  getTasksByWeek,
  getBacklogTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
  moveTaskToDay,
} from "@/db/queries";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

const TEST_USER_A = "test-user-tasks-a";
const TEST_USER_B = "test-user-tasks-b";

beforeEach(async () => {
  await db
    .delete(schema.tasks)
    .where(eq(schema.tasks.userId, TEST_USER_A));
  await db
    .delete(schema.tasks)
    .where(eq(schema.tasks.userId, TEST_USER_B));
});

describe("task queries", () => {
  it("createTask creates a task and returns it with correct fields", async () => {
    const task = await createTask(db, TEST_USER_A, {
      title: "Test task",
      category: "Cliente",
      daySlot: "2026-03-29",
      weekSlot: "2026-W13",
    });

    expect(task.id).toBeDefined();
    expect(task.title).toBe("Test task");
    expect(task.status).toBe("TODO");
    expect(task.category).toBe("Cliente");
    expect(task.userId).toBe(TEST_USER_A);
    expect(task.daySlot).toBe("2026-03-29");
    expect(task.weekSlot).toBe("2026-W13");
    expect(task.createdAt).toBeDefined();
  });

  it("getTasksByDay returns only tasks for given userId + daySlot", async () => {
    await createTask(db, TEST_USER_A, {
      title: "Day task",
      daySlot: "2026-03-29",
      weekSlot: "2026-W13",
    });
    await createTask(db, TEST_USER_A, {
      title: "Other day",
      daySlot: "2026-03-30",
      weekSlot: "2026-W14",
    });

    const tasks = await getTasksByDay(db, TEST_USER_A, "2026-03-29");
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe("Day task");
  });

  it("getTasksByWeek returns only tasks for given userId + weekSlot", async () => {
    await createTask(db, TEST_USER_A, {
      title: "Week task",
      daySlot: "2026-03-29",
      weekSlot: "2026-W13",
    });
    await createTask(db, TEST_USER_A, {
      title: "Other week",
      daySlot: "2026-04-06",
      weekSlot: "2026-W15",
    });

    const tasks = await getTasksByWeek(db, TEST_USER_A, "2026-W13");
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe("Week task");
  });

  it("getBacklogTasks returns tasks with no daySlot for given week", async () => {
    await createTask(db, TEST_USER_A, {
      title: "Backlog task",
      weekSlot: "2026-W13",
    });
    await createTask(db, TEST_USER_A, {
      title: "Scheduled task",
      daySlot: "2026-03-29",
      weekSlot: "2026-W13",
    });

    const tasks = await getBacklogTasks(db, TEST_USER_A, "2026-W13");
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe("Backlog task");
  });

  it("updateTask updates title, category, notes", async () => {
    const task = await createTask(db, TEST_USER_A, {
      title: "Original",
      weekSlot: "2026-W13",
    });

    const updated = await updateTask(db, TEST_USER_A, task.id, {
      title: "Updated",
      category: "Admin",
      notes: "Some note",
    });

    expect(updated).not.toBeNull();
    expect(updated!.title).toBe("Updated");
    expect(updated!.category).toBe("Admin");
    expect(updated!.notes).toBe("Some note");
  });

  it("updateTaskStatus validates transition and updates status", async () => {
    const task = await createTask(db, TEST_USER_A, {
      title: "Status test",
      weekSlot: "2026-W13",
    });

    const result = await updateTaskStatus(db, TEST_USER_A, task.id, "TODAY");
    expect(result.error).toBeUndefined();

    const tasks = await getTasksByWeek(db, TEST_USER_A, "2026-W13");
    expect(tasks[0].status).toBe("TODAY");
  });

  it("updateTaskStatus rejects invalid transitions", async () => {
    const task = await createTask(db, TEST_USER_A, {
      title: "Invalid test",
      weekSlot: "2026-W13",
    });

    const result = await updateTaskStatus(db, TEST_USER_A, task.id, "DONE");
    expect(result.error).toBeDefined();
    expect(result.error).toContain("Cannot transition");
  });

  it("updateTaskStatus sets completedAt when transitioning to DONE", async () => {
    const task = await createTask(db, TEST_USER_A, {
      title: "Complete test",
      weekSlot: "2026-W13",
    });

    await updateTaskStatus(db, TEST_USER_A, task.id, "TODAY");
    await updateTaskStatus(db, TEST_USER_A, task.id, "DONE");

    const tasks = await getTasksByWeek(db, TEST_USER_A, "2026-W13");
    expect(tasks[0].status).toBe("DONE");
    expect(tasks[0].completedAt).toBeDefined();
  });

  it("deleteTask removes task for that user only", async () => {
    const task = await createTask(db, TEST_USER_A, {
      title: "Delete me",
      weekSlot: "2026-W13",
    });

    await deleteTask(db, TEST_USER_A, task.id);

    const tasks = await getTasksByWeek(db, TEST_USER_A, "2026-W13");
    expect(tasks).toHaveLength(0);
  });

  it("user scoping: user A cannot see user B's tasks", async () => {
    await createTask(db, TEST_USER_A, {
      title: "A's task",
      daySlot: "2026-03-29",
      weekSlot: "2026-W13",
    });
    await createTask(db, TEST_USER_B, {
      title: "B's task",
      daySlot: "2026-03-29",
      weekSlot: "2026-W13",
    });

    const tasksA = await getTasksByDay(db, TEST_USER_A, "2026-03-29");
    const tasksB = await getTasksByDay(db, TEST_USER_B, "2026-03-29");

    expect(tasksA).toHaveLength(1);
    expect(tasksA[0].title).toBe("A's task");
    expect(tasksB).toHaveLength(1);
    expect(tasksB[0].title).toBe("B's task");
  });

  it("moveTaskToDay updates daySlot", async () => {
    const task = await createTask(db, TEST_USER_A, {
      title: "Move me",
      daySlot: "2026-03-29",
      weekSlot: "2026-W13",
    });

    await moveTaskToDay(db, TEST_USER_A, task.id, "2026-03-30");

    const oldDay = await getTasksByDay(db, TEST_USER_A, "2026-03-29");
    const newDay = await getTasksByDay(db, TEST_USER_A, "2026-03-30");
    expect(oldDay).toHaveLength(0);
    expect(newDay).toHaveLength(1);
    expect(newDay[0].title).toBe("Move me");
  });
});
