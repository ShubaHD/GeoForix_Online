import { NextResponse } from "next/server";
import { requireAdmin, requireSession } from "@/lib/auth";
import { getCompanySettings } from "@/lib/company";
import { prisma } from "@/lib/db";
import { saveUpload } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET() {
  await requireSession();
  const company = await getCompanySettings();
  return NextResponse.json(company);
}

export async function PUT(req: Request) {
  await requireAdmin();
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();
    const name = String(fd.get("name") ?? "").trim();
    const address = String(fd.get("address") ?? "").trim() || null;
    const phone = String(fd.get("phone") ?? "").trim() || null;
    const email = String(fd.get("email") ?? "").trim() || null;
    const website = String(fd.get("website") ?? "").trim() || null;
    const vatId = String(fd.get("vatId") ?? "").trim() || null;
    const clearLogo = String(fd.get("clearLogo") ?? "") === "1";

    let logoPath: string | null | undefined = undefined;
    const logo = fd.get("logo");
    if (logo instanceof File && logo.size > 0) {
      const bytes = Buffer.from(await logo.arrayBuffer());
      logoPath = await saveUpload("company", logo.name, bytes);
    } else if (clearLogo) {
      logoPath = null;
    }

    const data: {
      name: string;
      address: string | null;
      phone: string | null;
      email: string | null;
      website: string | null;
      vatId: string | null;
      logoPath?: string | null;
    } = { name, address, phone, email, website, vatId };
    if (logoPath !== undefined) data.logoPath = logoPath;

    const row = await prisma.companySettings.upsert({
      where: { id: "default" },
      update: data,
      create: { id: "default", ...data, logoPath: logoPath ?? null },
    });
    return NextResponse.json(row);
  }

  const body = await req.json();
  const row = await prisma.companySettings.upsert({
    where: { id: "default" },
    update: {
      name: String(body.name ?? "").trim(),
      address: String(body.address ?? "").trim() || null,
      phone: String(body.phone ?? "").trim() || null,
      email: String(body.email ?? "").trim() || null,
      website: String(body.website ?? "").trim() || null,
      vatId: String(body.vatId ?? "").trim() || null,
    },
    create: {
      id: "default",
      name: String(body.name ?? "").trim(),
      address: String(body.address ?? "").trim() || null,
      phone: String(body.phone ?? "").trim() || null,
      email: String(body.email ?? "").trim() || null,
      website: String(body.website ?? "").trim() || null,
      vatId: String(body.vatId ?? "").trim() || null,
    },
  });
  return NextResponse.json(row);
}
