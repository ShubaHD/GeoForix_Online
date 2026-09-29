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
  const depthM = String(body.depthM ?? "").trim();
  const type = String(body.type ?? "").trim();
  if (!depthM || !type) {
    return NextResponse.json({ error: "Adâncime și tip obligatorii" }, { status: 400 });
  }
  const sample = await prisma.sample.create({
    data: {
      boreholeId,
      depthM,
      type,
      sptValues: body.sptValues ? String(body.sptValues).trim() || null : null,
      notes: body.notes ? String(body.notes).trim() || null : null,
    },
  });
  return NextResponse.json(sample, { status: 201 });
}
