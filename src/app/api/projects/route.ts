import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function GET() {
  await requireSession();
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { boreholes: true } } },
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  await requireSession();
  const body = await req.json();
  const code = String(body.code ?? "").trim();
  const name = String(body.name ?? "").trim();
  const topic = String(body.topic ?? "").trim() || null;
  const location = String(body.location ?? "").trim() || null;
  const client = String(body.client ?? "").trim() || null;
  const description = String(body.description ?? "").trim() || null;
  if (!code || !name) {
    return NextResponse.json(
      { error: "Cod și denumire obligatorii" },
      { status: 400 },
    );
  }
  try {
    const project = await prisma.project.create({
      data: { code, name, topic, location, client, description },
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Codul există deja" }, { status: 409 });
  }
}
