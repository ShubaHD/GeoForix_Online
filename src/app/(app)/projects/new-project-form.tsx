"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/client";

export function NewProjectForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: fd.get("code"),
        name: fd.get("name"),
        topic: fd.get("topic"),
        location: fd.get("location"),
        client: fd.get("client"),
        description: fd.get("description"),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? t((m) => m.projects.createError));
      return;
    }
    const project = await res.json();
    setOpen(false);
    router.push(`/projects/${project.id}`);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        {t((m) => m.projects.newProject)}
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-wrap items-end gap-2 rounded border border-line bg-panel p-3"
    >
      <label className="text-xs">
        {t((m) => m.common.code)}
        <input
          name="code"
          required
          className="mt-1 block w-32 rounded border border-line px-2 py-1.5 text-sm"
          placeholder="DEMO-GF"
        />
      </label>
      <label className="text-xs">
        {t((m) => m.common.name)}
        <input
          name="name"
          required
          className="mt-1 block w-56 rounded border border-line px-2 py-1.5 text-sm"
        />
      </label>
      <label className="text-xs">
        {t((m) => m.projects.topic)}
        <input
          name="topic"
          className="mt-1 block w-44 rounded border border-line px-2 py-1.5 text-sm"
        />
      </label>
      <label className="text-xs">
        {t((m) => m.projects.location)}
        <input
          name="location"
          className="mt-1 block w-44 rounded border border-line px-2 py-1.5 text-sm"
        />
      </label>
      <label className="text-xs">
        {t((m) => m.common.client)}
        <input
          name="client"
          className="mt-1 block w-40 rounded border border-line px-2 py-1.5 text-sm"
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
