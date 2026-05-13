import type { Holiday } from "./types";

const holidayModules = import.meta.glob<Holiday[]>("./*.json", { eager: true, import: "default" });

const holidays: Record<string, Holiday[]> = {};

for (const [path, data] of Object.entries(holidayModules)) {
  const code = path.replace("./", "").replace(".json", "");
  holidays[code] = data;
}

export function getHolidaysForCountry(countryCode: string): Holiday[] {
  return holidays[countryCode] || [];
}

export { holidays };
export type { Holiday };
