import { useState, useCallback, useEffect } from "react";
import type { WeekPlan } from "@/types/task";
import {
  fetchWeekPlan,
  saveWeekIntentions,
} from "@/app/actions/week-plans";

export function useWeekPlan(weekSlot: string) {
  const [plan, setPlan] = useState<WeekPlan | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await fetchWeekPlan(weekSlot);
    if (data) {
      setPlan({
        weekSlot: data.weekSlot,
        intentions: data.intentions,
        createdAt: data.createdAt.toISOString(),
        updatedAt: data.updatedAt.toISOString(),
      });
    } else {
      setPlan(undefined);
    }
    setLoading(false);
  }, [weekSlot]);

  useEffect(() => {
    setLoading(true);
    reload();
  }, [reload]);

  const saveIntentions = useCallback(
    async (intentions: string[]) => {
      const data = await saveWeekIntentions(weekSlot, intentions);
      setPlan({
        weekSlot: data.weekSlot,
        intentions: data.intentions,
        createdAt: data.createdAt.toISOString(),
        updatedAt: data.updatedAt.toISOString(),
      });
    },
    [weekSlot]
  );

  return { plan, loading, saveIntentions, reload };
}
