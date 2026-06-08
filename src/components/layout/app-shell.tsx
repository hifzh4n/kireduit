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
        <div className="min-h-screen bg-[#fdf7ff] text-slate-800 dark:bg-[#101423] dark:text-slate-100">
          <header className="sticky top-0 z-20 border-b border-sky-100 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-[#101423]/95">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <Link href="/dashboard" className="flex min-w-0 items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element -- Keep the logo as the original PNG without optimization. */}
                  <img
                    src="/kireduit-logo.png"
                    alt="KireDuit logo"
                    className="h-12 w-12 shrink-0 object-contain"
                  />
                  <span className="truncate text-lg font-semibold text-slate-800 dark:text-slate-100">KireDuit</span>
                </Link>
              </div>
              <BarChart3 className="h-5 w-5 shrink-0 text-teal-400" />
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
                    className="mb-4 inline-flex h-10 items-center gap-2 rounded-md border border-sky-100 bg-white/90 px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
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
                      className="flex h-12 min-w-32 items-center justify-center gap-2 rounded-full border border-teal-200 bg-teal-300 px-4 text-sm font-semibold text-slate-800 shadow-xl shadow-teal-200/40 hover:bg-teal-200 dark:border-teal-300 dark:bg-teal-300 dark:text-slate-900 dark:hover:bg-teal-200"
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
                      className="flex h-12 min-w-32 items-center justify-center gap-2 rounded-full border border-sky-100 bg-white/90 px-4 text-sm font-semibold text-slate-800 shadow-xl shadow-sky-100/40 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/30 dark:hover:bg-slate-800"
                    >
                      <HandCoins className="h-4 w-4 text-teal-500 dark:text-teal-200" />
                      Debt
                    </Link>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <nav className="relative mx-auto grid h-16 w-full max-w-xl grid-cols-5 items-center rounded-2xl border border-sky-100 bg-white/90 px-2 shadow-lg shadow-sky-100/60 dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-black/30">
              {navBeforeAdd.map((item) => (
                <NavItem key={item.href} item={item} pathname={pathname} />
              ))}
              <button
                type="button"
                onClick={() => setAddOpen((open) => !open)}
                aria-label="Add new record"
                aria-expanded={addOpen}
                className={cn(
                  "relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white bg-teal-300 text-slate-800 shadow-md shadow-teal-200/50 hover:bg-teal-200 dark:border-slate-900 dark:bg-teal-300 dark:text-slate-900 dark:hover:bg-teal-200",
                  addOpen && "bg-teal-200 ring-4 ring-teal-200/40",
                )}
              >
                {addOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </button>
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
        "relative flex h-12 items-center justify-center overflow-hidden rounded-xl px-1 text-slate-400 transition hover:text-teal-500 dark:text-slate-400 dark:hover:text-teal-200",
        active && "text-teal-500 dark:text-teal-200",
      )}
    >
      {active ? (
        <motion.span
          layoutId="bottom-nav-indicator"
          className="absolute inset-1 rounded-xl bg-teal-200/50 dark:bg-teal-300/10"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      ) : null}
      <Icon className="relative z-10 h-5 w-5" />
    </Link>
  );
}
