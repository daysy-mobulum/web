import type { AppData, AppSettings, UserEvent, Tag } from "../types";

const STORAGE_KEY = "daysy-data";

const defaultSettings: AppSettings = {
  country: "",
  language: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  appearance: "system",
  onboardingCompleted: false,
};

function getDefaultData(): AppData {
  return {
    settings: { ...defaultSettings },
    events: [],
    tags: [],
  };
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    const parsed = JSON.parse(raw) as AppData;
    return {
      settings: { ...defaultSettings, ...parsed.settings },
      events: parsed.events || [],
      tags: parsed.tags || [],
    };
  } catch {
    return getDefaultData();
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function saveSettings(settings: AppSettings): void {
  const data = loadData();
  data.settings = settings;
  saveData(data);
}

export function saveEvents(events: UserEvent[]): void {
  const data = loadData();
  data.events = events;
  saveData(data);
}

export function saveTags(tags: Tag[]): void {
  const data = loadData();
  data.tags = tags;
  saveData(data);
}

export function exportData(): string {
  return JSON.stringify(loadData(), null, 2);
}

export function importData(json: string): AppData | null {
  try {
    const data = JSON.parse(json) as AppData;
    if (!data.settings || !Array.isArray(data.events) || !Array.isArray(data.tags)) {
      return null;
    }
    saveData(data);
    return data;
  } catch {
    return null;
  }
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
