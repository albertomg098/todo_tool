"use client";

import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Plus, X, ChevronDown, Pencil, Trash2, Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface IntentionsEditorProps {
  intentions: string[];
  onSave: (intentions: string[]) => void;
}

export function IntentionsEditor({ intentions, onSave }: IntentionsEditorProps) {
  const [items, setItems] = useState<string[]>([""]);
  const [savedMsg, setSavedMsg] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [listOpen, setListOpen] = useState(true);
  const t = useTranslations("intentions");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Reset input fields when saved intentions change externally (week navigation)
  const intentionsKey = JSON.stringify(intentions);
  useEffect(() => {
    setItems([""]);
    setEditingIndex(null);
    setSavedMsg(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intentionsKey]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleChange(index: number, value: string) {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  }

  function handleAdd() {
    if (intentions.length + items.filter((s) => s.trim()).length >= 5) return;
    setItems([...items, ""]);
  }

  function handleRemove(index: number) {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function handleSave() {
    const newItems = items.map((s) => s.trim()).filter(Boolean);
    if (newItems.length === 0) return;
    const merged = [...intentions, ...newItems];
    onSave(merged);
    setItems([""]);
    setSavedMsg(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSavedMsg(false), 2500);
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

  function handleDeleteIntention(index: number) {
    const updated = intentions.filter((_, i) => i !== index);
    onSave(updated.length > 0 ? updated : []);
  }

  function startEdit(index: number) {
    setEditingIndex(index);
    setEditValue(intentions[index]);
  }

  function confirmEdit() {
    if (editingIndex === null) return;
    const trimmed = editValue.trim();
    if (!trimmed) return;
    const updated = [...intentions];
    updated[editingIndex] = trimmed;
    onSave(updated);
    setEditingIndex(null);
    setEditValue("");
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditValue("");
  }

  const canAddMore = intentions.length + items.filter((s) => s.trim()).length < 5;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Input fields for new intentions */}
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              placeholder={t("placeholder", { num: intentions.length + i + 1 })}
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
          {canAddMore && (
            <Button variant="outline" size="sm" onClick={handleAdd} className="cursor-pointer">
              <Plus className="h-4 w-4 mr-1" />
              {t("add")}
            </Button>
          )}
          <Button size="sm" onClick={handleSave} className="cursor-pointer">
            {t("save")}
          </Button>
          {savedMsg && (
            <span className="text-xs text-green-600 font-medium animate-in fade-in">
              {t("saved")}
            </span>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            {t("hint")}
          </span>
        </div>

        {/* Saved intentions list (collapsible) */}
        {intentions.length > 0 && (
          <Collapsible open={listOpen} onOpenChange={setListOpen}>
            <CollapsibleTrigger className="flex items-center gap-1 pt-2 text-sm font-medium cursor-pointer w-full">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${listOpen ? "" : "-rotate-90"}`}
              />
              {t("savedList", { count: intentions.length })}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="mt-2 space-y-1">
                {intentions.map((intention, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
                  >
                    {editingIndex === i ? (
                      <>
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") confirmEdit();
                            if (e.key === "Escape") cancelEdit();
                          }}
                          className="text-sm h-7 flex-1"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 h-7 w-7 cursor-pointer"
                          onClick={confirmEdit}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 h-7 w-7 cursor-pointer"
                          onClick={cancelEdit}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1">{intention}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 h-7 w-7 cursor-pointer"
                          onClick={() => startEdit(i)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 h-7 w-7 text-destructive cursor-pointer"
                          onClick={() => handleDeleteIntention(i)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
