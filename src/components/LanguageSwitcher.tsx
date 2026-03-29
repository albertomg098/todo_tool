"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { setLocale } from "@/app/actions/locale";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

const locales = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSwitch(newLocale: string) {
    if (newLocale === locale) return;
    startTransition(async () => {
      await setLocale(newLocale);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1">
      <Languages className="h-4 w-4 text-muted-foreground shrink-0" />
      {locales.map((l) => (
        <Button
          key={l.code}
          variant={locale === l.code ? "default" : "ghost"}
          size="xs"
          className="h-6 px-2 text-xs cursor-pointer"
          onClick={() => handleSwitch(l.code)}
          disabled={isPending}
        >
          {l.label}
        </Button>
      ))}
    </div>
  );
}
