import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getT } from "@/lib/i18n/server";
import { BoreholeEditor } from "./borehole-editor";

export default async function BoreholePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { t, locale } = await getT();
  const borehole = await prisma.borehole.findUnique({
    where: { id },
    include: {
      project: true,
      layers: { orderBy: [{ sortOrder: "asc" }, { fromM: "asc" }] },
      samples: { orderBy: { createdAt: "asc" } },
      waterLevels: { orderBy: { date: "desc" } },
      equipment: { orderBy: { fromM: "asc" } },
      photos: { orderBy: { createdAt: "desc" } },
      pmtReadings: { orderBy: { depthFromM: "asc" } },
      otvReadings: { orderBy: { depthFromM: "asc" } },
      ppReadings: { orderBy: { depthFrom: "asc" } },
      vstReadings: { orderBy: { depthFrom: "asc" } },
      rqdReadings: { orderBy: { depthFrom: "asc" } },
    },
  });
  if (!borehole) notFound();

  const siblingPoints = await prisma.borehole.findMany({
    where: {
      projectId: borehole.projectId,
      latitude: { not: null },
      longitude: { not: null },
    },
    select: {
      id: true,
      code: true,
      latitude: true,
      longitude: true,
    },
  });

  const data = {
    ...borehole,
    drilledAt: borehole.drilledAt?.toISOString() ?? null,
    createdAt: borehole.createdAt.toISOString(),
    updatedAt: borehole.updatedAt.toISOString(),
    waterLevels: borehole.waterLevels.map((w) => ({
      ...w,
      date: w.date.toISOString(),
    })),
    samples: borehole.samples.map((s) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
    })),
    photos: borehole.photos.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    })),
    pmtReadings: borehole.pmtReadings.map((r) => ({
      ...r,
      testDate: r.testDate.toISOString(),
    })),
    otvReadings: borehole.otvReadings.map((r) => ({
      ...r,
      testDate: r.testDate.toISOString(),
    })),
    ppReadings: borehole.ppReadings.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
    vstReadings: borehole.vstReadings.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
    rqdReadings: borehole.rqdReadings.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
    mapPoints: siblingPoints.map((p) => ({
      id: p.id,
      code: p.code,
      latitude: p.latitude!,
      longitude: p.longitude!,
      highlight: p.id === borehole.id,
    })),
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs text-muted">
          <Link href="/projects" className="hover:text-accent">
            {t((m) => m.projects.crumb)}
          </Link>{" "}
          /{" "}
          <Link
            href={`/projects/${borehole.projectId}`}
            className="hover:text-accent"
          >
            {borehole.project.code}
          </Link>{" "}
          / {borehole.code}
        </div>
        <h1 className="font-[family-name:var(--font-dm)] text-2xl font-semibold">
          {borehole.code}
        </h1>
        <p className="mt-1 text-sm text-muted">{borehole.project.name}</p>
      </div>
      <BoreholeEditor initial={data} uiLocale={locale} />
    </div>
  );
}
