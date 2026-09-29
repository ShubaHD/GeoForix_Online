export type HatchPattern =
  | "topsoil"
  | "asphalt"
  | "concrete"
  | "clay"
  | "clayey"
  | "silt"
  | "silty_sand"
  | "sand"
  | "gravel"
  | "boulder"
  | "rock"
  | "fractured_rock"
  | "generic";

export function colorRgb(label: string | null | undefined): string {
  if (!label) return "#d2d2d2";
  return COLOR_HEX[label] ?? "#d2d2d2";
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
      .join("")
  );
}

const COLOR_HEX: Record<string, string> = Object.fromEntries(
  Object.entries({
    "BRUN (sau MARONIU)": [121, 85, 61],
    "BRUN (sau MARONIU) GALBUI": [166, 124, 62],
    "BRUN (sau MARONIU) ROSIATIC": [160, 82, 68],
    CAFENIU: [196, 154, 108],
    "CAFENIU GALBUI": [210, 180, 120],
    ROSIATIC: [196, 96, 80],
    GALBUI: [212, 184, 74],
    "GALBUI ALBICIOS": [232, 214, 150],
    "BRUN NEGRICIOS": [62, 42, 31],
    NEGRU: [40, 40, 40],
    CENUSIU: [154, 160, 166],
    "CENUSIU VERZUI": [130, 150, 138],
    "CENUSIU ALBICIOS": [200, 204, 208],
    "CENUSIU NEGRICIOS": [90, 94, 98],
    "CENUSIU ALBASTRUI": [130, 148, 168],
  } as Record<string, [number, number, number]>).map(([k, v]) => [
    k,
    rgbToHex(v[0], v[1], v[2]),
  ]),
);

export function patternForSoil(type: string | null | undefined): HatchPattern {
  if (!type) return "generic";
  const t = type.toLowerCase();
  if (t.includes("vegetal")) return "topsoil";
  if (t.includes("asfalt")) return "asphalt";
  if (t.includes("beton")) return "concrete";
  if (t.includes("bolovan") || t.includes("blocuri")) return "boulder";
  if (t.includes("pietris")) return "gravel";
  if (t.includes("fracturata") || t.includes("fracturată")) return "fractured_rock";
  if (t.includes("roca") || t.includes("rocă")) return "rock";
  if (t.includes("argila") || t.includes("argilă")) {
    if (t.includes("nisip") || t.includes("praf")) return "clayey";
    return "clay";
  }
  if (t.includes("praf")) {
    if (t.includes("nisip")) return "silty_sand";
    return "silt";
  }
  if (t.includes("nisip")) {
    if (t.includes("praf") || t.includes("argil")) return "silty_sand";
    return "sand";
  }
  return "generic";
}

/** Clip + fill with soil colour, then draw hatch, then border. */
export function drawLithologyCell(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  pattern: HatchPattern,
) {
  if (h <= 0.5 || w <= 0) return;

  doc.save();
  doc.rect(x, y, w, h).clip();

  doc.fillColor(fill).rect(x, y, w, h).fill();

  doc.strokeColor("#1e1e1e").fillColor("#1e1e1e").lineWidth(0.4);
  drawHatch(doc, x, y, w, h, pattern);

  doc.restore();

  doc.strokeColor("#282828").lineWidth(0.7).rect(x, y, w, h).stroke();
}

