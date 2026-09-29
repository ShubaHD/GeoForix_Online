"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";

export function DeleteProjectButton({ id }: { id: string }) {
  const router = useRouter();
  const { t } = useI18n();

  async function onDelete() {
    if (!confirm(t((m) => m.projects.deleteConfirm))) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
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
