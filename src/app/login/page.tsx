import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./login-form";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getT } from "@/lib/i18n/server";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/projects");
  const { t } = await getT();

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="relative w-full max-w-md rounded-lg border border-line bg-panel p-8 shadow-sm">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <h1 className="font-[family-name:var(--font-dm)] text-2xl font-semibold text-ink">
          GeoForix
        </h1>
        <p className="mt-1 text-sm text-muted">{t((m) => m.login.subtitle)}</p>
        <LoginForm />
        <p className="mt-4 text-xs text-muted">
          admin@geoforix.local / admin123 · field@geoforix.local / field123
        </p>
      </div>
    </div>
  );
}
