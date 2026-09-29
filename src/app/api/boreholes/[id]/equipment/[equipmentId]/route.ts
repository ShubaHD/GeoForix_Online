import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string; equipmentId: string }> },
) {
  await requireSession();
  const { equipmentId } = await ctx.params;
  await prisma.equipment.delete({ where: { id: equipmentId } });
  return NextResponse.json({ ok: true });
}
