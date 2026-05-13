export type RecurrenceType = "none" | "weekly" | "monthly" | "yearly";

export interface UserEvent {
  id: string;
  name: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time?: string; // HH:mm format, optional
  recurrence: RecurrenceType;
  comment?: string;
  tags: string[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export type AppearanceMode = "light" | "dark" | "system";

export interface AppSettings {
  country: string;
  language: string;
  timezone: string;
  appearance: AppearanceMode;
  onboardingCompleted: boolean;
}

export interface AppData {
  settings: AppSettings;
  events: UserEvent[];
  tags: Tag[];
}
