import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Status } from "@/types/task";

interface BlockedNoteDialogProps {
  open: boolean;
  targetStatus: Status;
  onClose: () => void;
  onConfirm: (notes: string) => void;
}

export function BlockedNoteDialog({
  open,
  targetStatus,
  onClose,
  onConfirm,
}: BlockedNoteDialogProps) {
  const [notes, setNotes] = useState("");

  function handleConfirm() {
    if (!notes.trim()) return;
    onConfirm(notes.trim());
    setNotes("");
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            Mover de BLOCKED a {targetStatus}
          </SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <label className="text-sm font-medium">
            Añade una nota explicando la resolución
          </label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="¿Qué cambió?"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          />
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={!notes.trim()}>
            Confirmar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
