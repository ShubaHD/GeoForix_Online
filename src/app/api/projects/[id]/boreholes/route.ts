import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  await requireSession();
  const { id: projectId } = await ctx.params;
  const body = await req.json();
  const code = String(body.code ?? "").trim();
  const notes = String(body.notes ?? "").trim() || null;
  if (!code) {
    return NextResponse.json({ error: "Cod foraj obligatoriu" }, { status: 400 });
  }
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return NextResponse.json({ error: "Proiect inexistent" }, { status: 404 });
  }
  try {
    const borehole = await prisma.borehole.create({
      data: {
        projectId,
        code,
        notes,
        drilledAt: body.drilledAt ? new Date(String(body.drilledAt)) : null,
        depthMeters:
          body.depthMeters != null && body.depthMeters !== ""
            ? Number(body.depthMeters)
            : null,
      },
    });
    return NextResponse.json(borehole);
  } catch {
    return NextResponse.json(
      { error: "Codul de foraj există deja în proiect" },
      { status: 409 },
    );
  }
}
