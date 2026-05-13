import { describe, it, expect, beforeEach } from "vitest";
import { loadData, saveData, clearAllData, exportData, importData } from "../utils/storage";
import type { AppData } from "../types";

const mockData: AppData = {
  settings: {
    country: "PL",
    language: "pl",
    timezone: "Europe/Warsaw",
    appearance: "dark",
    onboardingCompleted: true,
  },
  events: [
    { id: "1", name: "Test Event", date: "2026-05-01", recurrence: "yearly", tags: ["t1"] },
  ],
  tags: [{ id: "t1", name: "Holiday", color: "#ef4444" }],
};

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns default data when nothing stored", () => {
    const data = loadData();
    expect(data.settings.onboardingCompleted).toBe(false);
    expect(data.events).toEqual([]);
    expect(data.tags).toEqual([]);
  });

  it("saves and loads data", () => {
    saveData(mockData);
    const loaded = loadData();
    expect(loaded.settings.country).toBe("PL");
    expect(loaded.events).toHaveLength(1);
    expect(loaded.tags).toHaveLength(1);
  });

  it("clears all data", () => {
    saveData(mockData);
    clearAllData();
    const data = loadData();
    expect(data.events).toEqual([]);
  });

  it("exports data as JSON string", () => {
    saveData(mockData);
    const exported = exportData();
    const parsed = JSON.parse(exported);
    expect(parsed.settings.country).toBe("PL");
  });

  it("imports valid data", () => {
    const json = JSON.stringify(mockData);
    const result = importData(json);
    expect(result).not.toBeNull();
    expect(result!.settings.country).toBe("PL");
  });

  it("returns null for invalid import", () => {
    expect(importData("not json")).toBeNull();
    expect(importData('{"invalid": true}')).toBeNull();
  });
});
