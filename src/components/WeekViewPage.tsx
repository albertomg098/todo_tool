"use client";

import { useRouter } from "next/navigation";
import { WeekView } from "./WeekView";

export function WeekViewPage() {
  const router = useRouter();

  return (
    <WeekView onNavigateToDay={(daySlot) => router.push(`/?day=${daySlot}`)} />
  );
}
