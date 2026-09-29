import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string; sampleId: string }> },
) {
  await requireSession();
  const { sampleId } = await ctx.params;
  await prisma.sample.delete({ where: { id: sampleId } });
  return NextResponse.json({ ok: true });
}
