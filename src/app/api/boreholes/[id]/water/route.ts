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
  const numOrNull = (v: unknown) => {
    if (v === null || v === "" || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const row = await prisma.waterLevel.create({
    data: {
      boreholeId,
      duringM: numOrNull(body.duringM),
      after24hM: numOrNull(body.after24hM),
      notes: body.notes ? String(body.notes).trim() || null : null,
      date: body.date ? new Date(String(body.date)) : new Date(),
    },
  });
  return NextResponse.json(row, { status: 201 });
}
