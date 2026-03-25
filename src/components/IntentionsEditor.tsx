import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface IntentionsEditorProps {
  intentions: string[];
  onSave: (intentions: string[]) => void;
}

export function IntentionsEditor({ intentions, onSave }: IntentionsEditorProps) {
  const [items, setItems] = useState<string[]>(
    intentions.length > 0 ? [...intentions] : [""],
  );

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

  return (
    <Card className="mx-4 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Intenciones de la semana (3–5)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder={`Intención ${i + 1}`}
              className="text-sm"
            />
            {items.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-9 w-9"
                onClick={() => handleRemove(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          {items.length < 5 && (
            <Button variant="outline" size="sm" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-1" />
              Añadir
            </Button>
          )}
          <Button size="sm" onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
