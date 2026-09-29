import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { getCompanySettings, loadCompanyLogoBuffer } from "@/lib/company";
import { buildFisaPdf } from "@/lib/export/fisa-pdf";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/server";
import { readUpload } from "@/lib/storage";

export const runtime = "nodejs";

async function loadPhotoBytes(filePath: string): Promise<Buffer | null> {
  try {
    return await readUpload(filePath);
  } catch {
    return null;
  }
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  await requireSession();
  const { id } = await ctx.params;
  const url = new URL(req.url);
  const langParam = url.searchParams.get("lang");
  const locale: Locale = isLocale(langParam) ? langParam : await getLocale();

  const borehole = await prisma.borehole.findUnique({
    where: { id },
    include: {
      project: true,
      layers: { orderBy: [{ sortOrder: "asc" }, { fromM: "asc" }] },
      samples: { orderBy: { createdAt: "asc" } },
      waterLevels: { orderBy: { date: "desc" } },
      equipment: { orderBy: { fromM: "asc" } },
      photos: { orderBy: { createdAt: "asc" } },
      pmtReadings: { orderBy: { depthFromM: "asc" } },
      otvReadings: { orderBy: { depthFromM: "asc" } },
      ppReadings: { orderBy: { depthFrom: "asc" } },
      vstReadings: { orderBy: { depthFrom: "asc" } },
      rqdReadings: { orderBy: { depthFrom: "asc" } },
    },
  });
  if (!borehole) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const company = await getCompanySettings();
  const logoBytes = await loadCompanyLogoBuffer(company.logoPath);

  const photosWithBytes = await Promise.all(
    borehole.photos.map(async (p) => ({
      name: p.name,
      depthM: p.depthM,
      filePath: p.filePath,
      bytes: await loadPhotoBytes(p.filePath),
    })),
  );

  const pdf = await buildFisaPdf(
    {
      name: borehole.project.name,
      topic: borehole.project.topic,
      location: borehole.project.location,
      client: borehole.project.client,
    },
    {
      code: borehole.code,
      depthMeters: borehole.depthMeters,
      latitude: borehole.latitude,
      longitude: borehole.longitude,
      kilometraj: borehole.kilometraj,
      tipInstalatie: borehole.tipInstalatie,
      intocmit: borehole.intocmit,
      categorie: borehole.categorie,
      layers: borehole.layers,
      samples: borehole.samples,
      waterLevels: borehole.waterLevels,
      equipment: borehole.equipment,
      photos: photosWithBytes,
      pmtReadings: borehole.pmtReadings,
      otvReadings: borehole.otvReadings,
      ppReadings: borehole.ppReadings,
      vstReadings: borehole.vstReadings,
      rqdReadings: borehole.rqdReadings,
    },
    locale,
    {
      name: company.name,
      address: company.address,
      phone: company.phone,
      email: company.email,
      website: company.website,
      vatId: company.vatId,
      logoBytes,
    },
  );

  const filename = `Fisa_${borehole.code}_${locale}.pdf`;
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
