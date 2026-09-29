import { NextResponse } from "next/server";
import path from "path";
import { readUpload } from "@/lib/storage";
import { requireSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  await requireSession();
  const { path: parts } = await params;
  const rel = parts.join("/");
  if (rel.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  try {
    const data = await readUpload(rel);
    const ext = path.extname(rel).toLowerCase();
    const type =
      ext === ".png"
        ? "image/png"
        : ext === ".webp"
          ? "image/webp"
          : ext === ".pdf"
            ? "application/pdf"
            : "image/jpeg";
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
