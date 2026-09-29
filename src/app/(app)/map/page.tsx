import { prisma } from "@/lib/db";
import { getT } from "@/lib/i18n/server";
import { MapView } from "./map-view";

export default async function MapPage() {
  const { t } = await getT();
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
      project: { select: { code: true, name: true } },
    },
  });

  const points = boreholes.map((b) => ({
    id: b.id,
    code: b.code,
    latitude: b.latitude!,
    longitude: b.longitude!,
    projectCode: b.project.code,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-[family-name:var(--font-dm)] text-2xl font-semibold">
          {t((m) => m.map.title)}
        </h1>
        <p className="mt-1 text-sm text-muted">{t((m) => m.map.subtitle)}</p>
      </div>
      <MapView points={points} />
    </div>
  );
}
