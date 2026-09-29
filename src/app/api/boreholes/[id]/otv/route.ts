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
  const depthFromM = Number(body.depthFromM);
  const depthToM = Number(body.depthToM);
  const testKind = String(body.testKind ?? "").trim();
  if (!testKind || !Number.isFinite(depthFromM) || !Number.isFinite(depthToM)) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }
  const row = await prisma.otvReading.create({
    data: {
      boreholeId,
      testKind,
      depthFromM,
      depthToM,
      testDate: body.testDate ? new Date(String(body.testDate)) : new Date(),
      notes: body.notes ? String(body.notes).trim() || null : null,
    },
  });
  return NextResponse.json(row, { status: 201 });
}
