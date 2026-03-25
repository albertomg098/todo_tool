import { useState, useEffect } from "react";
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
import type { Task, Category } from "@/types/task";

const categories: Category[] = ["Cliente", "Producto", "Admin"];

interface TaskSheetProps {
  open: boolean;
  onClose: () => void;
  /** If set, editing existing task. If null, creating new with this title. */
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

  function handleSave() {
    if (!title.trim()) return;
    onSave({ title: title.trim(), category, notes: notes.trim() || undefined });
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{task ? "Editar tarea" : "Nueva tarea"}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="¿Qué necesitas hacer?"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium">Categoría</label>
            <div className="flex gap-2 mt-1">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Nota</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nota opcional"
            />
          </div>
        </div>
        <SheetFooter>
          {task && onDelete && task.status !== "DONE" && (
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
            >
              Eliminar
            </Button>
          )}
          <Button onClick={handleSave}>
            {task ? "Guardar" : "Crear"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
