import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string; photoId: string }> },
) {
  await requireSession();
  const { photoId } = await ctx.params;
  const body = await req.json();
  const photo = await prisma.photo.update({
    where: { id: photoId },
    data: {
      name: body.name !== undefined ? String(body.name) : undefined,
      depthM:
        body.depthM !== undefined
          ? body.depthM === null || body.depthM === ""
            ? null
            : Number(body.depthM)
          : undefined,
    },
  });
  return NextResponse.json(photo);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string; photoId: string }> },
) {
  await requireSession();
  const { photoId } = await ctx.params;
  await prisma.photo.delete({ where: { id: photoId } });
  return NextResponse.json({ ok: true });
}
