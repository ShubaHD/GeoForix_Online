import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { saveUpload } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  await requireSession();
  const { id: boreholeId } = await ctx.params;
  const borehole = await prisma.borehole.findUnique({ where: { id: boreholeId } });
  if (!borehole) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    const blobPath = String(body.blobPath ?? "");
    if (!blobPath) {
      return NextResponse.json({ error: "blobPath required" }, { status: 400 });
    }
    const photo = await prisma.photo.create({
      data: {
        boreholeId,
        filePath: blobPath,
        name: String(body.name ?? body.originalName ?? ""),
        depthM:
          body.depthM != null && body.depthM !== ""
            ? Number(body.depthM)
            : null,
      },
    });
    return NextResponse.json(photo, { status: 201 });
  }

  const fd = await req.formData();
  const files = fd.getAll("photos").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No files" }, { status: 400 });
  }
  const caption = String(fd.get("name") ?? "").trim();
  const depthRaw = fd.get("depthM");
  const depthM =
    depthRaw != null && String(depthRaw).trim() !== ""
      ? Number(depthRaw)
      : null;
  const created = [];
  for (const file of files) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const filePath = await saveUpload(
      `boreholes/${boreholeId}/photos`,
      file.name,
      bytes,
    );
    const photo = await prisma.photo.create({
      data: {
        boreholeId,
        filePath,
        name: caption || file.name,
        depthM: Number.isFinite(depthM) ? depthM : null,
      },
    });
    created.push(photo);
  }
  return NextResponse.json(created, { status: 201 });
}
