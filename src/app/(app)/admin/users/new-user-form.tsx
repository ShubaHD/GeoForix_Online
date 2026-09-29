"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/client";

export function NewUserForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        password: fd.get("password"),
        role: fd.get("role"),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Error");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-wrap items-end gap-2 rounded border border-line bg-panel p-3"
    >
      <label className="text-xs">
        {t((m) => m.common.name)}
        <input name="name" required className="mt-1 block w-40 rounded border border-line px-2 py-1.5 text-sm" />
      </label>
      <label className="text-xs">
        {t((m) => m.admin.email)}
        <input name="email" type="email" required className="mt-1 block w-52 rounded border border-line px-2 py-1.5 text-sm" />
      </label>
      <label className="text-xs">
        {t((m) => m.admin.password)}
        <input name="password" type="password" required minLength={6} className="mt-1 block w-36 rounded border border-line px-2 py-1.5 text-sm" />
      </label>
      <label className="text-xs">
        {t((m) => m.admin.role)}
        <select name="role" defaultValue="FIELD" className="mt-1 block rounded border border-line px-2 py-1.5 text-sm">
          <option value="FIELD">FIELD</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </label>
      <button type="submit" className="rounded bg-accent px-3 py-1.5 text-sm text-white">
        {t((m) => m.admin.newUser)}
      </button>
      {error ? <p className="w-full text-xs text-red-700">{error}</p> : null}
    </form>
  );
}
