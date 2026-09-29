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
  const valueKgCm2 = Number(body.valueKgCm2);
  const vaneSize = String(body.vaneSize ?? "").trim();
  if (
    !vaneSize ||
    !Number.isFinite(depthFrom) ||
    !Number.isFinite(depthTo) ||
    !Number.isFinite(valueKgCm2)
  ) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }
  const row = await prisma.vstReading.create({
    data: { boreholeId, vaneSize, depthFrom, depthTo, valueKgCm2 },
  });
  return NextResponse.json(row, { status: 201 });
}
