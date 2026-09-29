/** Client-safe borehole consistency checks for PDF / field QA. */

export type BoreholeWarning = {
  code: string;
  /** Optional interpolated values for i18n templates */
  params?: Record<string, string | number>;
};

type LayerLike = { fromM: number; toM: number; type?: string | null };
type SampleLike = { depthM: string; type: string };
type EquipLike = { type: string; fromM: number; toM: number };
type WaterLike = { duringM: number | null; after24hM: number | null };
type RangeLike = { depthFrom?: number; depthTo?: number; depthFromM?: number; depthToM?: number };

function parseDepth(depthM: string): number | null {
  const s = depthM.trim().replace(",", ".");
  const range = s.match(/^(-?\d+(?:\.\d+)?)\s*[-–—/]\s*(-?\d+(?:\.\d+)?)/);
  if (range) {
    const a = parseFloat(range[1]!);
    const b = parseFloat(range[2]!);
    if (Number.isFinite(a) && Number.isFinite(b)) return Math.max(a, b);
  }
  const single = parseFloat(s);
  return Number.isFinite(single) ? single : null;
}

function rangeMax(r: RangeLike): number {
  const a = r.depthToM ?? r.depthTo ?? r.depthFromM ?? r.depthFrom ?? 0;
  const b = r.depthFromM ?? r.depthFrom ?? a;
  return Math.max(a, b);
}

function isCasingLike(type: string) {
  const t = type.toLowerCase();
  return (
    t.includes("protec") ||
    t.includes("piezo") ||
    t.includes("inclino") ||
    t.includes("tub") ||
    t.includes("casing") ||
    t.includes("schutz") ||
    t.includes("verrohr")
  );
}

export function collectBoreholeWarnings(input: {
  depthMeters: number | null;
  latitude: number | null;
  longitude: number | null;
  layers: LayerLike[];
  samples: SampleLike[];
  equipment: EquipLike[];
  waterLevels: WaterLike[];
  photos: { id: string }[];
  pmt?: RangeLike[];
  otv?: RangeLike[];
  pp?: RangeLike[];
  vst?: RangeLike[];
  rqd?: RangeLike[];
}): BoreholeWarning[] {
  const warnings: BoreholeWarning[] = [];
  const depth = input.depthMeters;

  if (input.photos.length === 0) {
    warnings.push({ code: "noPhotos" });
  }

  if (input.layers.length === 0) {
    warnings.push({ code: "noLayers" });
  }

  if (depth == null || !(depth > 0)) {
    warnings.push({ code: "noDepth" });
  }

  if (input.latitude == null || input.longitude == null) {
    warnings.push({ code: "noCoords" });
  }

  if (depth != null && depth > 0) {
    for (const s of input.samples) {
      const d = parseDepth(s.depthM);
      if (d != null && d > depth + 0.01) {
        warnings.push({
          code: "sampleDeeper",
          params: { type: s.type, depth: d, limit: depth },
        });
      }
    }

    for (const e of input.equipment) {
      const max = Math.max(e.fromM, e.toM);
      if (max > depth + 0.01) {
        warnings.push({
          code: isCasingLike(e.type) ? "equipmentDeeper" : "equipmentDeeperGeneric",
          params: { type: e.type, depth: max, limit: depth },
        });
      }
    }

    for (const l of input.layers) {
      if (l.toM > depth + 0.01 || l.fromM > depth + 0.01) {
        warnings.push({
          code: "layerDeeper",
          params: {
            type: l.type ?? "?",
            from: l.fromM,
            to: l.toM,
            limit: depth,
          },
        });
      }
    }

    for (const w of input.waterLevels) {
      for (const [key, val] of [
        ["during", w.duringM],
        ["after24h", w.after24hM],
      ] as const) {
        if (val != null && val > depth + 0.01) {
          warnings.push({
            code: "waterDeeper",
            params: { which: key, depth: val, limit: depth },
          });
        }
      }
    }

    const insitu: { label: string; items: RangeLike[] }[] = [
      { label: "PMT", items: input.pmt ?? [] },
      { label: "OTV", items: input.otv ?? [] },
      { label: "PP", items: input.pp ?? [] },
      { label: "VST", items: input.vst ?? [] },
      { label: "RQD", items: input.rqd ?? [] },
    ];
    for (const group of insitu) {
      for (const r of group.items) {
        const max = rangeMax(r);
        if (max > depth + 0.01) {
          warnings.push({
            code: "insituDeeper",
            params: { test: group.label, depth: max, limit: depth },
          });
        }
      }
    }

    const maxLayer = input.layers.reduce((m, l) => Math.max(m, l.toM), 0);
    if (input.layers.length > 0 && maxLayer + 0.25 < depth) {
      warnings.push({
        code: "layersShort",
        params: { layerTo: maxLayer, limit: depth },
      });
    }
  }

  for (const l of input.layers) {
    if (l.toM < l.fromM - 0.001) {
      warnings.push({
        code: "layerInverted",
        params: { type: l.type ?? "?", from: l.fromM, to: l.toM },
      });
    }
  }

  const sorted = [...input.layers].sort((a, b) => a.fromM - b.fromM);
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const a = sorted[i]!;
      const b = sorted[j]!;
      if (b.fromM < a.toM - 0.001 && b.toM > a.fromM + 0.001) {
        // nested intercalation is ok if fully inside; warn only partial overlap
        const nested =
          (b.fromM >= a.fromM - 0.001 && b.toM <= a.toM + 0.001) ||
          (a.fromM >= b.fromM - 0.001 && a.toM <= b.toM + 0.001);
        if (!nested) {
          warnings.push({
            code: "layerOverlap",
            params: {
              a: `${a.fromM}–${a.toM}`,
              b: `${b.fromM}–${b.toM}`,
            },
          });
        }
      }
    }
  }

  return warnings;
}

export function fillWarningTemplate(
  template: string,
  params?: Record<string, string | number>,
) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    params[key] != null ? String(params[key]) : `{${key}}`,
  );
}
