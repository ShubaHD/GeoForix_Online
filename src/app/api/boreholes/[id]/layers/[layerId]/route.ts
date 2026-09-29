import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string; layerId: string }> },
) {
  await requireSession();
  const { layerId } = await ctx.params;
  await prisma.lithologyLayer.delete({ where: { id: layerId } });
  return NextResponse.json({ ok: true });
}
