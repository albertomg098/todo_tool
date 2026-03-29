"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

const categoryVariant: Record<string, "default" | "secondary" | "outline"> = {
  Cliente: "default",
  Producto: "secondary",
  Admin: "outline",
};

interface BacklogSectionProps {
  tasks: Task[];
}

export function BacklogSection({ tasks }: BacklogSectionProps) {
  const t = useTranslations("backlog");
  const tCat = useTranslations("category");

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          {t("title")} ({tasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            {t("empty")}
          </p>
        ) : (
          <div className="space-y-1">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 rounded-md border px-3 py-2"
              >
                <span className="flex-1 text-sm truncate">{task.title}</span>
                <Badge variant={categoryVariant[task.category]} className="text-xs shrink-0">
                  {tCat(task.category)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
