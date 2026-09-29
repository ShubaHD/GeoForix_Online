import { prisma } from "@/lib/db";
import { readUpload } from "@/lib/storage";

export type CompanyProfile = {
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  vatId: string | null;
  logoPath: string | null;
};

export async function getCompanySettings(): Promise<CompanyProfile> {
  const row = await prisma.companySettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "GeoForix",
    },
  });
  return {
    name: row.name,
    address: row.address,
    phone: row.phone,
    email: row.email,
    website: row.website,
    vatId: row.vatId,
    logoPath: row.logoPath,
  };
}

export async function loadCompanyLogoBuffer(
  logoPath: string | null | undefined,
): Promise<Buffer | null> {
  if (!logoPath) return null;
  try {
    return await readUpload(logoPath);
  } catch {
    return null;
  }
}
