import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getT } from "@/lib/i18n/server";
import { NewUserForm } from "./new-user-form";
import { DeleteUserButton } from "./delete-user-button";

export default async function UsersAdminPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/projects");
  const { t, messages } = await getT();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-dm)] text-2xl font-semibold">
          {t((m) => m.admin.usersTitle)}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {t((m) => m.admin.usersSubtitle)}
        </p>
      </div>
      <NewUserForm />
      <div className="overflow-x-auto rounded-lg border border-line bg-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-sidebar text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">{t((m) => m.common.name)}</th>
              <th className="px-3 py-2 font-medium">{t((m) => m.admin.email)}</th>
              <th className="px-3 py-2 font-medium">{t((m) => m.admin.role)}</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">
                  {messages.roles[u.role as keyof typeof messages.roles] ??
                    u.role}
                </td>
                <td className="px-3 py-2 text-right">
                  {u.id !== session.id ? (
                    <DeleteUserButton id={u.id} />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
