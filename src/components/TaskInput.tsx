import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface TaskInputProps {
  onAdd: (title: string) => void;
  onAddWithDetails: (title: string) => void;
}

export function TaskInput({ onAdd, onAddWithDetails }: TaskInputProps) {
  const [value, setValue] = useState("");

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || !value.trim()) return;

    if (e.shiftKey) {
      e.preventDefault();
      onAddWithDetails(value.trim());
      setValue("");
    } else {
      e.preventDefault();
      onAdd(value.trim());
      setValue("");
    }
  }

  return (
    <div className="relative mx-4 mb-4">
      <Plus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Añadir tarea — Enter para crear, Shift+Enter para detalles"
        className="pl-9"
      />
    </div>
  );
}
