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
  const rqdPercent = Number(body.rqdPercent);
  const tcrPercent = Number(body.tcrPercent ?? 0);
  const scrPercent = Number(body.scrPercent ?? 0);
  if (
    !Number.isFinite(depthFrom) ||
    !Number.isFinite(depthTo) ||
    !Number.isFinite(rqdPercent)
  ) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }
  const row = await prisma.rqdReading.create({
    data: {
      boreholeId,
      depthFrom,
      depthTo,
      rqdPercent,
      tcrPercent: Number.isFinite(tcrPercent) ? tcrPercent : 0,
      scrPercent: Number.isFinite(scrPercent) ? scrPercent : 0,
      scrRule: body.scrRule ? String(body.scrRule).trim() || null : null,
    },
  });
  return NextResponse.json(row, { status: 201 });
}
