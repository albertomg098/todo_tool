import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";

const categoryVariant: Record<string, "default" | "secondary" | "outline"> = {
  Cliente: "default",
  Producto: "secondary",
  Admin: "outline",
};

interface BacklogSectionProps {
  tasks: Task[];
}

export function BacklogSection({ tasks }: BacklogSectionProps) {
  return (
    <Card className="mx-4 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Backlog ({tasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Sin tareas en backlog. Usa la vista diaria con Shift+Enter para crear tareas sin día.
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
                  {task.category}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
