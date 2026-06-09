"use client";

import { Check, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const options = [
  { locale: "en", flag: "\u{1F1EC}\u{1F1E7}", labelKey: "english" },
  { locale: "ms", flag: "\u{1F1F2}\u{1F1FE}", labelKey: "malay" },
] as const;

export default function Page() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Language");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent-text)] dark:bg-[var(--accent-muted)] dark:text-[var(--accent)]">
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>{t("title")}</CardTitle>
              <CardDescription>{t("description")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {options.map((option) => {
            const active = currentLocale === option.locale;
            return (
              <Button
                key={option.locale}
                type="button"
                variant={active ? "default" : "outline"}
                className="w-full justify-between"
                onClick={() => {
                  router.replace(pathname, { locale: option.locale });
                  toast.success(t("updated"));
                }}
              >
                <span className="flex items-center gap-3">
                  <span className="text-base">{option.flag}</span>
                  {t(option.labelKey)}
                </span>
                <Check className={cn("h-4 w-4", active ? "opacity-100" : "opacity-0")} />
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
