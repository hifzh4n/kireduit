"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, BarChart3, HandCoins, Home, Plus, ReceiptText, Settings, X } from "lucide-react";
import { DataProvider } from "@/contexts/data-context";
import { Protected } from "@/components/auth/auth-gate";
import { cn } from "@/lib/utils";

const navBeforeAdd = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/expenses", label: "Expenses", icon: ReceiptText },
];

const navAfterAdd = [
  { href: "/debts", label: "Debts", icon: HandCoins },
  { href: "/settings", label: "Settings", icon: Settings },
];

const rootRoutes = ["/dashboard", "/expenses", "/debts", "/settings"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const showBack = !rootRoutes.includes(pathname);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setAddOpen(false);
      }
    }

    if (addOpen) {
      document.addEventListener("pointerdown", closeOnOutsideClick);
    }

    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [addOpen]);

  return (
    <Protected>
      <DataProvider>
        <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <Link href="/dashboard" className="flex min-w-0 items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element -- Keep the logo as the original PNG without optimization. */}
                  <img
                    src="/kireduit-logo.png"
                    alt="KireDuit logo"
                    className="h-12 w-12 shrink-0 object-contain"
                  />
                  <span className="truncate text-lg font-semibold text-slate-950 dark:text-slate-100">KireDuit</span>
                </Link>
              </div>
              <BarChart3 className="h-5 w-5 shrink-0 text-emerald-600" />
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
                transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {showBack ? (
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-4 inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                ) : null}
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          <div ref={addMenuRef} className="fixed inset-x-0 bottom-0 z-20 px-4 pb-4">
            <AnimatePresence>
              {addOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
                  className="mx-auto mb-7 flex w-full max-w-xl items-end justify-center gap-3 px-8"
                >
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.18 }}>
                    <Link
                      href="/expenses/new"
                      onClick={() => setAddOpen(false)}
                      className="flex h-12 min-w-32 items-center justify-center gap-2 rounded-full border border-emerald-500 bg-emerald-600 px-4 text-sm font-semibold text-white shadow-xl shadow-emerald-700/20 transition hover:bg-emerald-700"
                    >
                      <ReceiptText className="h-4 w-4" />
                      Expense
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18, delay: 0.03 }}
                  >
                    <Link
                      href="/debts/new"
                      onClick={() => setAddOpen(false)}
                      className="flex h-12 min-w-32 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-xl shadow-slate-950/10 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/30 dark:hover:bg-slate-800"
                    >
                      <HandCoins className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Debt
                    </Link>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <nav className="relative mx-auto grid h-[74px] w-full max-w-xl grid-cols-5 items-center rounded-md border border-slate-200 bg-white px-2 shadow-lg shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
              {navBeforeAdd.map((item) => (
                <NavItem key={item.href} item={item} pathname={pathname} />
              ))}
              <motion.button
                type="button"
                onClick={() => setAddOpen((open) => !open)}
                aria-label="Add new record"
                aria-expanded={addOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                animate={{ y: -32, rotate: 45, scale: addOpen ? 1.04 : 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                className={cn(
                  "relative mx-auto flex h-14 w-14 items-center justify-center rounded-md border-2 border-white bg-emerald-600 text-white shadow-xl shadow-emerald-700/25 transition hover:bg-emerald-700 dark:border-slate-900",
                  addOpen && "bg-emerald-700 ring-4 ring-emerald-500/20",
                )}
              >
                {addOpen ? <X className="h-6 w-6 -rotate-45" /> : <Plus className="h-6 w-6 -rotate-45" />}
              </motion.button>
              {navAfterAdd.map((item) => (
                <NavItem key={item.href} item={item} pathname={pathname} />
              ))}
            </nav>
          </div>
        </div>
      </DataProvider>
    </Protected>
  );
}

function NavItem({
  item,
  pathname,
}: {
  item: { href: string; label: string; icon: typeof Home };
  pathname: string;
}) {
  const Icon = item.icon;
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      aria-label={item.label}
      className={cn(
        "relative flex min-h-14 flex-col items-center justify-center gap-1 overflow-hidden rounded-md px-1 text-xs font-medium text-slate-400 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400",
        active && "text-emerald-600 dark:text-emerald-400",
      )}
    >
      {active ? (
        <motion.span
          layoutId="bottom-nav-indicator"
          className="absolute inset-x-1 bottom-1 top-1 rounded-md bg-emerald-500/10 dark:bg-emerald-400/10"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      ) : null}
      <Icon className="relative z-10 h-5 w-5" />
      <span className="relative z-10 max-w-full truncate">{item.label}</span>
    </Link>
  );
}
