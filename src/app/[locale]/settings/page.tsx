"use client";

import { History, Languages, Lock, Moon, User, UserX } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

const items = [
  { href: "/settings/profile", label: "profile", description: "profileDescription", icon: User },
  { href: "/settings/security", label: "security", description: "securityDescription", icon: Lock },
  { href: "/settings/appearance", label: "appearance", description: "appearanceDescription", icon: Moon },
  { href: "/settings/language", label: "language", description: "languageDescription", icon: Languages },
  { href: "/settings/recently-deleted", label: "recentlyDeleted", description: "recentlyDeletedDescription", icon: History },
  { href: "/settings/account", label: "account", description: "accountDescription", icon: UserX },
];

export default function Page() {
  const t = useTranslations("Settings");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">{t("description")}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.href} key={item.href} className="block">
              <Card className="flex items-center gap-3 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent-text)] dark:bg-[var(--accent-muted)] dark:text-[var(--accent)]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{t(item.label)}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{t(item.description)}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
