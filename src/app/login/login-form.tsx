"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/client";

export function LoginForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          password: fd.get("password"),
        }),
      });
      if (!res.ok) {
        setError(t((m) => m.login.error));
        return;
      }
      router.push("/projects");
      router.refresh();
    } catch {
      setError(t((m) => m.login.networkError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block text-sm">
        <span className="text-muted">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mt-1 w-full rounded border border-line bg-panel px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        <span className="text-muted">{t((m) => m.login.password)}</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded border border-line bg-panel px-3 py-2"
        />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-accent px-3 py-2 font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? t((m) => m.login.loading) : t((m) => m.login.submit)}
      </button>
    </form>
  );
}
