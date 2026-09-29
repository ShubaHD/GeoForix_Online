import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  await requireSession();
  const { id: boreholeId } = await ctx.params;
  const body = await req.json();
  const depthFrom = Number(body.depthFrom);
  const depthTo = Number(body.depthTo);
  const plunger = String(body.plunger ?? "").trim();
  const valuesCsv = String(body.valuesCsv ?? body.values ?? "")
    .trim()
    .replace(/;/g, ",");
  if (!plunger || !Number.isFinite(depthFrom) || !Number.isFinite(depthTo)) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }
  const row = await prisma.ppReading.create({
    data: { boreholeId, plunger, depthFrom, depthTo, valuesCsv },
  });
  return NextResponse.json(row, { status: 201 });
}
