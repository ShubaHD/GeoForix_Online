import PDFDocument from "pdfkit";
import type { Locale } from "@/lib/i18n/config";
import { getMessages, type Messages } from "@/lib/i18n/messages";
import { formatSptBlows, labelField, sptN } from "@/lib/field-options";
import {
  colorRgb,
  drawLegendSwatch,
  drawLithologyCell,
  patternForSoil,
  type HatchPattern,
} from "@/lib/export/lithology-styles";

type CompanyData = {
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  vatId: string | null;
  logoBytes: Buffer | null;
};

type ProjectData = {
  name: string;
  topic: string | null;
  location: string | null;
  client: string | null;
};

type BoreholeData = {
  code: string;
  depthMeters: number | null;
  latitude: number | null;
  longitude: number | null;
  kilometraj: string | null;
  tipInstalatie: string | null;
  intocmit: string | null;
  categorie: string | null;
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
  photos: {
    name: string;
    depthM: number | null;
    filePath?: string;
    bytes?: Buffer | null;
  }[];
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

type PdfLabels = Messages["pdf"];

function ascii(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ș/g, "s")
    .replace(/ț/g, "t")
    .replace(/Ș/g, "S")
    .replace(/Ț/g, "T")
    .replace(/ă/g, "a")
    .replace(/Ă/g, "A")
    .replace(/â/g, "a")
    .replace(/Â/g, "A")
    .replace(/î/g, "i")
    .replace(/Î/g, "I");
}

function fmtDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/** Parse "2.00-2.40" or "4.50" → mid depth in meters. */
export function parseSampleDepth(depthM: string): number | null {
  const s = depthM.trim().replace(",", ".");
  const range = s.match(/^(-?\d+(?:\.\d+)?)\s*[-–—/]\s*(-?\d+(?:\.\d+)?)/);
  if (range) {
    const a = parseFloat(range[1]);
    const b = parseFloat(range[2]);
    if (Number.isFinite(a) && Number.isFinite(b)) return (a + b) / 2;
  }
  const single = parseFloat(s);
  return Number.isFinite(single) ? single : null;
}

function computeMaxDepth(borehole: BoreholeData): number {
  let max = borehole.depthMeters ?? 0;
  for (const l of borehole.layers) max = Math.max(max, l.toM, l.fromM);
  for (const s of borehole.samples) {
    const d = parseSampleDepth(s.depthM);
    if (d != null) max = Math.max(max, d);
  }
  for (const w of borehole.waterLevels) {
    if (w.duringM != null) max = Math.max(max, w.duringM);
    if (w.after24hM != null) max = Math.max(max, w.after24hM);
  }
  if (max < 1) max = 1;
  return Math.ceil(max * 2) / 2; // round up to 0.5 m
}

type LayerRow = BoreholeData["layers"][number];

/**
 * Collapse overlapping lithology intervals into non-overlapping visible bands.
 * When several layers cover the same depth, the thinnest (most specific) wins.
 */
function resolveVisibleBands(
  layers: LayerRow[],
): { fromM: number; toM: number; layer: LayerRow }[] {
  if (layers.length === 0) return [];

  const edges = [
    ...new Set(layers.flatMap((l) => [l.fromM, l.toM])),
  ].sort((a, b) => a - b);

  // Prefer the layer that starts latest (nested intercalations / corrections win),
  // then the thinner interval if starts are equal.
  const ranked = [...layers].sort((a, b) => {
    if (Math.abs(b.fromM - a.fromM) > 1e-9) return b.fromM - a.fromM;
    const da = a.toM - a.fromM;
    const db = b.toM - b.fromM;
    return da - db;
  });

  const covers = (l: LayerRow, mid: number) =>
    l.fromM <= mid + 1e-9 && mid < l.toM - 1e-9
      ? true
      : Math.abs(l.toM - l.fromM) < 1e-9 && Math.abs(l.fromM - mid) < 1e-9;

  const bands: { fromM: number; toM: number; layer: LayerRow }[] = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const fromM = edges[i];
    const toM = edges[i + 1];
    if (toM - fromM < 1e-6) continue;
    const mid = (fromM + toM) / 2;
    const winner = ranked.find((l) => covers(l, mid));
    if (!winner) continue;
    const prev = bands[bands.length - 1];
    if (prev && prev.layer === winner && Math.abs(prev.toM - fromM) < 1e-9) {
      prev.toM = toM;
    } else {
      bands.push({ fromM, toM, layer: winner });
    }
  }
  return bands;
}

