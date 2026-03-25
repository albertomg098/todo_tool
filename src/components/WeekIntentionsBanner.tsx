import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface WeekIntentionsBannerProps {
  intentions: string[];
}

export function WeekIntentionsBanner({ intentions }: WeekIntentionsBannerProps) {
  const [open, setOpen] = useState(false);

  if (intentions.length === 0) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mx-4 mb-3">
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border bg-muted/50 px-3 py-2 text-sm font-medium hover:bg-muted">
        <span>Intenciones de la semana ({intentions.length})</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mt-1 space-y-1 rounded-md border bg-muted/30 px-3 py-2">
          {intentions.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground">
              • {item}
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
