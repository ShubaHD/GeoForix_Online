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
  const fromM = Number(body.fromM);
  const toM = Number(body.toM);
  if (!Number.isFinite(fromM) || !Number.isFinite(toM)) {
    return NextResponse.json({ error: "Adâncimi invalide" }, { status: 400 });
  }
  const count = await prisma.lithologyLayer.count({ where: { boreholeId } });
  const layer = await prisma.lithologyLayer.create({
    data: {
      boreholeId,
      fromM,
      toM,
      type: body.type ? String(body.type) : null,
      consistency: body.consistency ? String(body.consistency) : null,
      sandCompaction: body.sandCompaction ? String(body.sandCompaction) : null,
      color: body.color ? String(body.color) : null,
      notes: body.notes ? String(body.notes).trim() || null : null,
      sortOrder: count,
    },
  });
  return NextResponse.json(layer, { status: 201 });
}
