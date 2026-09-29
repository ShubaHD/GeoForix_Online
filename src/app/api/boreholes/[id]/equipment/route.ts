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
  const type = String(body.type ?? "").trim();
  const fromM = Number(body.fromM);
  const toM = Number(body.toM);
  if (!type || !Number.isFinite(fromM) || !Number.isFinite(toM)) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }
  const row = await prisma.equipment.create({
    data: { boreholeId, type, fromM, toM },
  });
  return NextResponse.json(row, { status: 201 });
}
