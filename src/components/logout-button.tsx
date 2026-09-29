"use client";

import { useI18n } from "@/lib/i18n/client";

export function LogoutButton() {
  const { t } = useI18n();
  return (
    <form action="/api/auth/logout" method="post">
      <button
        type="submit"
        className="rounded border border-line px-2 py-1 text-muted hover:bg-bg hover:text-ink"
      >
        {t((m) => m.common.logout)}
      </button>
    </form>
  );
}
