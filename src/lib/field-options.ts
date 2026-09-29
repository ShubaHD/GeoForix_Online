import type { Locale } from "@/lib/i18n/config";

/** Canonical RO values stored in DB (compatible with Android GeoForix). */
export const SOIL_TYPES = [
  "Sol vegetal",
  "Asfalt",
  "Beton",
  "Argila grasa",
  "Argila",
  "Argila nisipoasa",
  "Argila prafoasa",
  "Praf",
  "Praf nisipos argilos",
  "Praf argilos",
  "Praf nisipos",
  "Nisip",
  "Nisip argilos",
  "Nisip prafos",
  "Nisip cu pietris",
  "Pietris cu Nisip",
  "Blocuri si bolovanisuri cu pietris si nisip",
  "Roca",
  "Roca fracturata",
] as const;

export const CONSISTENCY_OPTIONS = [
  "Plastic curgator",
  "Plastic moale",
  "Plastic consistent",
  "Plastic vartos",
  "Plastic tare",
] as const;

export const SAND_COMPACTION_OPTIONS = [
  "Foarte afânat",
  "Afânat",
  "Mediu indesat",
  "Indesat",
  "Foarte indesat",
] as const;

export const COLOR_OPTIONS = [
  "BRUN (sau MARONIU)",
  "BRUN (sau MARONIU) GALBUI",
  "BRUN (sau MARONIU) ROSIATIC",
  "CAFENIU",
  "CAFENIU GALBUI",
  "ROSIATIC",
  "GALBUI",
  "GALBUI ALBICIOS",
  "BRUN NEGRICIOS",
  "NEGRU",
  "CENUSIU",
  "CENUSIU VERZUI",
  "CENUSIU ALBICIOS",
  "CENUSIU NEGRICIOS",
  "CENUSIU ALBASTRUI",
] as const;

export const SAMPLE_TYPES = [
  "Tulburată",
  "Netulburată",
  "Carotier Dublu",
  "Carotier Triplu",
  "Calup",
  "SPT",
] as const;

export const EQUIPMENT_TYPES = [
  "Tubaj Protecție",
  "Tubaj Piezometric",
  "Tubaj Inclinometric",
  "Tub PVC",
  "Tub Metalic",
  "Echipare Downhole",
] as const;

export const BOREHOLE_CATEGORIES = [
  "General",
  "Structuri",
  "Drum",
  "Parcări",
  "Explorare",
  "Reabilitare",
] as const;

export const PMT_TYPES = ["OYO", "Menard", "Other"] as const;

export const OTV_TEST_KINDS = ["OTV", "Acustic", "OTV + Acustic"] as const;

export const PP_PLUNGER_OPTIONS = [
  "1/4in",
  "10mm",
  "15mm",
  "20mm",
  "25mm",
] as const;

export const VST_VANE_SIZES = [
  "1in (25.4mm) - soluri tari",
  "3/4in (19mm) - soluri medii",
  "1 7/8in (47.6mm) - soluri moi",
] as const;

export const RQD_SCR_RULES = [">5cm", ">10cm"] as const;

