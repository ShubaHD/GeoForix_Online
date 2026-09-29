import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

/** All boreholes with coordinates for the map view. */
export async function GET() {
  await requireSession();
  const boreholes = await prisma.borehole.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null },
    },
    orderBy: { code: "asc" },
    select: {
      id: true,
      code: true,
      latitude: true,
      longitude: true,
      projectId: true,
      project: { select: { code: true, name: true } },
    },
  });
  return NextResponse.json(
    boreholes.map((b) => ({
      id: b.id,
      code: b.code,
      latitude: b.latitude!,
      longitude: b.longitude!,
      projectId: b.projectId,
      projectCode: b.project.code,
      projectName: b.project.name,
    })),
  );
}
