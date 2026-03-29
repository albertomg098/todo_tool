import { Suspense } from "react";
import { DayViewPage } from "@/components/DayViewPage";
import { DayViewSkeleton } from "@/components/DayViewSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<DayViewSkeleton />}>
      <DayViewPage />
    </Suspense>
  );
}
