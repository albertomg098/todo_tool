import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { esES, enUS } from "@clerk/localizations";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { AppLayout } from "@/components/AppLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Stack",
  description: "Daily and weekly task management",
};

const clerkLocales: Record<string, typeof esES> = {
  es: esES,
  en: enUS,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ClerkProvider localization={clerkLocales[locale] ?? esES}>
            <AppLayout>{children}</AppLayout>
          </ClerkProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
