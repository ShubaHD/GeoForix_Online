import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string; readingId: string }> },
) {
  await requireSession();
  const { readingId } = await ctx.params;
  await prisma.vstReading.delete({ where: { id: readingId } });
  return NextResponse.json({ ok: true });
}
