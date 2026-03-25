/**
 * Get ISO week string "YYYY-WXX" for a given date.
 * Uses ISO 8601: week starts Monday, first week contains Thursday.
 */
export function getISOWeekSlot(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/** Format "YYYY-MM-DD" */
export function toDaySlot(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse "YYYY-MM-DD" to Date (local timezone) */
export function parseDaySlot(daySlot: string): Date {
  const [y, m, d] = daySlot.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Add days to a daySlot string, return new daySlot string */
export function addDays(daySlot: string, days: number): string {
  const date = parseDaySlot(daySlot);
  date.setDate(date.getDate() + days);
  return toDaySlot(date);
}

/** Format date for display: "Lunes 25 de marzo" */
export function formatDayDisplay(daySlot: string): string {
  const date = parseDaySlot(daySlot);
  const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const monthNames = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `${dayNames[date.getDay()]} ${date.getDate()} de ${monthNames[date.getMonth()]}`;
}

/** Check if a daySlot is today */
export function isToday(daySlot: string): boolean {
  return daySlot === toDaySlot(new Date());
}

/** Get yesterday's daySlot */
export function getYesterday(): string {
  return addDays(toDaySlot(new Date()), -1);
}

/** Get the Monday date for a given ISO week slot "YYYY-WXX" */
export function getMondayOfWeek(weekSlot: string): Date {
  const [yearStr, weekStr] = weekSlot.split("-W");
  const year = Number(yearStr);
  const week = Number(weekStr);
  // Jan 4 is always in week 1
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7; // Mon=1..Sun=7
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7);
  return monday;
}

/** Get daySlots for Mon-Fri of a given week */
export function getWeekDaySlots(weekSlot: string): string[] {
  const monday = getMondayOfWeek(weekSlot);
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toDaySlot(d);
  });
}

/** Short day name from daySlot */
export function getShortDayName(daySlot: string): string {
  const date = parseDaySlot(daySlot);
  const names = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return names[date.getDay()];
}

/** Navigate weeks: add N weeks to a weekSlot */
export function addWeeks(weekSlot: string, n: number): string {
  const monday = getMondayOfWeek(weekSlot);
  monday.setDate(monday.getDate() + n * 7);
  return getISOWeekSlot(monday);
}

/** Format week for display: "Semana 13 — marzo 2026" */
export function formatWeekDisplay(weekSlot: string): string {
  const [, weekStr] = weekSlot.split("-W");
  const monday = getMondayOfWeek(weekSlot);
  const monthNames = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `Semana ${Number(weekStr)} — ${monthNames[monday.getMonth()]} ${monday.getFullYear()}`;
}
