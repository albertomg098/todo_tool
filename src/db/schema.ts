import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
  "TODO",
  "TODAY",
  "DONE",
  "BLOCKED",
]);

export const categoryEnum = pgEnum("category", [
  "Cliente",
  "Producto",
  "Admin",
]);

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    status: statusEnum("status").notNull().default("TODO"),
    category: categoryEnum("category").notNull().default("Producto"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
    daySlot: varchar("day_slot", { length: 10 }),
    weekSlot: varchar("week_slot", { length: 8 }).notNull(),
  },
  (table) => [
    index("tasks_user_day_idx").on(table.userId, table.daySlot),
    index("tasks_user_week_idx").on(table.userId, table.weekSlot),
  ]
);

export const weekPlans = pgTable(
  "week_plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    weekSlot: varchar("week_slot", { length: 8 }).notNull(),
    intentions: jsonb("intentions").$type<string[]>().notNull().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("week_plans_user_week_idx").on(table.userId, table.weekSlot),
  ]
);
