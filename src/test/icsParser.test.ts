import { describe, it, expect } from "vitest";
import { parseICSFile } from "../utils/icsParser";

const SIMPLE_ICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
BEGIN:VEVENT
DTSTART:20260315T100000Z
DTEND:20260315T110000Z
SUMMARY:Team Meeting
DESCRIPTION:Weekly standup
END:VEVENT
END:VCALENDAR`;

const RECURRING_ICS = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20260101T000000Z
SUMMARY:Monthly Review
RRULE:FREQ=MONTHLY;COUNT=12
END:VEVENT
BEGIN:VEVENT
DTSTART:20260601T000000Z
SUMMARY:Birthday
RRULE:FREQ=YEARLY
END:VEVENT
BEGIN:VEVENT
DTSTART:20260302T090000Z
SUMMARY:Sprint Planning
RRULE:FREQ=WEEKLY
END:VEVENT
END:VCALENDAR`;

const MULTI_EVENT_ICS = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART;VALUE=DATE:20260501
SUMMARY:Labor Day
END:VEVENT
BEGIN:VEVENT
DTSTART;VALUE=DATE:20261225
SUMMARY:Christmas
DESCRIPTION:Family celebration
END:VEVENT
END:VCALENDAR`;

const INVALID_ICS = `This is not a valid ICS file`;

const PARTIAL_ICS = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:No Date Event
END:VEVENT
BEGIN:VEVENT
DTSTART:20260401T120000Z
SUMMARY:Valid Event
END:VEVENT
END:VCALENDAR`;

describe("parseICSFile", () => {
  it("parses a simple event with date and time", () => {
    const result = parseICSFile(SIMPLE_ICS);
    expect(result.events).toHaveLength(1);
    expect(result.errors).toHaveLength(0);

    const event = result.events[0];
    expect(event.name).toBe("Team Meeting");
    expect(event.date).toBe("2026-03-15");
    expect(event.time).toBe("10:00");
    expect(event.comment).toBe("Weekly standup");
    expect(event.recurrence).toBe("none");
    expect(event.tags).toEqual([]);
    expect(event.id).toBeDefined();
  });

  it("parses recurring events correctly", () => {
    const result = parseICSFile(RECURRING_ICS);
    expect(result.events).toHaveLength(3);
    expect(result.errors).toHaveLength(0);

    const monthly = result.events.find((e) => e.name === "Monthly Review");
    expect(monthly?.recurrence).toBe("monthly");

    const yearly = result.events.find((e) => e.name === "Birthday");
    expect(yearly?.recurrence).toBe("yearly");

    const weekly = result.events.find((e) => e.name === "Sprint Planning");
    expect(weekly?.recurrence).toBe("weekly");
  });

  it("parses all-day events (DATE only, no time)", () => {
    const result = parseICSFile(MULTI_EVENT_ICS);
    expect(result.events).toHaveLength(2);

    const labor = result.events.find((e) => e.name === "Labor Day");
    expect(labor?.date).toBe("2026-05-01");
    expect(labor?.time).toBeUndefined();

    const xmas = result.events.find((e) => e.name === "Christmas");
    expect(xmas?.date).toBe("2026-12-25");
    expect(xmas?.comment).toBe("Family celebration");
  });

  it("returns errors for invalid ICS content", () => {
    const result = parseICSFile(INVALID_ICS);
    expect(result.events).toHaveLength(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("skips events without a date and parses valid ones", () => {
    const result = parseICSFile(PARTIAL_ICS);
    expect(result.events).toHaveLength(1);
    expect(result.events[0].name).toBe("Valid Event");
  });

  it("generates unique IDs for each event", () => {
    const result = parseICSFile(RECURRING_ICS);
    const ids = result.events.map((e) => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
