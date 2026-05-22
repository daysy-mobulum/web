import type { UserEvent } from "../types";

/**
 * Calculate days until the next occurrence of an event.
 * Returns 0 if the event is today.
 */
export function daysUntilEvent(event: UserEvent, now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nextDate = getNextOccurrence(event, today);
  if (!nextDate) return Infinity;

  const diff = nextDate.getTime() - today.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

/**
 * Get the next occurrence date of an event from today (inclusive).
 */
export function getNextOccurrence(event: UserEvent, today: Date = new Date()): Date | null {
  const todayNorm = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const eventDate = parseDate(event.date);
  if (!eventDate) return null;

  if (event.recurrence === "none") {
    // One-time event: show if today or in the future
    return eventDate >= todayNorm ? eventDate : null;
  }

  if (event.recurrence === "yearly") {
    // Try this year
    const thisYear = new Date(todayNorm.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    if (thisYear >= todayNorm) return thisYear;
    // Next year
    return new Date(todayNorm.getFullYear() + 1, eventDate.getMonth(), eventDate.getDate());
  }

  if (event.recurrence === "monthly") {
    const day = eventDate.getDate();
    const thisMonth = new Date(todayNorm.getFullYear(), todayNorm.getMonth(), day);
    if (thisMonth >= todayNorm) return thisMonth;
    // Next month
    return new Date(todayNorm.getFullYear(), todayNorm.getMonth() + 1, day);
  }

  if (event.recurrence === "weekly" || event.recurrence === "biweekly" || event.recurrence === "triweekly") {
    const intervalWeeks = event.recurrence === "triweekly" ? 3 : event.recurrence === "biweekly" ? 2 : 1;
    const intervalMs = intervalWeeks * 7 * 24 * 60 * 60 * 1000;
    const diffMs = todayNorm.getTime() - eventDate.getTime();
    if (diffMs <= 0) return eventDate;
    const periodsPassed = Math.floor(diffMs / intervalMs);
    const next = new Date(eventDate.getTime() + periodsPassed * intervalMs);
    if (next >= todayNorm) return next;
    return new Date(next.getTime() + intervalMs);
  }

  if (event.recurrence === "bimonthly" || event.recurrence === "trimonthly" || event.recurrence === "quarterly") {
    const intervalMonths = event.recurrence === "quarterly" ? 4 : event.recurrence === "trimonthly" ? 3 : 2;
    const day = eventDate.getDate();
    // Find next occurrence from eventDate forward
    const eventStartMonth = eventDate.getFullYear() * 12 + eventDate.getMonth();
    const todayMonth = todayNorm.getFullYear() * 12 + todayNorm.getMonth();
    const monthsDiff = todayMonth - eventStartMonth;
    const periodsPassed = Math.floor(monthsDiff / intervalMonths);
    let candidateMonths = eventStartMonth + periodsPassed * intervalMonths;
    let candidate = new Date(Math.floor(candidateMonths / 12), candidateMonths % 12, day);
    if (candidate < todayNorm) {
      candidateMonths += intervalMonths;
      candidate = new Date(Math.floor(candidateMonths / 12), candidateMonths % 12, day);
    }
    return candidate;
  }

  return null;
}

function parseDate(dateStr: string): Date | null {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  return new Date(y, m - 1, d);
}
