"use client";

import { useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface IntentionsEditorProps {
  intentions: string[];
  onSave: (intentions: string[]) => void;
}

export function IntentionsEditor({ intentions, onSave }: IntentionsEditorProps) {
  const [items, setItems] = useState<string[]>(
    intentions.length > 0 ? [...intentions] : [""],
  );
  const t = useTranslations("intentions");

  function handleChange(index: number, value: string) {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  }

  function handleAdd() {
    if (items.length >= 5) return;
    setItems([...items, ""]);
  }

  function handleRemove(index: number) {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function handleSave() {
    const filtered = items.map((s) => s.trim()).filter(Boolean);
    if (filtered.length === 0) return;
    onSave(filtered);
  }

  function handleKeyDown(e: KeyboardEvent, index: number) {
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      if (index === items.length - 1 && items[index].trim()) {
        handleAdd();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              placeholder={t("placeholder", { num: i + 1 })}
              className="text-sm"
            />
            {items.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-9 w-9 cursor-pointer"
                onClick={() => handleRemove(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1">
          {items.length < 5 && (
            <Button variant="outline" size="sm" onClick={handleAdd} className="cursor-pointer">
              <Plus className="h-4 w-4 mr-1" />
              {t("add")}
            </Button>
          )}
          <Button size="sm" onClick={handleSave} className="cursor-pointer">
            {t("save")}
          </Button>
          <span className="text-xs text-muted-foreground ml-auto">
            {t("hint")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