export async function buildFisaPdf(
  project: ProjectData,
  borehole: BoreholeData,
  locale: Locale,
  company?: CompanyData | null,
): Promise<Buffer> {
  const pdf = getMessages(locale).pdf;
  const L = (v: string | null | undefined) => labelField(v, locale);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 36 });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    drawHeader(doc, project, borehole, pdf, L, company ?? null);
    drawSyntheticLog(doc, borehole, pdf, L);
    const annexStarted = drawAnnexPage(doc, borehole, pdf, L);
    drawPhotoPages(doc, borehole, pdf, annexStarted);

    doc.end();
  });
}

function drawHeader(
  doc: PDFKit.PDFDocument,
  project: ProjectData,
  borehole: BoreholeData,
  pdf: PdfLabels,
  L: (v: string | null | undefined) => string,
  company: CompanyData | null,
) {
  const pageLeft = 36;
  const pageRight = 559;
  let y = 36;

  // Company band: logo left + firm details
  const hasCompany =
    company &&
    (company.name ||
      company.address ||
      company.phone ||
      company.email ||
      company.website ||
      company.vatId ||
      company.logoBytes);

  if (hasCompany && company) {
    const logoH = 42;
    const logoW = 90;
    let textX = pageLeft;

    if (company.logoBytes) {
      try {
        doc.image(company.logoBytes, pageLeft, y, {
          fit: [logoW, logoH],
          align: "left",
          valign: "center",
        });
        textX = pageLeft + logoW + 10;
      } catch {
        // ignore invalid image
      }
    }

    doc.fillColor("#000").font("Helvetica-Bold").fontSize(11);
    if (company.name) {
      doc.text(ascii(company.name), textX, y, {
        width: pageRight - textX - 100,
      });
    }
    doc.font("Helvetica").fontSize(7.5).fillColor("#333");
    const firmLines = [
      company.address,
      [company.phone, company.email].filter(Boolean).join("  ·  ") || null,
      [company.website, company.vatId ? `CUI: ${company.vatId}` : null]
        .filter(Boolean)
        .join("  ·  ") || null,
    ].filter(Boolean) as string[];
    let fy = doc.y + 1;
    for (const line of firmLines) {
      doc.text(ascii(line), textX, fy, { width: pageRight - textX - 100 });
      fy = doc.y;
    }

    doc.fillColor("#888").fontSize(9).font("Helvetica");
    doc.text(ascii(pdf.title), pageLeft, y, {
      align: "right",
      width: pageRight - pageLeft,
    });

    y = Math.max(y + logoH, fy) + 6;
    doc
      .strokeColor("#999")
      .lineWidth(0.6)
      .moveTo(pageLeft, y)
      .lineTo(pageRight, y)
      .stroke();
    y += 8;
  } else {
    doc.fillColor("#555").fontSize(11).font("Helvetica");
    doc.text(ascii(pdf.title), pageLeft, y, {
      align: "right",
      width: pageRight - pageLeft,
    });
    y = 52;
    doc.moveTo(pageLeft, y).lineTo(pageRight, y).stroke("#999");
    y += 6;
  }

  doc.fillColor("#000").fontSize(13).font("Helvetica-Bold");
  doc.text(ascii(`${pdf.title} — ${borehole.code}`), pageLeft, y);
  y = doc.y + 2;
  doc.fontSize(9).font("Helvetica");
  doc.fillColor("#444").text(ascii(pdf.syntheticSubtitle), pageLeft, y);
  y = doc.y + 6;

  const meta: string[] = [
    `${pdf.project}: ${project.name}`,
    project.topic ? `${pdf.topic}: ${project.topic}` : "",
    project.location ? `${pdf.location}: ${project.location}` : "",
    project.client ? `${pdf.client}: ${project.client}` : "",
    borehole.depthMeters != null ? `${pdf.depth}: ${borehole.depthMeters} m` : "",
    borehole.latitude != null && borehole.longitude != null
      ? `${pdf.coords}: ${borehole.latitude.toFixed(6)}, ${borehole.longitude.toFixed(6)}`
      : "",
    borehole.kilometraj ? `${pdf.kilometraj}: ${borehole.kilometraj}` : "",
    borehole.tipInstalatie ? `${pdf.tipInstalatie}: ${borehole.tipInstalatie}` : "",
    borehole.intocmit ? `${pdf.intocmit}: ${borehole.intocmit}` : "",
    borehole.categorie ? `${pdf.categorie}: ${L(borehole.categorie)}` : "",
  ].filter(Boolean);

  const colGap = 14;
  const colW = (523 - colGap) / 2;
  const leftX = pageLeft;
  const rightX = pageLeft + colW + colGap;
  const mid = Math.ceil(meta.length / 2);
  const left = meta.slice(0, mid);
  const right = meta.slice(mid);

  doc.fillColor("#000").font("Helvetica").fontSize(8.5);
  const rows = Math.max(left.length, right.length);
  for (let i = 0; i < rows; i++) {
    const rowTop = y;
    if (left[i]) {
      doc.text(ascii(left[i]), leftX, rowTop, { width: colW });
    }
    if (right[i]) {
      doc.text(ascii(right[i]), rightX, rowTop, { width: colW });
    }
    y = Math.max(doc.y, rowTop + 11) + 1;
  }

  doc.y = y + 4;
  doc.moveTo(pageLeft, doc.y).lineTo(pageRight, doc.y).stroke("#ccc");
  doc.y += 6;
}

