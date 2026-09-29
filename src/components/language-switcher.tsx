"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";

export function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function setLocale(next: Locale) {
    if (next === locale) return;
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded border border-line bg-[#e4e8ec] p-0.5"
      role="group"
      aria-label={t((m) => m.common.language)}
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            disabled={pending}
            onClick={() => setLocale(code)}
            aria-pressed={active}
            className={`rounded px-2 py-0.5 text-xs font-semibold tracking-wide transition disabled:opacity-60 ${
              active
                ? "bg-accent text-white"
                : "text-muted hover:bg-panel hover:text-ink"
            }`}
          >
            {LOCALE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
