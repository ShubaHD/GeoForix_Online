"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { useI18n } from "@/lib/i18n/client";

export type ExplorerData = {
  id: string;
  code: string;
  boreholes: { id: string; code: string }[];
}[];

function ExplorerInner({ projects }: { projects: ExplorerData }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const list = Array.isArray(projects) ? projects : [];

  const projectMatch = pathname.match(/\/projects\/([^/]+)/);
  const boreholeMatch = pathname.match(/\/boreholes\/([^/]+)/);
  const activeProjectId = projectMatch?.[1];
  const activeBoreholeId = boreholeMatch?.[1];
  const boreholeOwner = activeBoreholeId
    ? list.find((p) => p.boreholes.some((b) => b.id === activeBoreholeId))
    : null;
  const resolvedProjectId = activeProjectId ?? boreholeOwner?.id;

  return (
    <aside className="explorer-aside flex w-72 shrink-0 flex-col border-r border-line bg-sidebar">
      <div className="border-b border-line px-3 py-2">
        <div className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
          {t((m) => m.explorer.title)}
        </div>
        <p className="mt-1 text-xs text-muted">{t((m) => m.explorer.treeHint)}</p>
      </div>
      <div className="flex-1 overflow-auto p-2 text-sm">
        {list.length === 0 ? (
          <p className="px-2 py-3 text-muted">
            {t((m) => m.explorer.emptyProjects)}
          </p>
        ) : (
          <ul className="space-y-1">
            {list.map((p) => {
              const showChildren = resolvedProjectId === p.id;
              return (
                <li key={p.id}>
                  <Link
                    href={`/projects/${p.id}`}
                    onClick={() =>
                      document.documentElement.classList.remove("explorer-open")
                    }
                    className={`block rounded px-2 py-1.5 font-medium ${
                      resolvedProjectId === p.id && !activeBoreholeId
                        ? "bg-accent-soft text-accent"
                        : "hover:bg-panel"
                    }`}
                  >
                    {p.code}
                  </Link>
                  {showChildren ? (
                    <ul className="ml-3 border-l border-line pl-2">
                      {p.boreholes.map((b) => (
                        <li key={b.id} className="mt-1">
                          <Link
                            href={`/boreholes/${b.id}`}
                            onClick={() =>
                              document.documentElement.classList.remove(
                                "explorer-open",
                              )
                            }
                            className={`block rounded px-2 py-1 ${
                              activeBoreholeId === b.id
                                ? "bg-accent-soft text-accent"
                                : "hover:bg-panel"
                            }`}
                          >
                            {b.code}
                          </Link>
                        </li>
                      ))}
                      {p.boreholes.length === 0 ? (
                        <li className="mt-1 px-2 py-1 text-xs text-muted">
                          {t((m) => m.explorer.emptyBoreholes)}
                        </li>
                      ) : null}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}

export function ExplorerClient({ projects }: { projects: ExplorerData }) {
  return (
    <Suspense
      fallback={
        <aside className="explorer-aside w-72 shrink-0 border-r border-line bg-sidebar" />
      }
    >
      <ExplorerInner projects={projects} />
    </Suspense>
  );
}