function drawSyntheticLog(
  doc: PDFKit.PDFDocument,
  borehole: BoreholeData,
  pdf: PdfLabels,
  L: (v: string | null | undefined) => string,
) {
  const maxDepth = computeMaxDepth(borehole);
  /** Minimum vertical scale so strata stay readable (~18 pt / m). */
  const MIN_PX_PER_M = 18;
  const PAGE_BOTTOM = 800;
  const LEGEND_H = 72;
  const COL_HEADERS_H = 28;

  const x0 = 36;
  const wDepth = 42;
  const wLitho = 56;
  const wDesc = 235;
  const wSpt = 85;
  const wSamp = 105;
  const totalW = wDepth + wLitho + wDesc + wSpt + wSamp;
  const xDepth = x0;
  const xLitho = xDepth + wDepth;
  const xDesc = xLitho + wLitho;
  const xSpt = xDesc + wDesc;
  const xSamp = xSpt + wSpt;

  // Precompute SPT scale across the whole borehole
  const allSpt = borehole.samples
    .filter((s) => s.type === "SPT")
    .map((s) => {
      const d = parseSampleDepth(s.depthM);
      return d == null
        ? null
        : { d, n: sptN(s.type, s.sptValues), sptValues: s.sptValues };
    })
    .filter((x): x is NonNullable<typeof x> => x != null)
    .sort((a, b) => a.d - b.d);
  const nMaxData = allSpt.reduce(
    (m, it) => (it.n != null && it.n > m ? it.n : m),
    0,
  );
  const nScaleMax = Math.max(30, Math.ceil((nMaxData || 30) / 10) * 10);
  const bands = resolveVisibleBands(borehole.layers);

  type Segment = { from: number; to: number; first: boolean; last: boolean };
  const segments: Segment[] = [];
  let cursor = 0;
  let pageIndex = 0;
  while (cursor < maxDepth - 0.001) {
    const first = pageIndex === 0;
    // Estimate available height: first page starts at current doc.y
    const headerY = first ? doc.y : 48;
    const logTop = headerY + COL_HEADERS_H;
    const reserveLegend = true; // leave room; only draw legend on last
    const logBottom = PAGE_BOTTOM - (reserveLegend ? LEGEND_H : 24);
    const logH = Math.max(160, logBottom - logTop);
    const span = Math.max(1, Math.floor((logH / MIN_PX_PER_M) * 2) / 2); // 0.5 m steps
    const to = Math.min(maxDepth, cursor + span);
    segments.push({ from: cursor, to, first, last: false });
    cursor = to;
    pageIndex++;
  }
  if (segments.length === 0) {
    segments.push({ from: 0, to: maxDepth, first: true, last: true });
  } else {
    segments[segments.length - 1]!.last = true;
  }

  for (let si = 0; si < segments.length; si++) {
    const seg = segments[si]!;
    if (!seg.first) {
      doc.addPage();
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#000");
      doc.text(ascii(`${pdf.title} — ${borehole.code}`), 36, 36);
      doc.font("Helvetica").fontSize(8).fillColor("#555");
      const cont = ascii(
        pdf.logContinued
          .replace("{from}", seg.from.toFixed(1))
          .replace("{to}", seg.to.toFixed(1)),
      );
      doc.text(cont, 36, 50);
    }

    const headerY = seg.first ? doc.y : 62;
    const logTop = headerY + COL_HEADERS_H;
    const logBottom = PAGE_BOTTOM - (seg.last ? LEGEND_H : 28);
    const logH = Math.max(160, logBottom - logTop);
    const depthSpan = Math.max(0.5, seg.to - seg.from);
    const pxPerM = logH / depthSpan;
    const yAt = (depthM: number) => logTop + (depthM - seg.from) * pxPerM;
    const inSeg = (d: number) => d >= seg.from - 0.001 && d <= seg.to + 0.001;

    // Column headers
    doc.font("Helvetica-Bold").fontSize(7).fillColor("#000");
    const headers: [number, number, string][] = [
      [xDepth, wDepth, pdf.colDepth],
      [xLitho, wLitho, pdf.colLithology],
      [xDesc, wDesc, pdf.colDesc],
      [xSpt, wSpt, pdf.colSpt],
      [xSamp, wSamp, pdf.colSamples],
    ];
    for (const [x, w, label] of headers) {
      doc.rect(x, headerY, w, COL_HEADERS_H - 4).stroke("#888");
      doc.text(ascii(label), x + 2, headerY + 6, {
        width: w - 4,
        align: "center",
      });
    }

    doc
      .strokeColor("#333")
      .lineWidth(0.8)
      .rect(x0, logTop, totalW, logH)
      .stroke();

    let vx = xDepth;
    for (const w of [wDepth, wLitho, wDesc, wSpt]) {
      vx += w;
      doc
        .moveTo(vx, logTop)
        .lineTo(vx, logTop + logH)
        .stroke("#999");
    }

    // Depth ticks for this segment
    doc.font("Helvetica").fontSize(7).fillColor("#222");
    const step = depthSpan <= 8 ? 0.5 : 1;
    const tickStart = Math.ceil(seg.from / step) * step;
    for (let d = tickStart; d <= seg.to + 0.001; d += step) {
      const y = yAt(d);
      const major = Math.abs(d % 1) < 0.01 || Math.abs((d % 1) - 1) < 0.01;
      doc
        .strokeColor("#666")
        .lineWidth(major ? 0.7 : 0.35)
        .moveTo(xLitho - (major ? 6 : 3), y)
        .lineTo(xLitho, y)
        .stroke();
      if (major || step === 0.5) {
        doc.text(d.toFixed(step < 1 ? 1 : 0), xDepth + 2, y - 4, {
          width: wDepth - 8,
          align: "right",
        });
      }
    }

    // Layers intersecting this segment
    for (const band of bands) {
      const from = Math.max(band.fromM, seg.from);
      const to = Math.min(band.toM, seg.to);
      if (to - from < 0.001) continue;
      const y1 = yAt(from);
      const y2 = yAt(to);
      const h = Math.max(1, y2 - y1);
      drawLithologyCell(
        doc,
        xLitho,
        y1,
        wLitho,
        h,
        colorRgb(band.layer.color),
        patternForSoil(band.layer.type),
      );
      drawLayerDescription(
        doc,
        band.layer,
        band.fromM,
        band.toM,
        L,
        xDesc,
        y1,
        wDesc,
        h,
      );
      doc
        .strokeColor("#000000")
        .lineWidth(0.9)
        .moveTo(xLitho, y2)
        .lineTo(xSamp + wSamp, y2)
        .stroke();
    }

    if (bands.length === 0 && seg.first) {
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#666")
        .text(ascii(pdf.noEntries), xLitho + 4, logTop + 20, {
          width: wLitho + wDesc,
        });
    }

    // SPT for this segment
    const sptPlotPadL = 4;
    const sptPlotPadR = 36;
    const sptPlotX0 = xSpt + sptPlotPadL;
    const sptPlotW = Math.max(18, wSpt - sptPlotPadL - sptPlotPadR);
    const xAtN = (n: number) =>
      sptPlotX0 + (Math.max(0, Math.min(n, nScaleMax)) / nScaleMax) * sptPlotW;

    const sptHere = allSpt.filter((it) => inSeg(it.d));
    if (sptHere.some((it) => it.n != null)) {
      doc.save();
      doc.strokeColor("#c8c8c8").lineWidth(0.3);
      for (const tick of [0, nScaleMax / 2, nScaleMax]) {
        const tx = xAtN(tick);
        doc.moveTo(tx, logTop).lineTo(tx, logTop + logH).stroke();
      }
      doc.font("Helvetica").fontSize(5).fillColor("#666");
      doc.text("0", xAtN(0) - 2, headerY + COL_HEADERS_H - 10, { width: 10 });
      doc.text(
        String(nScaleMax / 2),
        xAtN(nScaleMax / 2) - 6,
        headerY + COL_HEADERS_H - 10,
        { width: 14, align: "center" },
      );
      doc.text(
        String(nScaleMax),
        xAtN(nScaleMax) - 8,
        headerY + COL_HEADERS_H - 10,
        { width: 14, align: "center" },
      );
      doc.restore();
    }

    // Polyline clipped to this depth segment (continuous across page breaks)
    const plottedAll = allSpt.filter(
      (it): it is { d: number; n: number; sptValues: string | null } =>
        it.n != null,
    );
    const pathPts: { d: number; n: number }[] = [];
    for (let i = 0; i < plottedAll.length - 1; i++) {
      const a = plottedAll[i]!;
      const b = plottedAll[i + 1]!;
      const aIn = inSeg(a.d);
      const bIn = inSeg(b.d);
      if (aIn && bIn) {
        if (pathPts.length === 0 || pathPts[pathPts.length - 1]!.d !== a.d) {
          pathPts.push(a);
        }
        pathPts.push(b);
      } else if (aIn && !bIn && b.d > seg.to) {
        if (pathPts.length === 0 || pathPts[pathPts.length - 1]!.d !== a.d) {
          pathPts.push(a);
        }
        const t = (seg.to - a.d) / (b.d - a.d);
        pathPts.push({ d: seg.to, n: a.n + t * (b.n - a.n) });
      } else if (!aIn && bIn && a.d < seg.from) {
        const t = (seg.from - a.d) / (b.d - a.d);
        pathPts.push({ d: seg.from, n: a.n + t * (b.n - a.n) });
        pathPts.push(b);
      }
    }
    if (pathPts.length >= 2) {
      doc.save();
      doc.strokeColor("#1a4a8a").lineWidth(1.1);
      doc.moveTo(xAtN(pathPts[0]!.n), yAt(pathPts[0]!.d));
      for (let i = 1; i < pathPts.length; i++) {
        doc.lineTo(xAtN(pathPts[i]!.n), yAt(pathPts[i]!.d));
      }
      doc.stroke();
      doc.restore();
    }

    const minSptGap = 14;
    let lastSptLabelY = -Infinity;
    for (const item of sptHere) {
      const yTrue = yAt(item.d);
      let yLabel = yTrue;
      if (yLabel - lastSptLabelY < minSptGap) {
        yLabel = lastSptLabelY + minSptGap;
      }
      lastSptLabelY = yLabel;
      const blows = formatSptBlows(item.sptValues);
      const labelX = xSpt + wSpt - sptPlotPadR + 1;

      if (item.n != null) {
        const px = xAtN(item.n);
        doc
          .strokeColor("#1a4a8a")
          .fillColor("#fff")
          .lineWidth(1)
          .circle(px, yTrue, 3)
          .fillAndStroke();
        if (Math.abs(yLabel - yTrue) > 0.5) {
          doc
            .strokeColor("#888")
            .lineWidth(0.35)
            .moveTo(px + 3, yTrue)
            .lineTo(labelX, yLabel)
            .stroke();
        }
        doc.fillColor("#000").font("Helvetica-Bold").fontSize(6);
        doc.text(ascii(`N=${item.n}`), labelX, yLabel - 7, {
          width: sptPlotPadR + 2,
        });
        if (blows) {
          doc.font("Helvetica").fontSize(5).fillColor("#333");
          doc.text(ascii(blows), labelX, yLabel + 1, {
            width: sptPlotPadR + 2,
          });
        }
      } else {
        doc
          .strokeColor("#666")
          .fillColor("#fff")
          .lineWidth(0.7)
          .circle(sptPlotX0 + 6, yTrue, 2.5)
          .fillAndStroke();
        doc.fillColor("#444").font("Helvetica").fontSize(5.5);
        doc.text(
          ascii(blows || item.sptValues?.trim() || "SPT"),
          labelX,
          yLabel - 3,
          { width: sptPlotPadR + 2 },
        );
      }
    }

    const sampSymX = xSamp + 10;
    const sampTextX = xSamp + 18;
    const waterZoneX1 = xSamp + Math.floor(wSamp * 0.58);
    const waterZoneX2 = xSamp + wSamp - 3;
    const sampTextW = Math.max(36, waterZoneX1 - sampTextX - 4);

    doc
      .strokeColor("#ddd")
      .lineWidth(0.3)
      .moveTo(waterZoneX1 - 2, logTop)
      .lineTo(waterZoneX1 - 2, logTop + logH)
      .stroke();

    const minSampGap = 11;
    let lastSampLabelY = -Infinity;
    for (const s of borehole.samples) {
      if (s.type === "SPT") continue;
      const d = parseSampleDepth(s.depthM);
      if (d == null || !inSeg(d)) continue;
      const yTrue = yAt(d);
      const label = ascii(L(s.type));
      doc.font("Helvetica").fontSize(5.5);
      const labelH = Math.max(
        8,
        doc.heightOfString(label, { width: sampTextW, lineGap: 0.5 }),
      );
      let yLabel = yTrue - labelH / 2 + 3;
      if (yLabel - lastSampLabelY < minSampGap) {
        yLabel = lastSampLabelY + minSampGap;
      }
      lastSampLabelY = yLabel + labelH;
      drawSampleSymbol(doc, sampSymX, yTrue, s.type);
      if (Math.abs(yLabel + 3 - yTrue) > 1) {
        doc
          .strokeColor("#999")
          .lineWidth(0.3)
          .moveTo(sampSymX + 4, yTrue)
          .lineTo(sampTextX, yLabel + 3)
          .stroke();
      }
      doc.fillColor("#000").font("Helvetica").fontSize(5.5);
      doc.text(label, sampTextX, yLabel, {
        width: sampTextW,
        lineGap: 0.5,
      });
    }

    for (const w of borehole.waterLevels) {
      if (w.duringM != null && inSeg(w.duringM)) {
        drawWaterMark(doc, waterZoneX1, yAt(w.duringM), waterZoneX2, "W");
      }
      if (w.after24hM != null && inSeg(w.after24hM)) {
        drawWaterMark(doc, waterZoneX1, yAt(w.after24hM), waterZoneX2, "W24");
      }
    }

    if (seg.last) {
      drawInlineLegend(doc, borehole, pdf, L, x0, logTop + logH + 8);
    } else {
      doc.y = logTop + logH + 4;
    }
  }
}

