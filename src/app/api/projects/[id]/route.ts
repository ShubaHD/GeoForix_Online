import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  await requireSession();
  const { id } = await ctx.params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      boreholes: { orderBy: { code: "asc" } },
    },
  });
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  await requireSession();
  const { id } = await ctx.params;
  const body = await req.json();
  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        name: body.name != null ? String(body.name).trim() : undefined,
        topic:
          body.topic !== undefined
            ? String(body.topic ?? "").trim() || null
            : undefined,
        location:
          body.location !== undefined
            ? String(body.location ?? "").trim() || null
            : undefined,
        client:
          body.client !== undefined
            ? String(body.client ?? "").trim() || null
            : undefined,
        description:
          body.description !== undefined
            ? String(body.description ?? "").trim() || null
            : undefined,
      },
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  await requireSession();
  const { id } = await ctx.params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
