/**
 * Timezone utilities using `countries-and-timezones` package.
 * Clean, maintained, and ~9kb gzipped.
 */
import {
  getAllTimezones as ctGetAllTimezones,
  getTimezone as ctGetTimezone,
  getCountry as ctGetCountry,
} from "countries-and-timezones";

export interface TimezoneInfo {
  id: string; // IANA timezone identifier
  displayName: string; // City name
  country: string; // Country name
  countryCode: string; // ISO country code
  utcOffset: string; // UTC offset string (e.g., "-08:00")
}

// Modern city name overrides for outdated IANA identifiers
const MODERN_CITY_NAMES: Record<string, string> = {
  "Asia/Calcutta": "Kolkata",
  "Asia/Saigon": "Ho Chi Minh City",
  "Asia/Rangoon": "Yangon",
  "Asia/Katmandu": "Kathmandu",
  "Asia/Dacca": "Dhaka",
  "Asia/Thimbu": "Thimphu",
  "Pacific/Ponape": "Pohnpei",
  "Pacific/Truk": "Chuuk",
  "America/Godthab": "Nuuk",
  "Europe/Kiev": "Kyiv",
  "Africa/Asmera": "Asmara",
};

// Get display name for a timezone
const getDisplayName = (tzId: string): string => {
  if (MODERN_CITY_NAMES[tzId]) return MODERN_CITY_NAMES[tzId];

  const parts = tzId.split("/");
  return parts[parts.length - 1].replace(/_/g, " ");
};

// Get all timezones with country info
export const getAllTimezones = (): TimezoneInfo[] => {
  const allTimezones = ctGetAllTimezones();

  return Object.values(allTimezones)
    .filter((tz) => !tz.aliasOf) // Skip aliases
    .map((tz) => {
      const countryCode = tz.countries?.[0] ?? "";
      const country = countryCode ? (ctGetCountry(countryCode)?.name ?? "") : "";

      return {
        id: tz.name,
        displayName: getDisplayName(tz.name),
        country,
        countryCode,
        utcOffset: tz.utcOffsetStr,
      };
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
};

// Get timezones grouped by country
export const getTimezonesGroupedByCountry = (): Record<string, TimezoneInfo[]> => {
  const allTimezones = getAllTimezones();
  const grouped: Record<string, TimezoneInfo[]> = {};

  for (const tz of allTimezones) {
    const key = tz.country || "Other";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(tz);
  }

  // Sort countries alphabetically
  const sorted: Record<string, TimezoneInfo[]> = {};
  Object.keys(grouped)
    .sort()
    .forEach((key) => {
      sorted[key] = grouped[key];
    });

  return sorted;
};

// Search timezones
export const searchTimezones = (query: string): TimezoneInfo[] => {
  if (!query.trim()) return getAllTimezones();

  const q = query.toLowerCase().trim();
  return getAllTimezones().filter(
    (tz) =>
      tz.displayName.toLowerCase().includes(q) ||
      tz.country.toLowerCase().includes(q) ||
      tz.id.toLowerCase().includes(q) ||
      tz.countryCode.toLowerCase() === q
  );
};

// Get timezone by ID
export const getTimezoneById = (tzId: string): TimezoneInfo | undefined => {
  const tz = ctGetTimezone(tzId);
  if (!tz) return undefined;

  const countryCode = tz.countries?.[0] ?? "";
  const country = countryCode ? (ctGetCountry(countryCode)?.name ?? "") : "";

  return {
    id: tz.name,
    displayName: getDisplayName(tz.name),
    country,
    countryCode,
    utcOffset: tz.utcOffsetStr,
  };
};

// Detect user's timezone
export const detectUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
