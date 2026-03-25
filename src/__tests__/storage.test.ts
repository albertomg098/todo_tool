import { describe, it, expect, beforeEach } from "vitest";
import {
  loadTasks,
  saveTasks,
  saveTask,
  deleteTask,
  getTasksByDay,
  getTasksByWeek,
  getWeekPlan,
  saveWeekPlan,
} from "@/lib/storage";
import type { Task, WeekPlan } from "@/types/task";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "test-1",
    title: "Test task",
    status: "TODO",
    category: "Producto",
    createdAt: "2026-03-25T10:00:00Z",
    daySlot: "2026-03-25",
    weekSlot: "2026-W13",
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe("tasks CRUD", () => {
  it("loads empty array when no data", () => {
    expect(loadTasks()).toEqual([]);
  });

  it("saves and loads tasks", () => {
    const tasks = [makeTask()];
    saveTasks(tasks);
    expect(loadTasks()).toEqual(tasks);
  });

  it("saveTask adds new task", () => {
    saveTask(makeTask({ id: "a" }));
    expect(loadTasks()).toHaveLength(1);
  });

  it("saveTask updates existing task", () => {
    saveTask(makeTask({ id: "a", title: "Old" }));
    saveTask(makeTask({ id: "a", title: "New" }));
    const tasks = loadTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe("New");
  });

  it("deleteTask removes task", () => {
    saveTask(makeTask({ id: "a" }));
    saveTask(makeTask({ id: "b" }));
    deleteTask("a");
    const tasks = loadTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe("b");
  });
});

describe("filtering", () => {
  it("getTasksByDay filters correctly", () => {
    saveTask(makeTask({ id: "a", daySlot: "2026-03-25" }));
    saveTask(makeTask({ id: "b", daySlot: "2026-03-26" }));
    expect(getTasksByDay("2026-03-25")).toHaveLength(1);
    expect(getTasksByDay("2026-03-25")[0].id).toBe("a");
  });

  it("getTasksByWeek filters correctly", () => {
    saveTask(makeTask({ id: "a", weekSlot: "2026-W13" }));
    saveTask(makeTask({ id: "b", weekSlot: "2026-W14" }));
    expect(getTasksByWeek("2026-W13")).toHaveLength(1);
  });
});

describe("week plans", () => {
  it("returns undefined for missing plan", () => {
    expect(getWeekPlan("2026-W13")).toBeUndefined();
  });

  it("saves and loads week plan", () => {
    const plan: WeekPlan = {
      weekSlot: "2026-W13",
      intentions: ["Ship feature", "Review PRs"],
      createdAt: "2026-03-23T10:00:00Z",
      updatedAt: "2026-03-23T10:00:00Z",
    };
    saveWeekPlan(plan);
    expect(getWeekPlan("2026-W13")).toEqual(plan);
  });

  it("updates existing week plan", () => {
    const plan: WeekPlan = {
      weekSlot: "2026-W13",
      intentions: ["A"],
      createdAt: "2026-03-23T10:00:00Z",
      updatedAt: "2026-03-23T10:00:00Z",
    };
    saveWeekPlan(plan);
    saveWeekPlan({ ...plan, intentions: ["A", "B"], updatedAt: "2026-03-24T10:00:00Z" });
    const loaded = getWeekPlan("2026-W13");
    expect(loaded?.intentions).toEqual(["A", "B"]);
  });
});