const EN: Record<string, string> = {
  "Sol vegetal": "Topsoil",
  Asfalt: "Asphalt",
  Beton: "Concrete",
  "Argila grasa": "Fat clay",
  Argila: "Clay",
  "Argila nisipoasa": "Sandy clay",
  "Argila prafoasa": "Silty clay",
  Praf: "Silt",
  "Praf nisipos argilos": "Clayey sandy silt",
  "Praf argilos": "Clayey silt",
  "Praf nisipos": "Sandy silt",
  Nisip: "Sand",
  "Nisip argilos": "Clayey sand",
  "Nisip prafos": "Silty sand",
  "Nisip cu pietris": "Sand with gravel",
  "Pietris cu Nisip": "Gravel with sand",
  "Blocuri si bolovanisuri cu pietris si nisip":
    "Boulders and cobbles with gravel and sand",
  Roca: "Rock",
  "Roca fracturata": "Fractured rock",
  "Plastic curgator": "Liquid plastic",
  "Plastic moale": "Soft plastic",
  "Plastic consistent": "Firm plastic",
  "Plastic vartos": "Stiff plastic",
  "Plastic tare": "Hard plastic",
  "Foarte afânat": "Very loose",
  Afânat: "Loose",
  "Mediu indesat": "Medium dense",
  Indesat: "Dense",
  "Foarte indesat": "Very dense",
  "BRUN (sau MARONIU)": "BROWN",
  "BRUN (sau MARONIU) GALBUI": "YELLOWISH BROWN",
  "BRUN (sau MARONIU) ROSIATIC": "REDDISH BROWN",
  CAFENIU: "TAN",
  "CAFENIU GALBUI": "YELLOWISH TAN",
  ROSIATIC: "REDDISH",
  GALBUI: "YELLOWISH",
  "GALBUI ALBICIOS": "WHITISH YELLOW",
  "BRUN NEGRICIOS": "BLACKISH BROWN",
  NEGRU: "BLACK",
  CENUSIU: "GREY",
  "CENUSIU VERZUI": "GREENISH GREY",
  "CENUSIU ALBICIOS": "WHITISH GREY",
  "CENUSIU NEGRICIOS": "BLACKISH GREY",
  "CENUSIU ALBASTRUI": "BLUISH GREY",
  Tulburată: "Disturbed",
  Netulburată: "Undisturbed",
  "Carotier Dublu": "Double core barrel",
  "Carotier Triplu": "Triple core barrel",
  Calup: "Block sample",
  SPT: "SPT",
  "Tubaj Protecție": "Protective casing",
  "Tubaj Piezometric": "Piezometer casing",
  "Tubaj Inclinometric": "Inclinometer casing",
  "Tub PVC": "PVC pipe",
  "Tub Metalic": "Steel pipe",
  "Echipare Downhole": "Downhole installation",
  General: "General",
  Structuri: "Structures",
  Drum: "Road",
  Parcări: "Parking",
  Explorare: "Exploration",
  Reabilitare: "Rehabilitation",
  OTV: "OTV",
  Acustic: "Acoustic",
  "OTV + Acustic": "OTV + Acoustic",
  "1in (25.4mm) - soluri tari": "1in (25.4mm) - stiff soils",
  "3/4in (19mm) - soluri medii": "3/4in (19mm) - medium soils",
  "1 7/8in (47.6mm) - soluri moi": "1 7/8in (47.6mm) - soft soils",
};

