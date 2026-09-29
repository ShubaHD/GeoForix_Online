"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";

function isActive(pathname: string, href: string) {
  if (href === "/projects") {
    return (
      pathname === "/projects" ||
      pathname.startsWith("/projects/") ||
      pathname.startsWith("/boreholes/")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const { t } = useI18n();

  const items = [
    { href: "/map", label: t((m) => m.nav.map) },
    { href: "/projects", label: t((m) => m.nav.projects) },
    ...(isAdmin
      ? [
          { href: "/admin/company", label: t((m) => m.nav.company) },
          { href: "/admin/users", label: t((m) => m.nav.users) },
        ]
      : []),
  ];

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {items.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded border px-2.5 py-1 text-sm font-medium transition ${
              active
                ? "border-accent bg-accent text-white"
                : "border-line bg-[#e4e8ec] text-ink hover:bg-[#d8dde3]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
