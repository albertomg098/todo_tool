"use client";

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
import { useTranslations } from "next-intl";
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
  const t = useTranslations("blockedDialog");
  const tStatus = useTranslations("status");

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
            {t("title", { target: tStatus(targetStatus) })}
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 py-4">
          <label className="text-sm font-medium mb-1.5 block">
            {t("label")}
          </label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("placeholder")}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          />
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={onClose}>{t("cancel")}</Button>
          <Button onClick={handleConfirm} disabled={!notes.trim()}>
            {t("confirm")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