function drawLayerDescription(
  doc: PDFKit.PDFDocument,
  layer: LayerRow,
  fromM: number,
  toM: number,
  L: (v: string | null | undefined) => string,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const cons =
    layer.sandCompaction && layer.sandCompaction.length > 0
      ? L(layer.sandCompaction)
      : L(layer.consistency);
  const depth = `${fromM.toFixed(2)}–${toM.toFixed(2)} m`;
  const type = L(layer.type);
  const color = L(layer.color) !== "—" ? L(layer.color) : "";
  const notes = layer.notes?.trim() ?? "";
  const parts = [
    depth,
    type,
    cons !== "—" ? cons : "",
    color,
    notes,
  ].filter(Boolean);

  const pad = 2;
  const availH = Math.max(4, h - pad * 2);
  const textW = w - 6;

  // Prefer one line (A4 desc column is wide); shrink font before wrapping
  const oneLine = parts.join(" · ");
  let size = 7;
  let text = oneLine;
  let lineGap = 0;
  doc.font("Helvetica");
  for (const s of [7, 6.5, 6, 5.5, 5]) {
    doc.fontSize(s);
    if (doc.widthOfString(ascii(oneLine)) <= textW) {
      size = s;
      text = oneLine;
      break;
    }
    size = s;
  }
  // If still too wide even at 5pt, allow a soft wrap at mid · separator
  doc.fontSize(size);
  if (doc.widthOfString(ascii(text)) > textW && parts.length >= 3) {
    const mid = Math.ceil(parts.length / 2);
    text = `${parts.slice(0, mid).join(" · ")}\n${parts.slice(mid).join(" · ")}`;
    lineGap = 0.5;
  }

  doc.font("Helvetica").fontSize(size);
  const textH = Math.min(
    availH,
    doc.heightOfString(ascii(text), { width: textW, lineGap }),
  );
  const textY = y + Math.max(pad, (h - textH) / 2);

  doc.save();
  doc.rect(x, y, w, h).clip();
  doc.fillColor("#ffffff").rect(x, y, w, h).fill();
  doc.fillColor("#000000");
  doc.text(ascii(text), x + 3, textY, {
    width: textW,
    height: availH,
    lineGap,
    ellipsis: true,
  });
  doc.restore();
}

