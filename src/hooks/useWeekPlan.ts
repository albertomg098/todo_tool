import { useState, useCallback } from "react";
import type { WeekPlan } from "@/types/task";
import * as storage from "@/lib/storage";

export function useWeekPlan(weekSlot: string) {
  const [plan, setPlan] = useState<WeekPlan | undefined>(() =>
    storage.getWeekPlan(weekSlot),
  );

  const reload = useCallback(() => {
    setPlan(storage.getWeekPlan(weekSlot));
  }, [weekSlot]);

  const saveIntentions = useCallback(
    (intentions: string[]) => {
      const now = new Date().toISOString();
      const updated: WeekPlan = plan
        ? { ...plan, intentions, updatedAt: now }
        : { weekSlot, intentions, createdAt: now, updatedAt: now };
      storage.saveWeekPlan(updated);
      setPlan(updated);
    },
    [weekSlot, plan],
  );

  return { plan, saveIntentions, reload };
}
