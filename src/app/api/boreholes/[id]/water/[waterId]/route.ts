import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string; waterId: string }> },
) {
  await requireSession();
  const { waterId } = await ctx.params;
  await prisma.waterLevel.delete({ where: { id: waterId } });
  return NextResponse.json({ ok: true });
}
