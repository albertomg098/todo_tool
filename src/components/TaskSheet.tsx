"use client";

import { useState, useEffect, type FormEvent, type KeyboardEvent } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import type { Task, Category } from "@/types/task";

const categories: Category[] = ["Cliente", "Producto", "Admin"];

interface TaskSheetProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  initialTitle?: string;
  onSave: (data: { title: string; category: Category; notes?: string }) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskSheet({
  open,
  onClose,
  task,
  initialTitle,
  onSave,
  onDelete,
}: TaskSheetProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Producto");
  const [notes, setNotes] = useState("");
  const t = useTranslations("taskSheet");
  const tCat = useTranslations("category");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setCategory(task.category);
      setNotes(task.notes ?? "");
    } else {
      setTitle(initialTitle ?? "");
      setCategory("Producto");
      setNotes("");
    }
  }, [task, initialTitle, open]);

  function handleSave(e?: FormEvent) {
    e?.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), category, notes: notes.trim() || undefined });
    onClose();
  }

  function handleCategoryKeyDown(e: KeyboardEvent, cat: Category) {
    const idx = categories.indexOf(cat);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = categories[(idx + 1) % categories.length];
      setCategory(next);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = categories[(idx - 1 + categories.length) % categories.length];
      setCategory(prev);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCategory(cat);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{task ? t("editTitle") : t("newTitle")}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSave}>
          <div className="space-y-4 px-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("titleLabel")}</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("titlePlaceholder")}
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("categoryLabel")}</label>
              <div className="flex gap-2" role="radiogroup" aria-label={t("categoryLabel")}>
                {categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    className="cursor-pointer"
                    role="radio"
                    aria-checked={category === cat}
                    tabIndex={category === cat ? 0 : -1}
                    onClick={() => setCategory(cat)}
                    onKeyDown={(e) => handleCategoryKeyDown(e, cat)}
                  >
                    {tCat(cat)}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("noteLabel")}</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("notePlaceholder")}
              />
            </div>
          </div>
          <SheetFooter>
            {task && onDelete && task.status !== "DONE" && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  onDelete(task.id);
                  onClose();
                }}
              >
                {t("delete")}
              </Button>
            )}
            <Button type="submit">
              {task ? t("save") : t("create")}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
