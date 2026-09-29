import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

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
      photos: { orderBy: { createdAt: "desc" } },
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
  return NextResponse.json(borehole);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  await requireSession();
  const { id } = await ctx.params;
  const body = await req.json();

  const numOrNull = (v: unknown) => {
    if (v === undefined) return undefined;
    if (v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const strOrNull = (v: unknown) => {
    if (v === undefined) return undefined;
    const s = String(v ?? "").trim();
    return s || null;
  };

  try {
    const borehole = await prisma.borehole.update({
      where: { id },
      data: {
        code: body.code != null ? String(body.code).trim() : undefined,
        depthMeters: numOrNull(body.depthMeters),
        latitude: numOrNull(body.latitude),
        longitude: numOrNull(body.longitude),
        kilometraj: strOrNull(body.kilometraj),
        tipInstalatie: strOrNull(body.tipInstalatie),
        intocmit: strOrNull(body.intocmit),
        categorie: strOrNull(body.categorie),
        notes: strOrNull(body.notes),
        drilledAt:
          body.drilledAt !== undefined
            ? body.drilledAt
              ? new Date(String(body.drilledAt))
              : null
            : undefined,
      },
    });
    return NextResponse.json(borehole);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  await requireSession();
  const { id } = await ctx.params;
  await prisma.borehole.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
