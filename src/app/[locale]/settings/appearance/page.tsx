"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { accentOptions, useAccent } from "@/contexts/accent-context";
import { type Theme, useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";

export default function Page() {
  const t = useTranslations("Settings");
  const { setTheme, theme } = useTheme();
  const { accent, setAccent } = useAccent();
  const options: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
    { value: "light", label: t("lightTheme"), icon: Sun },
    { value: "dark", label: t("darkTheme"), icon: Moon },
    { value: "system", label: t("useSystem"), icon: Monitor },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("theme")}</CardTitle>
          <CardDescription>{t("themeDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                className="w-full justify-start"
                variant={theme === option.value ? "default" : "outline"}
                onClick={() => setTheme(option.value)}
              >
                <Icon className="h-4 w-4" />
                {option.label}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("accentColor")}</CardTitle>
          <CardDescription>{t("accentDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {accentOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setAccent(option.value)}
                className={cn(
                  "flex h-14 items-center gap-3 rounded-md border border-sky-100 bg-white/90 px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900",
                  accent === option.value && "border-[var(--accent-border)] ring-2 ring-[var(--accent-muted)]",
                )}
              >
                <span
                  className="h-7 w-7 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: option.swatch }}
                />
                {t(option.value)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
