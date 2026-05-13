import { describe, it, expect } from "vitest";
import { daysUntilEvent, getNextOccurrence } from "../utils/countdown";
import type { UserEvent } from "../types";

function makeEvent(overrides: Partial<UserEvent> = {}): UserEvent {
  return {
    id: "1",
    name: "Test",
    date: "2026-03-15",
    recurrence: "none",
    tags: [],
    ...overrides,
  };
}

describe("daysUntilEvent", () => {
  it("returns 0 for today's event", () => {
    const today = new Date(2026, 2, 15); // March 15, 2026
    const event = makeEvent({ date: "2026-03-15" });
    expect(daysUntilEvent(event, today)).toBe(0);
  });

  it("returns correct days for future event", () => {
    const today = new Date(2026, 2, 10); // March 10
    const event = makeEvent({ date: "2026-03-15" });
    expect(daysUntilEvent(event, today)).toBe(5);
  });

  it("returns Infinity for past one-time event", () => {
    const today = new Date(2026, 2, 16); // March 16
    const event = makeEvent({ date: "2026-03-15", recurrence: "none" });
    expect(daysUntilEvent(event, today)).toBe(Infinity);
  });

  it("returns days to next year for yearly recurring past event", () => {
    const today = new Date(2026, 2, 16); // March 16 - event was March 15
    const event = makeEvent({ date: "2026-03-15", recurrence: "yearly" });
    // Next occurrence: March 15, 2027 = 364 days
    expect(daysUntilEvent(event, today)).toBe(364);
  });

  it("returns 0 for yearly event on the same day", () => {
    const today = new Date(2026, 2, 15);
    const event = makeEvent({ date: "2025-03-15", recurrence: "yearly" });
    expect(daysUntilEvent(event, today)).toBe(0);
  });

  it("handles monthly recurrence - same month", () => {
    const today = new Date(2026, 2, 10); // March 10
    const event = makeEvent({ date: "2026-01-15", recurrence: "monthly" });
    // Next: March 15 = 5 days
    expect(daysUntilEvent(event, today)).toBe(5);
  });

  it("handles monthly recurrence - next month", () => {
    const today = new Date(2026, 2, 16); // March 16
    const event = makeEvent({ date: "2026-01-15", recurrence: "monthly" });
    // Next: April 15 = 30 days
    expect(daysUntilEvent(event, today)).toBe(30);
  });

  it("handles weekly recurrence", () => {
    // March 15, 2026 is a Sunday (day 0)
    const today = new Date(2026, 2, 16); // Monday
    const event = makeEvent({ date: "2026-03-15", recurrence: "weekly" }); // Sunday
    // Next Sunday from Monday = 6 days
    expect(daysUntilEvent(event, today)).toBe(6);
  });
});

describe("getNextOccurrence", () => {
  it("returns null for past one-time event", () => {
    const today = new Date(2026, 2, 16);
    const event = makeEvent({ date: "2026-03-15", recurrence: "none" });
    expect(getNextOccurrence(event, today)).toBeNull();
  });

  it("returns the event date for future one-time event", () => {
    const today = new Date(2026, 2, 10);
    const event = makeEvent({ date: "2026-03-15", recurrence: "none" });
    const result = getNextOccurrence(event, today)!;
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(2); // March
    expect(result.getDate()).toBe(15);
  });
});
