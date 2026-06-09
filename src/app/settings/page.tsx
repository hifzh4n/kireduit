"use client";

import Link from "next/link";
import { History, Lock, Moon, User, UserX } from "lucide-react";
import { Card } from "@/components/ui/card";

const items = [
  { href: "/settings/profile", label: "Profile", description: "Display name and email", icon: User },
  { href: "/settings/security", label: "Security", description: "Change password", icon: Lock },
  { href: "/settings/appearance", label: "Appearance", description: "Theme and accent color", icon: Moon },
  { href: "/settings/recently-deleted", label: "Recently Deleted", description: "Restore or permanently delete records", icon: History },
  { href: "/settings/account", label: "Account", description: "Logout or delete account", icon: UserX },
];

export default function Page() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">Manage your account.</p>
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
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{item.description}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
