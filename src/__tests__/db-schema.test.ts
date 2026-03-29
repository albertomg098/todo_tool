import { describe, it, expect } from "vitest";
import { getTableColumns } from "drizzle-orm";
import { tasks, weekPlans, statusEnum, categoryEnum } from "@/db/schema";

describe("db schema", () => {
  describe("tasks table", () => {
    it("has all required columns", () => {
      const columns = getTableColumns(tasks);
      const columnNames = Object.keys(columns);

      expect(columnNames).toContain("id");
      expect(columnNames).toContain("userId");
      expect(columnNames).toContain("title");
      expect(columnNames).toContain("status");
      expect(columnNames).toContain("category");
      expect(columnNames).toContain("notes");
      expect(columnNames).toContain("createdAt");
      expect(columnNames).toContain("completedAt");
      expect(columnNames).toContain("daySlot");
      expect(columnNames).toContain("weekSlot");
    });
  });

  describe("weekPlans table", () => {
    it("has all required columns", () => {
      const columns = getTableColumns(weekPlans);
      const columnNames = Object.keys(columns);

      expect(columnNames).toContain("id");
      expect(columnNames).toContain("userId");
      expect(columnNames).toContain("weekSlot");
      expect(columnNames).toContain("intentions");
      expect(columnNames).toContain("createdAt");
      expect(columnNames).toContain("updatedAt");
    });
  });

  describe("enums", () => {
    it("status enum has correct values", () => {
      expect(statusEnum.enumValues).toEqual([
        "TODO",
        "TODAY",
        "DONE",
        "BLOCKED",
      ]);
    });

    it("category enum has correct values", () => {
      expect(categoryEnum.enumValues).toEqual([
        "Cliente",
        "Producto",
        "Admin",
      ]);
    });
  });
});