const DE: Record<string, string> = {
  "Sol vegetal": "Oberboden",
  Asfalt: "Asphalt",
  Beton: "Beton",
  "Argila grasa": "Fettiger Ton",
  Argila: "Ton",
  "Argila nisipoasa": "Sandiger Ton",
  "Argila prafoasa": "Schluffiger Ton",
  Praf: "Schluff",
  "Praf nisipos argilos": "Tonig-sandiger Schluff",
  "Praf argilos": "Toniger Schluff",
  "Praf nisipos": "Sandiger Schluff",
  Nisip: "Sand",
  "Nisip argilos": "Toniger Sand",
  "Nisip prafos": "Schluffiger Sand",
  "Nisip cu pietris": "Sand mit Kies",
  "Pietris cu Nisip": "Kies mit Sand",
  "Blocuri si bolovanisuri cu pietris si nisip":
    "Blöcke und Gerölle mit Kies und Sand",
  Roca: "Fels",
  "Roca fracturata": "Zerklüfteter Fels",
  "Plastic curgator": "Breiiig",
  "Plastic moale": "Weichplastisch",
  "Plastic consistent": "Steifplastisch",
  "Plastic vartos": "Halbfest",
  "Plastic tare": "Fest",
  "Foarte afânat": "Sehr locker",
  Afânat: "Locker",
  "Mediu indesat": "Mitteldicht",
  Indesat: "Dicht",
  "Foarte indesat": "Sehr dicht",
  "BRUN (sau MARONIU)": "BRAUN",
  "BRUN (sau MARONIU) GALBUI": "GELBLICH BRAUN",
  "BRUN (sau MARONIU) ROSIATIC": "RÖTLICH BRAUN",
  CAFENIU: "HELLBRAUN",
  "CAFENIU GALBUI": "GELBLICH HELLBRAUN",
  ROSIATIC: "RÖTLICH",
  GALBUI: "GELBLICH",
  "GALBUI ALBICIOS": "WEISSLICH GELB",
  "BRUN NEGRICIOS": "SCHWÄRZLICH BRAUN",
  NEGRU: "SCHWARZ",
  CENUSIU: "GRAU",
  "CENUSIU VERZUI": "GRÜNLICH GRAU",
  "CENUSIU ALBICIOS": "WEISSLICH GRAU",
  "CENUSIU NEGRICIOS": "SCHWÄRZLICH GRAU",
  "CENUSIU ALBASTRUI": "BLÄULICH GRAU",
  Tulburată: "Gestört",
  Netulburată: "Ungestört",
  "Carotier Dublu": "Doppelkernrohr",
  "Carotier Triplu": "Dreifachkernrohr",
  Calup: "Blockprobe",
  SPT: "SPT",
  "Tubaj Protecție": "Schutzverrohrung",
  "Tubaj Piezometric": "Piezometerrohr",
  "Tubaj Inclinometric": "Inklinometerrohr",
  "Tub PVC": "PVC-Rohr",
  "Tub Metalic": "Stahlrohr",
  "Echipare Downhole": "Downhole-Ausbau",
  General: "Allgemein",
  Structuri: "Bauwerke",
  Drum: "Straße",
  Parcări: "Parkplatz",
  Explorare: "Erkundung",
  Reabilitare: "Sanierung",
  OTV: "OTV",
  Acustic: "Akustik",
  "OTV + Acustic": "OTV + Akustik",
  "1in (25.4mm) - soluri tari": "1in (25.4mm) - feste Böden",
  "3/4in (19mm) - soluri medii": "3/4in (19mm) - mittelfeste Böden",
  "1 7/8in (47.6mm) - soluri moi": "1 7/8in (47.6mm) - weiche Böden",
};

export function labelField(value: string | null | undefined, locale: Locale) {
  if (!value) return "—";
  if (locale === "en") return EN[value] ?? value;
  if (locale === "de") return DE[value] ?? value;
  return value;
}

export function usesSandCompaction(soilType: string | null | undefined) {
  if (!soilType) return false;
  const t = soilType.toLowerCase();
  return t.includes("nisip") || t.includes("pietris") || t.includes("bolovan");
}

/** Extract SPT blow counts from "4,6,8", "4.6.8", "4/6/8", "4;6;8", etc. */
export function parseSptBlows(
  sptValues: string | null | undefined,
): number[] {
  if (!sptValues?.trim()) return [];
  const nums = sptValues.match(/\d+/g);
  if (!nums) return [];
  return nums.map((n) => parseInt(n, 10)).filter((n) => Number.isFinite(n));
}

/** Format blows as 4/6/8 for display. */
export function formatSptBlows(
  sptValues: string | null | undefined,
): string | null {
  const values = parseSptBlows(sptValues);
  if (values.length === 0) return null;
  return values.join("/");
}

/** N-SPT = sum of last two 15 cm increments (needs ≥ 3 blows). */
export function sptN(type: string, sptValues: string | null | undefined) {
  if (type !== "SPT") return null;
  const values = parseSptBlows(sptValues);
  if (values.length < 3) return null;
  return values[values.length - 2]! + values[values.length - 1]!;
}
