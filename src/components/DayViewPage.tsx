"use client";

import { useSearchParams } from "next/navigation";
import { DayView } from "./DayView";
import { LocalStorageMigration } from "./LocalStorageMigration";

export function DayViewPage() {
  const searchParams = useSearchParams();
  const day = searchParams.get("day") ?? undefined;

  return (
    <>
      <LocalStorageMigration />
      <DayView initialDay={day} />
    </>
  );
}
