"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function WeekViewSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="flex items-center justify-between py-4">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-6 w-52 mx-auto" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>

      <Separator />

      {/* Intentions skeleton */}
      <div className="mt-4 mb-4">
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>

      {/* Day grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((day) => (
          <Skeleton key={day} className="h-24 rounded-lg" />
        ))}
      </div>

      <Separator className="mb-4" />

      {/* Backlog skeleton */}
      <Skeleton className="h-20 w-full rounded-lg" />
    </div>
  );
}
