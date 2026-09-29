/** Flat columnar CSV for borehole export / re-import into other software. */

type CsvBorehole = {
  code: string;
  depthMeters: number | null;
  latitude: number | null;
  longitude: number | null;
  kilometraj: string | null;
  tipInstalatie: string | null;
  intocmit: string | null;
  categorie: string | null;
  notes: string | null;
  project: {
    code: string;
    name: string;
    topic: string | null;
    location: string | null;
    client: string | null;
  };
  layers: {
    fromM: number;
    toM: number;
    type: string | null;
    consistency: string | null;
    sandCompaction: string | null;
    color: string | null;
    notes: string | null;
  }[];
  samples: {
    depthM: string;
    type: string;
    sptValues: string | null;
    notes: string | null;
  }[];
  waterLevels: {
    date: Date;
    duringM: number | null;
    after24hM: number | null;
    notes: string | null;
  }[];
  equipment: { type: string; fromM: number; toM: number }[];
  photos: { name: string; depthM: number | null }[];
  pmtReadings: {
    presiometerType: string;
    depthFromM: number;
    depthToM: number;
    testDate: Date;
    notes: string | null;
  }[];
  otvReadings: {
    testKind: string;
    depthFromM: number;
    depthToM: number;
    testDate: Date;
    notes: string | null;
  }[];
  ppReadings: {
    plunger: string;
    depthFrom: number;
    depthTo: number;
    valuesCsv: string;
  }[];
  vstReadings: {
    vaneSize: string;
    depthFrom: number;
    depthTo: number;
    valueKgCm2: number;
  }[];
  rqdReadings: {
    depthFrom: number;
    depthTo: number;
    rqdPercent: number;
    tcrPercent: number;
    scrPercent: number;
    scrRule: string | null;
  }[];
};

const HEADERS = [
  "section",
  "project_code",
  "project_name",
  "project_topic",
  "project_location",
  "project_client",
  "borehole_code",
  "depth_meters",
  "latitude",
  "longitude",
  "kilometraj",
  "tip_instalatie",
  "intocmit",
  "categorie",
  "borehole_notes",
  "from_m",
  "to_m",
  "depth_m",
  "type",
  "consistency",
  "sand_compaction",
  "color",
  "notes",
  "spt_values",
  "during_m",
  "after24h_m",
  "date",
  "presiometer_type",
  "otv_kind",
  "plunger",
  "values_csv",
  "vane_size",
  "value_kg_cm2",
  "rqd_percent",
  "tcr_percent",
  "scr_percent",
  "scr_rule",
  "photo_name",
] as const;

type Row = Record<(typeof HEADERS)[number], string>;

function emptyRow(): Row {
  return Object.fromEntries(HEADERS.map((h) => [h, ""])) as Row;
}

function cell(v: string | number | null | undefined): string {
  if (v == null) return "";
  return String(v);
}

function fmtDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function baseMeta(b: CsvBorehole): Partial<Row> {
  return {
    project_code: b.project.code,
    project_name: b.project.name,
    project_topic: cell(b.project.topic),
    project_location: cell(b.project.location),
    project_client: cell(b.project.client),
    borehole_code: b.code,
    depth_meters: cell(b.depthMeters),
    latitude: cell(b.latitude),
    longitude: cell(b.longitude),
    kilometraj: cell(b.kilometraj),
    tip_instalatie: cell(b.tipInstalatie),
    intocmit: cell(b.intocmit),
    categorie: cell(b.categorie),
    borehole_notes: cell(b.notes),
  };
}

export function buildBoreholeCsv(b: CsvBorehole): string {
  const rows: Row[] = [];
  const meta = baseMeta(b);

  const metaRow = emptyRow();
  Object.assign(metaRow, meta, { section: "meta" });
  rows.push(metaRow);

  for (const l of [...b.layers].sort((a, c) => a.fromM - c.fromM)) {
    const r = emptyRow();
    Object.assign(r, meta, {
      section: "layer",
      from_m: cell(l.fromM),
      to_m: cell(l.toM),
      type: cell(l.type),
      consistency: cell(l.consistency),
      sand_compaction: cell(l.sandCompaction),
      color: cell(l.color),
      notes: cell(l.notes),
    });
    rows.push(r);
  }

  for (const s of b.samples) {
    const r = emptyRow();
    Object.assign(r, meta, {
      section: "sample",
      depth_m: cell(s.depthM),
      type: cell(s.type),
      spt_values: cell(s.sptValues),
      notes: cell(s.notes),
    });
    rows.push(r);
  }

  for (const w of b.waterLevels) {
    const r = emptyRow();
    Object.assign(r, meta, {
      section: "water",
      during_m: cell(w.duringM),
      after24h_m: cell(w.after24hM),
      date: fmtDate(w.date),
      notes: cell(w.notes),
    });
    rows.push(r);
  }

  for (const e of b.equipment) {
    const r = emptyRow();
    Object.assign(r, meta, {
      section: "equipment",
      from_m: cell(e.fromM),
      to_m: cell(e.toM),
      type: cell(e.type),
    });
    rows.push(r);
  }

  for (const p of b.pmtReadings) {
    const r = emptyRow();
    Object.assign(r, meta, {
      section: "pmt",
      from_m: cell(p.depthFromM),
      to_m: cell(p.depthToM),
      presiometer_type: cell(p.presiometerType),
      date: fmtDate(p.testDate),
      notes: cell(p.notes),
    });
    rows.push(r);
  }

  for (const o of b.otvReadings) {
    const r = emptyRow();
    Object.assign(r, meta, {
      section: "otv",
      from_m: cell(o.depthFromM),
      to_m: cell(o.depthToM),
      otv_kind: cell(o.testKind),
      date: fmtDate(o.testDate),
      notes: cell(o.notes),
    });
    rows.push(r);
  }

  for (const p of b.ppReadings) {
    const r = emptyRow();
    Object.assign(r, meta, {
      section: "pp",
      from_m: cell(p.depthFrom),
      to_m: cell(p.depthTo),
      plunger: cell(p.plunger),
      values_csv: cell(p.valuesCsv),
    });
    rows.push(r);
  }

  for (const v of b.vstReadings) {
    const r = emptyRow();
    Object.assign(r, meta, {
      section: "vst",
      from_m: cell(v.depthFrom),
      to_m: cell(v.depthTo),
      vane_size: cell(v.vaneSize),
      value_kg_cm2: cell(v.valueKgCm2),
    });
    rows.push(r);
  }

  for (const q of b.rqdReadings) {
    const r = emptyRow();
    Object.assign(r, meta, {
      section: "rqd",
      from_m: cell(q.depthFrom),
      to_m: cell(q.depthTo),
      rqd_percent: cell(q.rqdPercent),
      tcr_percent: cell(q.tcrPercent),
      scr_percent: cell(q.scrPercent),
      scr_rule: cell(q.scrRule),
    });
    rows.push(r);
  }

  for (const ph of b.photos) {
    const r = emptyRow();
    Object.assign(r, meta, {
      section: "photo",
      photo_name: cell(ph.name),
      depth_m: cell(ph.depthM),
    });
    rows.push(r);
  }

  const lines = [
    HEADERS.join(","),
    ...rows.map((row) =>
      HEADERS.map((h) => escapeCsv(row[h] ?? "")).join(","),
    ),
  ];

  // UTF-8 BOM so Excel opens Romanian characters correctly
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}