function drawSampleSymbol(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  type: string,
) {
  doc.save();
  doc.strokeColor("#000").fillColor("#000").lineWidth(0.7);
  const t = type.toLowerCase();
  if (t.includes("netulbur") || t.includes("undisturb") || t.includes("ungestört")) {
    doc.rect(x - 3, y - 3, 6, 6).fill();
  } else if (t.includes("calup") || t.includes("block")) {
    // filled triangle — block sample
    doc
      .moveTo(x, y - 4)
      .lineTo(x + 4, y + 3)
      .lineTo(x - 4, y + 3)
      .closePath()
      .fill();
  } else if (t.includes("carotier") || t.includes("core") || t.includes("kern")) {
    doc
      .moveTo(x, y - 4)
      .lineTo(x + 4, y)
      .lineTo(x, y + 4)
      .lineTo(x - 4, y)
      .closePath()
      .stroke();
  } else {
    doc.circle(x, y, 3).stroke();
  }
  doc.restore();
}

function drawWaterMark(
  doc: PDFKit.PDFDocument,
  x1: number,
  y: number,
  x2: number,
  label: string,
) {
  doc.save();
  doc.strokeColor("#1e5ab4").fillColor("#1e5ab4").lineWidth(1);
  doc.moveTo(x1, y).lineTo(x2, y).stroke();
  const triX = x1 + 2;
  doc
    .moveTo(triX, y)
    .lineTo(triX + 6, y)
    .lineTo(triX + 3, y + 5)
    .closePath()
    .fill();
  doc.font("Helvetica-Bold").fontSize(6.5);
  const labelW = doc.widthOfString(label);
  doc.text(label, x2 - labelW - 1, y - 9);
  doc.restore();
}

