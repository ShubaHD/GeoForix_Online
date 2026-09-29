"use client";

import { useI18n } from "@/lib/i18n/client";

export function ExplorerToggle() {
  const { t } = useI18n();

  function toggle() {
    document.documentElement.classList.toggle("explorer-open");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded border border-line bg-[#e4e8ec] px-2 py-1 text-xs font-semibold sm:hidden"
      aria-label={t((m) => m.common.menu)}
    >
      ☰
    </button>
  );
}

export function ExplorerBackdrop() {
  return (
    <div
      className="explorer-backdrop"
      onClick={() => document.documentElement.classList.remove("explorer-open")}
      aria-hidden
    />
  );
}
