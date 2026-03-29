"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseDaySlot, isToday } from "@/lib/dates";

interface DayHeaderProps {
  daySlot: string;
  onPrev: () => void;
  onNext: () => void;
}

export function DayHeader({ daySlot, onPrev, onNext }: DayHeaderProps) {
  const t = useTranslations("dates");
  const date = parseDaySlot(daySlot);
  const days: string[] = t.raw("days");
  const months: string[] = t.raw("months");

  const display = t("dayFormat", {
    day: days[date.getDay()],
    date: String(date.getDate()),
    month: months[date.getMonth()],
  });

  return (
    <div className="flex items-center justify-between py-4">
      <Button variant="ghost" size="icon" onClick={onPrev} className="cursor-pointer">
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div className="text-center">
        <h1 className="text-xl font-semibold">{display}</h1>
        {isToday(daySlot) && (
          <span className="text-sm text-muted-foreground">{t("today")}</span>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={onNext} className="cursor-pointer">
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
