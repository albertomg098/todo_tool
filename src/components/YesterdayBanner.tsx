"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import type { Task } from "@/types/task";

interface YesterdayBannerProps {
  tasks: Task[];
  onMoveToToday: () => void;
}

export function YesterdayBanner({ tasks, onMoveToToday }: YesterdayBannerProps) {
  const t = useTranslations("yesterday");

  if (tasks.length === 0) return null;

  return (
    <div className="mb-3 flex items-center justify-between rounded-md border border-orange-300 bg-orange-50 px-3 py-2">
      <span className="text-sm text-orange-800">
        {t("message", { count: tasks.length })}
      </span>
      <Button size="sm" variant="outline" onClick={onMoveToToday}>
        {t("moveButton")}
      </Button>
    </div>
  );
}
