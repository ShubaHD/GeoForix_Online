"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/client";

type Props = {
  initial: {
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    vatId: string | null;
    logoPath: string | null;
  };
};

export function CompanyForm({ initial }: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [clearLogo, setClearLogo] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setOk(false);
    setSaving(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (clearLogo) fd.set("clearLogo", "1");
    try {
      const res = await fetch("/api/company", { method: "PUT", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Error");
        return;
      }
      setClearLogo(false);
      setOk(true);
      router.refresh();
    } catch {
      setError("Error");
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "mt-1 block w-full rounded border border-line bg-white px-2.5 py-1.5 text-sm";

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-2xl space-y-4 rounded-lg border border-line bg-panel p-4"
    >
      <label className="block text-xs font-medium text-muted">
        {t((m) => m.admin.companyName)}
        <input
          name="name"
          required
          defaultValue={initial.name}
          className={inputCls}
        />
      </label>
      <label className="block text-xs font-medium text-muted">
        {t((m) => m.admin.companyAddress)}
        <textarea
          name="address"
          rows={2}
          defaultValue={initial.address ?? ""}
          className={inputCls}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs font-medium text-muted">
          {t((m) => m.admin.companyPhone)}
          <input
            name="phone"
            defaultValue={initial.phone ?? ""}
            className={inputCls}
          />
        </label>
        <label className="block text-xs font-medium text-muted">
          {t((m) => m.admin.companyEmail)}
          <input
            name="email"
            type="email"
            defaultValue={initial.email ?? ""}
            className={inputCls}
          />
        </label>
        <label className="block text-xs font-medium text-muted">
          {t((m) => m.admin.companyWebsite)}
          <input
            name="website"
            defaultValue={initial.website ?? ""}
            className={inputCls}
          />
        </label>
        <label className="block text-xs font-medium text-muted">
          {t((m) => m.admin.companyVat)}
          <input
            name="vatId"
            defaultValue={initial.vatId ?? ""}
            className={inputCls}
          />
        </label>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted">
          {t((m) => m.admin.companyLogo)}
        </p>
        {initial.logoPath && !clearLogo ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/files/${initial.logoPath}`}
              alt="Logo"
              className="h-14 max-w-[160px] rounded border border-line bg-white object-contain p-1"
            />
            <button
              type="button"
              onClick={() => setClearLogo(true)}
              className="text-xs text-red-700 underline"
            >
              {t((m) => m.admin.removeLogo)}
            </button>
          </div>
        ) : null}
        <input
          name="logo"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="block w-full text-sm"
        />
        <p className="text-[11px] text-muted">{t((m) => m.admin.logoHint)}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? t((m) => m.common.loading) : t((m) => m.common.save)}
        </button>
        {ok ? (
          <span className="text-xs text-emerald-700">
            {t((m) => m.admin.companySaved)}
          </span>
        ) : null}
        {error ? <span className="text-xs text-red-700">{error}</span> : null}
      </div>
    </form>
  );
}
