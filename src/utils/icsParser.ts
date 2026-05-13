import ICAL from "ical.js";
import { v4 as uuid } from "uuid";
import type { UserEvent, RecurrenceType } from "../types";

export interface ICSParseResult {
  events: UserEvent[];
  errors: string[];
}

export function parseICSFile(icsContent: string): ICSParseResult {
  const events: UserEvent[] = [];
  const errors: string[] = [];

  try {
    const jcalData = ICAL.parse(icsContent);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");

    for (const vevent of vevents) {
      try {
        const event = parseVEvent(vevent);
        if (event) {
          events.push(event);
        }
      } catch {
        const summary = vevent.getFirstPropertyValue("summary");
        errors.push(`Failed to parse event: ${summary || "unknown"}`);
      }
    }
  } catch {
    errors.push("Failed to parse ICS file. The file may be corrupted or in an unsupported format.");
  }

  return { events, errors };
}

function parseVEvent(vevent: ICAL.Component): UserEvent | null {
  const summary = vevent.getFirstPropertyValue("summary");
  if (!summary) return null;

  const dtstart = vevent.getFirstPropertyValue("dtstart") as ICAL.Time | null;
  if (!dtstart) return null;

  const date = formatDate(dtstart);
  const time = dtstart.hour !== 0 || dtstart.minute !== 0 ? formatTime(dtstart) : undefined;

  const description = vevent.getFirstPropertyValue("description") as string | null;

  const rrule = vevent.getFirstPropertyValue("rrule") as ICAL.Recur | null;
  const recurrence = mapRecurrence(rrule);

  return {
    id: uuid(),
    name: String(summary),
    date,
    time,
    recurrence,
    comment: description ? String(description) : undefined,
    tags: [],
  };
}

function formatDate(dt: ICAL.Time): string {
  const y = dt.year;
  const m = String(dt.month).padStart(2, "0");
  const d = String(dt.day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatTime(dt: ICAL.Time): string {
  const h = String(dt.hour).padStart(2, "0");
  const min = String(dt.minute).padStart(2, "0");
  return `${h}:${min}`;
}

function mapRecurrence(rrule: ICAL.Recur | null): RecurrenceType {
  if (!rrule) return "none";

  const freq = rrule.freq;
  switch (freq) {
    case "YEARLY":
      return "yearly";
    case "MONTHLY":
      return "monthly";
    case "WEEKLY":
      return "weekly";
    default:
      return "none";
  }
}
