"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";

export function DeleteUserButton({ id }: { id: string }) {
  const router = useRouter();
  const { t } = useI18n();

  async function onDelete() {
    if (!confirm(t((m) => m.common.delete) + "?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      className="text-xs text-red-700 hover:underline"
    >
      {t((m) => m.common.delete)}
    </button>
  );
}
