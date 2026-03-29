"use client";

import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface TaskInputProps {
  onAdd: (title: string) => void;
  onAddWithDetails: (title: string) => void;
}

export function TaskInput({ onAdd, onAddWithDetails }: TaskInputProps) {
  const [value, setValue] = useState("");
  const t = useTranslations("taskInput");

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && value.trim()) {
      if (e.shiftKey) {
        e.preventDefault();
        onAddWithDetails(value.trim());
      } else {
        onAdd(value.trim());
      }
      setValue("");
    }
  }

  return (
    <div className="relative mb-4">
      <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("placeholder")}
        className="pl-9"
      />
    </div>
  );
}
