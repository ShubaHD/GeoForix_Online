import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCompanySettings } from "@/lib/company";
import { getT } from "@/lib/i18n/server";
import { CompanyForm } from "./company-form";

export default async function CompanyAdminPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/projects");
  const { t } = await getT();
  const company = await getCompanySettings();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-dm)] text-2xl font-semibold">
          {t((m) => m.admin.companyTitle)}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {t((m) => m.admin.companySubtitle)}
        </p>
      </div>
      <CompanyForm initial={company} />
    </div>
  );
}
