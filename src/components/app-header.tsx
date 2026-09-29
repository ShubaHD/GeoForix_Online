import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { AppNav } from "@/components/app-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getT } from "@/lib/i18n/server";
import { ExplorerToggle } from "@/components/explorer-toggle";
import { HistoryNav } from "@/components/history-nav";

export async function AppHeader() {
  const session = await getSession();
  const { messages } = await getT();

  return (
    <header className="flex h-12 items-center justify-between gap-2 border-b border-line bg-panel px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <ExplorerToggle />
        <HistoryNav />
        <Link
          href="/projects"
          className="font-[family-name:var(--font-dm)] text-lg font-semibold tracking-tight text-ink"
        >
          GeoForix
        </Link>
        <div className="hidden sm:block">
          <AppNav isAdmin={session?.role === "ADMIN"} />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-sm sm:gap-3">
        <LanguageSwitcher />
        {session ? (
          <>
            <span className="hidden text-muted md:inline">
              {session.name} ·{" "}
              {messages.roles[session.role as keyof typeof messages.roles] ??
                session.role}
            </span>
            <LogoutButton />
          </>
        ) : null}
      </div>
    </header>
  );
}
