"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function DayViewSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="flex items-center justify-between py-4">
        <Skeleton className="h-9 w-9 rounded-md" />
        <div className="text-center space-y-1">
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-12 mx-auto" />
        </div>
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>

      <Separator />

      {/* Input skeleton */}
      <div className="mb-4 mt-4">
        <Skeleton className="h-9 w-full rounded-md" />
      </div>

      <Separator className="my-4" />

      {/* Task sections skeleton */}
      {[1, 2].map((section) => (
        <div key={section} className="mb-3">
          <Skeleton className="h-8 w-32 rounded-md mb-1" />
          <div className="space-y-1.5 pt-1">
            {[1, 2].map((task) => (
              <div key={task} className="flex items-center gap-2 rounded-md border px-3 py-2">
                <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