function drawInlineLegend(
  doc: PDFKit.PDFDocument,
  borehole: BoreholeData,
  pdf: PdfLabels,
  L: (v: string | null | undefined) => string,
  x: number,
  y: number,
) {
  doc.font("Helvetica-Bold").fontSize(8).fillColor("#000");
  doc.text(ascii(pdf.legend), x, y);
  y = doc.y + 4;

  const seen = new Map<
    string,
    { type: string; color: string | null; pattern: HatchPattern }
  >();
  for (const l of borehole.layers) {
    const key = `${l.type ?? ""}|${l.color ?? ""}`;
    if (!seen.has(key)) {
      seen.set(key, {
        type: l.type ?? "?",
        color: l.color,
        pattern: patternForSoil(l.type),
      });
    }
  }

  let xx = x;
  const maxX = 559;
  doc.font("Helvetica").fontSize(6);
  for (const item of seen.values()) {
    const label = ascii(
      `${L(item.type)}${item.color ? ` / ${L(item.color)}` : ""}`,
    );
    const sw = 18;
    const sh = 10;
    const textW = Math.min(120, doc.widthOfString(label) + 4);
    if (xx + sw + textW + 12 > maxX) {
      xx = x;
      y += 16;
    }
    drawLegendSwatch(
      doc,
      xx,
      y,
      sw,
      sh,
      colorRgb(item.color),
      item.pattern,
    );
    doc.fillColor("#000").text(label, xx + sw + 3, y + 1, { width: textW });
    xx += sw + textW + 14;
  }

  y += 18;
  doc.font("Helvetica").fontSize(6).fillColor("#333");
  doc.text(ascii(`${pdf.waterDuring}  ·  ${pdf.waterAfter24h}`), x, y);
}

