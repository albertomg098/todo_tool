export type Status = "TODO" | "TODAY" | "DONE" | "BLOCKED";
export type Category = "Cliente" | "Producto" | "Admin";

export interface Task {
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

export interface WeekPlan {
  weekSlot: string;
  intentions: string[];
  createdAt: string;
  updatedAt: string;
}
