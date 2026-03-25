import type { Status } from "@/types/task";

const transitions: Record<Status, Status[]> = {
  TODO: ["TODAY", "BLOCKED"],
  TODAY: ["DONE", "TODO", "BLOCKED"],
  BLOCKED: ["TODO", "TODAY"],
  DONE: [],
};

export function canTransition(from: Status, to: Status): boolean {
  return transitions[from].includes(to);
}

export function getAvailableTransitions(from: Status): Status[] {
  return transitions[from];
}

/**
 * Validate a status transition.
 * Returns an error message if invalid, or null if valid.
 */
export function validateTransition(
  from: Status,
  to: Status,
  notes?: string,
): string | null {
  if (!canTransition(from, to)) {
    return `Cannot transition from ${from} to ${to}`;
  }
  if (from === "BLOCKED" && (to === "TODO" || to === "TODAY") && !notes?.trim()) {
    return "Moving from BLOCKED requires a note";
  }
  return null;
}
