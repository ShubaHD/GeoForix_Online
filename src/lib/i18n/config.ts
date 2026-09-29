export const LOCALES = ["ro", "en", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ro";
export const LOCALE_COOKIE = "geoforix_locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  ro: "RO",
  en: "EN",
  de: "DE",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "ro" || value === "en" || value === "de";
}

export function parseLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
