"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/client";

export function NewBoreholeForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/projects/${projectId}/boreholes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: fd.get("code"),
        notes: fd.get("notes"),
        drilledAt: fd.get("drilledAt") || null,
        depthMeters: fd.get("depthMeters") || null,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Error");
      return;
    }
    const borehole = await res.json();
    setOpen(false);
    router.push(`/boreholes/${borehole.id}`);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded bg-accent px-3 py-2 text-sm font-medium text-white"
      >
        {t((m) => m.borehole.newBorehole)}
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-wrap items-end gap-2 rounded border border-line bg-panel p-3"
    >
      <label className="text-xs">
        {t((m) => m.common.code)}
        <input
          name="code"
          required
          className="mt-1 block w-28 rounded border border-line px-2 py-1.5 text-sm"
          placeholder="BH01"
        />
      </label>
      <label className="text-xs">
        {t((m) => m.borehole.depth)}
        <input
          name="depthMeters"
          type="number"
          step="0.01"
          className="mt-1 block w-24 rounded border border-line px-2 py-1.5 text-sm"
        />
      </label>
      <label className="text-xs">
        {t((m) => m.common.date)}
        <input
          name="drilledAt"
          type="date"
          className="mt-1 block rounded border border-line px-2 py-1.5 text-sm"
        />
      </label>
      <label className="text-xs">
        {t((m) => m.common.notes)}
        <input
          name="notes"
          className="mt-1 block w-48 rounded border border-line px-2 py-1.5 text-sm"
        />
      </label>
      <button type="submit" className="rounded bg-accent px-3 py-1.5 text-sm text-white">
        {t((m) => m.common.save)}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="rounded border border-line px-3 py-1.5 text-sm"
      >
        {t((m) => m.common.cancel)}
      </button>
      {error ? <p className="w-full text-xs text-red-700">{error}</p> : null}
    </form>
  );
}