/** Returns true if an annex page was opened (for photo continuation). */
function drawAnnexPage(
  doc: PDFKit.PDFDocument,
  borehole: BoreholeData,
  pdf: PdfLabels,
  L: (v: string | null | undefined) => string,
): boolean {
  const hasEquip = borehole.equipment.length > 0;
  const hasWaterTable = borehole.waterLevels.length > 0;
  const hasPmt = borehole.pmtReadings.length > 0;
  const hasOtv = borehole.otvReadings.length > 0;
  const hasPp = borehole.ppReadings.length > 0;
  const hasVst = borehole.vstReadings.length > 0;
  const hasRqd = borehole.rqdReadings.length > 0;
  if (
    !hasEquip &&
    !hasWaterTable &&
    !hasPmt &&
    !hasOtv &&
    !hasPp &&
    !hasVst &&
    !hasRqd
  ) {
    return false;
  }

  doc.addPage();
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#000");
  doc.text(ascii(`${pdf.title} — ${borehole.code}`), 36, 36);
  doc.moveDown(0.5);

  if (hasWaterTable) {
    section(doc, pdf.water);
    table(
      doc,
      [pdf.date, pdf.during, pdf.after24h, pdf.notes],
      borehole.waterLevels.map((w) => [
        fmtDate(w.date),
        w.duringM?.toString() ?? "-",
        w.after24hM?.toString() ?? "-",
        w.notes ?? "-",
      ]),
    );
    doc.moveDown(0.6);
  }

  if (hasPmt) {
    section(doc, pdf.pmt);
    table(
      doc,
      ["Type", pdf.fromM, pdf.toM, pdf.date, pdf.notes],
      borehole.pmtReadings.map((r) => [
        r.presiometerType,
        String(r.depthFromM),
        String(r.depthToM),
        fmtDate(r.testDate),
        r.notes ?? "-",
      ]),
    );
    doc.moveDown(0.6);
  }

  if (hasOtv) {
    section(doc, pdf.otv);
    table(
      doc,
      [pdf.type, pdf.fromM, pdf.toM, pdf.date, pdf.notes],
      borehole.otvReadings.map((r) => [
        L(r.testKind),
        String(r.depthFromM),
        String(r.depthToM),
        fmtDate(r.testDate),
        r.notes ?? "-",
      ]),
    );
    doc.moveDown(0.6);
  }

  if (hasPp) {
    section(doc, pdf.pp);
    table(
      doc,
      ["Plunger", pdf.fromM, pdf.toM, "Values"],
      borehole.ppReadings.map((r) => [
        r.plunger,
        String(r.depthFrom),
        String(r.depthTo),
        r.valuesCsv || "-",
      ]),
    );
    doc.moveDown(0.6);
  }

  if (hasVst) {
    section(doc, pdf.vst);
    table(
      doc,
      ["Vane", pdf.fromM, pdf.toM, "kg/cm2"],
      borehole.vstReadings.map((r) => [
        L(r.vaneSize),
        String(r.depthFrom),
        String(r.depthTo),
        String(r.valueKgCm2),
      ]),
    );
    doc.moveDown(0.6);
  }

  if (hasRqd) {
    section(doc, pdf.rqd);
    table(
      doc,
      [pdf.fromM, pdf.toM, "RQD%", "TCR%", "SCR%", "Rule"],
      borehole.rqdReadings.map((r) => [
        String(r.depthFrom),
        String(r.depthTo),
        String(r.rqdPercent),
        String(r.tcrPercent),
        String(r.scrPercent),
        r.scrRule ?? "-",
      ]),
    );
    doc.moveDown(0.6);
  }

  if (hasEquip) {
    section(doc, pdf.equipment);
    table(
      doc,
      [pdf.type, pdf.fromM, pdf.toM],
      borehole.equipment.map((e) => [L(e.type), String(e.fromM), String(e.toM)]),
    );
    doc.moveDown(0.6);
  }

  return true;
}

