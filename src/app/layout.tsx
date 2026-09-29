import type { Metadata } from "next";
import { DM_Sans, Source_Sans_3 } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/client";
import { getLocale } from "@/lib/i18n/server";
import { ServiceWorkerCleanup } from "@/components/sw-cleanup";
import "./globals.css";

const dm = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
});

const source = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
});

export const metadata: Metadata = {
  title: "GeoForix Online — Fișe de foraj",
  description: "Proiecte, foraje, litologie și fișă PDF pe teren / birou",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${dm.variable} ${source.variable} h-full`}>
      <body className="min-h-full antialiased">
        <ServiceWorkerCleanup />
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
