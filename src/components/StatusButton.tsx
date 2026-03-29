"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import type { Status } from "@/types/task";
import { getAvailableTransitions } from "@/lib/state-machine";

const statusColors: Record<Status, string> = {
  TODAY: "bg-orange-600 text-white hover:bg-orange-700",
  DONE: "bg-green-600 text-white hover:bg-green-700",
  BLOCKED: "bg-yellow-600 text-white hover:bg-yellow-700",
  TODO: "bg-slate-400 text-white hover:bg-slate-500",
};

interface StatusButtonProps {
  status: Status;
  onChangeStatus: (newStatus: Status) => void;
}

export function StatusButton({ status, onChangeStatus }: StatusButtonProps) {
  const available = getAvailableTransitions(status);
  const tStatus = useTranslations("status");
  const tBtn = useTranslations("statusButton");

  if (available.length === 0) {
    return (
      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${statusColors[status]}`}>
        {tStatus(status)}
      </span>
    );
  }

  return (
    <div className="flex gap-1">
      {available.map((target) => (
        <Tooltip key={target}>
          <TooltipTrigger
            className={`inline-flex items-center justify-center rounded-md h-6 px-2 text-xs font-medium cursor-pointer ${statusColors[target]}`}
            onClick={() => onChangeStatus(target)}
          >
            {tStatus(target)}
          </TooltipTrigger>
          <TooltipContent>{tBtn("moveTo", { status: tStatus(target) })}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
