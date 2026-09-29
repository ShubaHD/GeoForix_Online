import { prisma } from "@/lib/db";
import { NewProjectForm } from "./new-project-form";
import Link from "next/link";
import { getT } from "@/lib/i18n/server";
import { DeleteProjectButton } from "./delete-project-button";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const { t } = await getT();

  const projects = await prisma.project.findMany({
    where: query
      ? {
          OR: [
            { code: { contains: query } },
            { name: { contains: query } },
            { client: { contains: query } },
            { location: { contains: query } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { boreholes: true } } },
  });

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs text-muted">{t((m) => m.projects.crumb)}</div>
        <h1 className="font-[family-name:var(--font-dm)] text-2xl font-semibold">
          {t((m) => m.projects.title)}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {t((m) => m.projects.subtitle)}
        </p>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={query}
            placeholder={t((m) => m.projects.searchPlaceholder)}
            className="w-64 rounded border border-line bg-panel px-3 py-2 text-sm sm:w-72"
          />
          <button className="rounded border border-line bg-panel px-3 py-2 text-sm hover:bg-bg">
            {t((m) => m.common.search)}
          </button>
        </form>
        <NewProjectForm />
      </div>

      <div className="overflow-x-auto rounded-lg border border-line bg-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-sidebar text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">{t((m) => m.common.code)}</th>
              <th className="px-3 py-2 font-medium">{t((m) => m.common.name)}</th>
              <th className="px-3 py-2 font-medium">{t((m) => m.projects.location)}</th>
              <th className="px-3 py-2 font-medium">{t((m) => m.common.client)}</th>
              <th className="px-3 py-2 font-medium">{t((m) => m.common.boreholes)}</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr
                key={p.id}
                className="border-b border-line last:border-0 hover:bg-sidebar/60"
              >
                <td className="px-3 py-2">
                  <Link
                    href={`/projects/${p.id}`}
                    className="font-medium text-accent"
                  >
                    {p.code}
                  </Link>
                </td>
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2 text-muted">{p.location ?? "—"}</td>
                <td className="px-3 py-2 text-muted">{p.client ?? "—"}</td>
                <td className="px-3 py-2">{p._count.boreholes}</td>
                <td className="px-3 py-2 text-right">
                  <DeleteProjectButton id={p.id} />
                </td>
              </tr>
            ))}
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-muted">
                  {t((m) => m.projects.empty)}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
