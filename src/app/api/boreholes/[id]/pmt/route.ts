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
  if (!Number.isFinite(depthFromM) || !Number.isFinite(depthToM)) {
    return NextResponse.json({ error: "Adâncimi invalide" }, { status: 400 });
  }
  const row = await prisma.pmtReading.create({
    data: {
      boreholeId,
      presiometerType: String(body.presiometerType ?? "OYO").trim() || "OYO",
      depthFromM,
      depthToM,
      testDate: body.testDate ? new Date(String(body.testDate)) : new Date(),
      notes: body.notes ? String(body.notes).trim() || null : null,
    },
  });
  return NextResponse.json(row, { status: 201 });
}
