import { Button } from "@/components/ui/button";
import type { Task } from "@/types/task";

interface YesterdayBannerProps {
  tasks: Task[];
  onMoveToToday: () => void;
}

export function YesterdayBanner({ tasks, onMoveToToday }: YesterdayBannerProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="mx-4 mb-3 flex items-center justify-between rounded-md border border-orange-300 bg-orange-50 px-3 py-2">
      <span className="text-sm text-orange-800">
        Tienes {tasks.length} tarea{tasks.length > 1 ? "s" : ""} de ayer sin completar
      </span>
      <Button size="sm" variant="outline" onClick={onMoveToToday}>
        Mover a hoy
      </Button>
    </div>
  );
}