/**
 * Photo annex: continue on the same page after annex text when possible,
 * otherwise new pages — 2 columns, up to 4 photos per full page.
 */
function drawPhotoPages(
  doc: PDFKit.PDFDocument,
  borehole: BoreholeData,
  pdf: PdfLabels,
  annexStarted: boolean,
) {
  const photos = borehole.photos.filter((p) => p.bytes && p.bytes.length > 0);
  if (photos.length === 0) return;

  const pageLeft = 36;
  const pageRight = 559;
  const pageBottom = 800;
  const gap = 10;
  const cols = 2;
  const cellW = (pageRight - pageLeft - gap) / cols;
  const captionH = 14;
  const minCellH = 150;
  const fullCellH = 340;

  let onContentPage = annexStarted;
  let y = doc.y + 8;
  let pageHasTitle = false;
  let rowCellH = fullCellH;

  const startNewPage = () => {
    doc.addPage();
    y = 56;
    pageHasTitle = false;
    onContentPage = true;
  };

  const ensureTitle = () => {
    if (!onContentPage) startNewPage();
    if (!pageHasTitle) {
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#000");
      doc.text(
        ascii(`${pdf.photos} — ${borehole.code} (${photos.length})`),
        pageLeft,
        y,
      );
      y = doc.y + 8;
      pageHasTitle = true;
    }
  };

  for (let i = 0; i < photos.length; i++) {
    const col = i % cols;
    if (col === 0) {
      ensureTitle();
      if (y + minCellH > pageBottom) {
        startNewPage();
        ensureTitle();
      }
      const remaining = pageBottom - y;
      rowCellH =
        remaining >= fullCellH * 2 + gap
          ? fullCellH
          : Math.max(minCellH, Math.min(fullCellH, remaining - 4));
    }

    const imgH = rowCellH - captionH - 4;
    const x = pageLeft + col * (cellW + gap);
    const ph = photos[i]!;

    doc
      .strokeColor("#cccccc")
      .lineWidth(0.5)
      .rect(x, y, cellW, rowCellH)
      .stroke();

    try {
      doc.image(ph.bytes!, x + 4, y + 4, {
        fit: [cellW - 8, imgH],
        align: "center",
        valign: "center",
      });
    } catch {
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#888")
        .text("(image)", x + 8, y + imgH / 2, { width: cellW - 16 });
    }

    const captionParts = [
      ph.name?.trim() || `Foto ${i + 1}`,
      ph.depthM != null ? `${ph.depthM} m` : "",
    ].filter(Boolean);
    doc
      .font("Helvetica")
      .fontSize(7.5)
      .fillColor("#222")
      .text(ascii(captionParts.join(" · ")), x + 4, y + rowCellH - captionH, {
        width: cellW - 8,
        height: captionH - 2,
        ellipsis: true,
      });

    if (col === cols - 1 || i === photos.length - 1) {
      y += rowCellH + gap;
    }
  }
}

function section(doc: PDFKit.PDFDocument, title: string) {
  doc.font("Helvetica-Bold").fontSize(11).fillColor("#000").text(ascii(title));
  doc.moveDown(0.3);
}

function table(
  doc: PDFKit.PDFDocument,
  headers: string[],
  rows: string[][],
) {
  const colW = (559 - 36) / headers.length;
  const startX = 36;
  let y = doc.y;
  doc.font("Helvetica-Bold").fontSize(8).fillColor("#000");
  headers.forEach((h, i) => {
    doc.text(ascii(h), startX + i * colW, y, {
      width: colW - 4,
      continued: false,
    });
  });
  y = doc.y + 2;
  doc.moveTo(startX, y).lineTo(559, y).stroke("#ccc");
  y += 4;
  doc.font("Helvetica").fontSize(8);
  for (const row of rows) {
    if (y > 780) {
      doc.addPage();
      y = 36;
    }
    let rowH = 12;
    row.forEach((cell, i) => {
      const h = doc.heightOfString(ascii(cell), { width: colW - 4 });
      rowH = Math.max(rowH, h);
      doc.text(ascii(cell), startX + i * colW, y, { width: colW - 4 });
    });
    y += rowH + 4;
    doc.y = y;
  }
}
