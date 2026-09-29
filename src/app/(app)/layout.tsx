import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { ExplorerClient } from "@/components/explorer";
import { ExplorerBackdrop } from "@/components/explorer-toggle";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const projects = await prisma.project.findMany({
    orderBy: { code: "asc" },
    select: {
      id: true,
      code: true,
      boreholes: {
        orderBy: { code: "asc" },
        select: { id: true, code: true },
      },
    },
  });

  return (
    <div className="flex h-screen flex-col">
      <AppHeader />
      <div className="relative flex min-h-0 flex-1">
        <ExplorerBackdrop />
        <ExplorerClient projects={projects} />
        <main className="min-w-0 flex-1 overflow-auto bg-bg p-4 sm:p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
