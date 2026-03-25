import type { Task, WeekPlan } from "@/types/task";

const TASKS_KEY = "daily-stack-tasks";
const WEEK_PLANS_KEY = "daily-stack-week-plans";

// --- Tasks ---

export function loadTasks(): Task[] {
  const raw = localStorage.getItem(TASKS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function getTasksByDay(daySlot: string): Task[] {
  return loadTasks().filter((t) => t.daySlot === daySlot);
}

export function getTasksByWeek(weekSlot: string): Task[] {
  return loadTasks().filter((t) => t.weekSlot === weekSlot);
}

export function saveTask(task: Task): void {
  const tasks = loadTasks();
  const idx = tasks.findIndex((t) => t.id === task.id);
  if (idx >= 0) {
    tasks[idx] = task;
  } else {
    tasks.push(task);
  }
  saveTasks(tasks);
}

export function deleteTask(id: string): void {
  saveTasks(loadTasks().filter((t) => t.id !== id));
}

export function getBacklogTasks(weekSlot: string): Task[] {
  return loadTasks().filter((t) => t.weekSlot === weekSlot && !t.daySlot);
}

// --- Week Plans ---

export function loadWeekPlans(): WeekPlan[] {
  const raw = localStorage.getItem(WEEK_PLANS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as WeekPlan[];
  } catch {
    return [];
  }
}

export function getWeekPlan(weekSlot: string): WeekPlan | undefined {
  return loadWeekPlans().find((w) => w.weekSlot === weekSlot);
}

export function saveWeekPlan(plan: WeekPlan): void {
  const plans = loadWeekPlans();
  const idx = plans.findIndex((p) => p.weekSlot === plan.weekSlot);
  if (idx >= 0) {
    plans[idx] = plan;
  } else {
    plans.push(plan);
  }
  localStorage.setItem(WEEK_PLANS_KEY, JSON.stringify(plans));
}
