export interface Holiday {
  name: string;
  month?: number; // 1-12, for recurring yearly holidays
  day?: number; // 1-31, for recurring yearly holidays
  dates?: string[]; // ISO date strings for non-fixed holidays (e.g. Easter)
}

export type HolidaysByCountry = Record<string, Holiday[]>;
