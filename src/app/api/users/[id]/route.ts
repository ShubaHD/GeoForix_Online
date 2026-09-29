import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
  } catch (e) {
    const status = (e as Error & { status?: number }).status ?? 401;
    return NextResponse.json({ error: "Forbidden" }, { status });
  }
  const { id } = await ctx.params;
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
