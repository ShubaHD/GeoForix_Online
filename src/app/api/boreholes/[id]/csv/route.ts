import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { buildBoreholeCsv } from "@/lib/export/borehole-csv";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  await requireSession();
  const { id } = await ctx.params;

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

  const csv = buildBoreholeCsv({
    code: borehole.code,
    depthMeters: borehole.depthMeters,
    latitude: borehole.latitude,
    longitude: borehole.longitude,
    kilometraj: borehole.kilometraj,
    tipInstalatie: borehole.tipInstalatie,
    intocmit: borehole.intocmit,
    categorie: borehole.categorie,
    notes: borehole.notes,
    project: {
      code: borehole.project.code,
      name: borehole.project.name,
      topic: borehole.project.topic,
      location: borehole.project.location,
      client: borehole.project.client,
    },
    layers: borehole.layers,
    samples: borehole.samples,
    waterLevels: borehole.waterLevels,
    equipment: borehole.equipment,
    photos: borehole.photos,
    pmtReadings: borehole.pmtReadings,
    otvReadings: borehole.otvReadings,
    ppReadings: borehole.ppReadings,
    vstReadings: borehole.vstReadings,
    rqdReadings: borehole.rqdReadings,
  });

  const filename = `GeoForix_${borehole.code}.csv`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
