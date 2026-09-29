import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getT } from "@/lib/i18n/server";
import { NewBoreholeForm } from "./new-borehole-form";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { t } = await getT();
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      boreholes: {
        orderBy: { code: "asc" },
        include: {
          _count: {
            select: { layers: true, samples: true, photos: true },
          },
        },
      },
    },
  });
  if (!project) notFound();

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs text-muted">
          <Link href="/projects" className="hover:text-accent">
            {t((m) => m.projects.crumb)}
          </Link>{" "}
          / {project.code}
        </div>
        <h1 className="font-[family-name:var(--font-dm)] text-2xl font-semibold">
          {project.name}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {t((m) => m.projects.location)}: {project.location ?? "—"} ·{" "}
          {t((m) => m.common.client)}: {project.client ?? "—"}
          {project.topic ? ` · ${t((m) => m.projects.topic)}: ${project.topic}` : ""}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium">{t((m) => m.common.boreholes)}</h2>
        <NewBoreholeForm projectId={project.id} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-line bg-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-sidebar text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">{t((m) => m.common.code)}</th>
              <th className="px-3 py-2 font-medium">{t((m) => m.borehole.depth)}</th>
              <th className="px-3 py-2 font-medium">{t((m) => m.borehole.sections.lithology)}</th>
              <th className="px-3 py-2 font-medium">{t((m) => m.borehole.sections.samples)}</th>
              <th className="px-3 py-2 font-medium">{t((m) => m.borehole.sections.photos)}</th>
              <th className="px-3 py-2 font-medium">{t((m) => m.common.notes)}</th>
            </tr>
          </thead>
          <tbody>
            {project.boreholes.map((b) => (
              <tr
                key={b.id}
                className="border-b border-line last:border-0 hover:bg-sidebar/60"
              >
                <td className="px-3 py-2">
                  <Link
                    href={`/boreholes/${b.id}`}
                    className="font-medium text-accent"
                  >
                    {b.code}
                  </Link>
                </td>
                <td className="px-3 py-2 text-muted">
                  {b.depthMeters != null ? `${b.depthMeters} m` : "—"}
                </td>
                <td className="px-3 py-2">{b._count.layers}</td>
                <td className="px-3 py-2">{b._count.samples}</td>
                <td className="px-3 py-2">{b._count.photos}</td>
                <td className="px-3 py-2 text-muted">{b.notes ?? "—"}</td>
              </tr>
            ))}
            {project.boreholes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-muted">
                  {t((m) => m.borehole.empty)}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
