"use client";

import { useI18n } from "@/lib/i18n/client";

export function HistoryNav() {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="rounded border border-line bg-[#e4e8ec] px-2 py-1 text-sm font-medium text-ink hover:bg-[#d8dde3]"
        title={t((m) => m.common.back)}
        aria-label={t((m) => m.common.back)}
      >
        ← {t((m) => m.common.back)}
      </button>
      <button
        type="button"
        onClick={() => window.history.forward()}
        className="rounded border border-line bg-[#e4e8ec] px-2 py-1 text-sm font-medium text-ink hover:bg-[#d8dde3]"
        title={t((m) => m.common.forward)}
        aria-label={t((m) => m.common.forward)}
      >
        {t((m) => m.common.forward)} →
      </button>
    </div>
  );
}