export function drawHatch(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  w: number,
  h: number,
  pattern: HatchPattern,
) {
  const right = x + w;
  const bottom = y + h;

  switch (pattern) {
    case "clay": {
      // Short dashed horizontals — full-width lines look like false layer boundaries
      doc.lineWidth(0.35).strokeColor("#3a3a3a");
      for (let yy = y + 2.5; yy < bottom - 0.5; yy += 4) {
        for (let xx = x + 2; xx < right - 2; xx += 7) {
          doc
            .moveTo(xx, yy)
            .lineTo(Math.min(xx + 4, right - 1), yy)
            .stroke();
        }
      }
      break;
    }
    case "clayey": {
      doc.lineWidth(0.35).strokeColor("#3a3a3a");
      for (let yy = y + 2.5; yy < bottom - 0.5; yy += 4.5) {
        for (let xx = x + 2; xx < right - 2; xx += 8) {
          doc
            .moveTo(xx, yy)
            .lineTo(Math.min(xx + 4.5, right - 1), yy)
            .stroke();
        }
      }
      doc.fillColor("#1e1e1e");
      for (let yy = y + 4; yy < bottom; yy += 7) {
        for (let xx = x + 4; xx < right; xx += 6) {
          doc.circle(xx, yy, 0.5).fill();
        }
      }
      break;
    }
    case "silt": {
      for (let yy = y + 2.5; yy < bottom; yy += 4) {
        doc.moveTo(x, yy).lineTo(right, yy).stroke();
      }
      for (let yy = y + 4; yy < bottom; yy += 5) {
        for (let xx = x + 2.5; xx < right; xx += 5) {
          doc.circle(xx, yy, 0.45).fill();
        }
      }
      break;
    }
    case "sand": {
      for (let yy = y + 2; yy < bottom; yy += 4) {
        for (let xx = x + 2 + ((Math.floor(yy / 4) % 2) * 2); xx < right; xx += 4) {
          doc.circle(xx, yy, 0.6).fill();
        }
      }
      break;
    }
    case "silty_sand": {
      for (let yy = y + 2; yy < bottom; yy += 4.5) {
        for (let xx = x + 2; xx < right; xx += 4.5) {
          doc.circle(xx, yy, 0.5).fill();
        }
      }
      for (let yy = y + 3; yy < bottom; yy += 6) {
        doc.moveTo(x, yy).lineTo(right, yy).stroke();
      }
      break;
    }
    case "gravel": {
      for (let yy = y + 4; yy < bottom - 2; yy += 7) {
        for (let xx = x + 4; xx < right - 2; xx += 8) {
          doc.circle(xx, yy, 2.2).stroke();
        }
      }
      break;
    }
    case "boulder": {
      for (let yy = y + 5; yy < bottom - 2; yy += 10) {
        for (let xx = x + 5; xx < right - 2; xx += 11) {
          const r = 3.2;
          doc
            .moveTo(xx, yy - r)
            .lineTo(xx + r * 0.9, yy - r * 0.2)
            .lineTo(xx + r * 0.5, yy + r)
            .lineTo(xx - r * 0.6, yy + r * 0.7)
            .lineTo(xx - r, yy - r * 0.1)
            .closePath()
            .stroke();
        }
      }
      break;
    }
    case "rock": {
      const step = 5;
      for (let i = -h; i < w + h; i += step) {
        doc.moveTo(x + i, y).lineTo(x + i + h, bottom).stroke();
        doc.moveTo(x + i, bottom).lineTo(x + i + h, y).stroke();
      }
      break;
    }
    case "fractured_rock": {
      const step = 6;
      for (let i = -h; i < w + h; i += step) {
        doc.moveTo(x + i, y).lineTo(x + i + h, bottom).stroke();
      }
      for (let yy = y + 4; yy < bottom; yy += 8) {
        doc.moveTo(x, yy).lineTo(right, yy).stroke();
      }
      break;
    }
    case "topsoil": {
      for (let yy = y + 3; yy < bottom; yy += 5) {
        let xx = x + 1;
        doc.moveTo(xx, yy);
        while (xx < right) {
          doc.quadraticCurveTo(xx + 1.5, yy - 1.8, xx + 3, yy);
          xx += 3;
        }
        doc.stroke();
      }
      break;
    }
    case "asphalt": {
      doc.fillColor("#323232").opacity(0.35).rect(x, y, w, h).fill().opacity(1);
      doc.strokeColor("#1e1e1e").fillColor("#1e1e1e");
      for (let i = -h; i < w + h; i += 8) {
        doc.moveTo(x + i, y).lineTo(x + i + h, bottom).stroke();
      }
      break;
    }
    case "concrete": {
      for (let i = -h; i < w + h; i += 7) {
        doc.moveTo(x + i, y).lineTo(x + i + h, bottom).stroke();
      }
      for (let yy = y + 4; yy < bottom; yy += 6) {
        for (let xx = x + 3; xx < right; xx += 6) {
          doc.circle(xx, yy, 0.4).fill();
        }
      }
      break;
    }
    default: {
      for (let i = -h; i < w + h; i += 5) {
        doc.moveTo(x + i, y).lineTo(x + i + h, bottom).stroke();
      }
    }
  }
}

/** Legend swatch used on page 2. */
export function drawLegendSwatch(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  pattern: HatchPattern,
) {
  drawLithologyCell(doc, x, y, w, h, fill, pattern);
}
