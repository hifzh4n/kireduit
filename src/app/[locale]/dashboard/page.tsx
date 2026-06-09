"use client";

import { HandCoins, Plus, ReceiptText, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { useData } from "@/contexts/data-context";
import { money, totalExpensesThisMonth, totalExpensesToday } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExpenseList } from "@/components/expenses/expense-list";
import { DebtList } from "@/components/debts/debt-list";
import { DataError } from "@/components/data-error";
import { ListRowSkeleton } from "@/components/ui/list-row-skeleton";
import { Link } from "@/i18n/navigation";

export default function Page() {
  const t = useTranslations("Dashboard");
  const tExpenses = useTranslations("Expenses");
  const tDebts = useTranslations("Debts");
  const { expenses, debts, error, loading } = useData();
  const iOwe = debts.filter((debt) => debt.type === "i-owe" && debt.status === "unpaid").reduce((sum, debt) => sum + debt.amount, 0);
  const oweMe = debts.filter((debt) => debt.type === "owe-me" && debt.status === "unpaid").reduce((sum, debt) => sum + debt.amount, 0);

  const cards = [
    { label: t("todayExpenses"), value: money(totalExpensesToday(expenses)), icon: ReceiptText },
    { label: t("thisMonth"), value: money(totalExpensesThisMonth(expenses)), icon: Wallet },
    { label: t("iOwe"), value: money(iOwe), icon: HandCoins },
    { label: t("oweMe"), value: money(oweMe), icon: HandCoins },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">{t("description")}</p>
      </div>
      <DataError message={error} />

      {loading ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label}>
                <CardContent className="p-4">
                  <Icon className="mb-3 h-5 w-5 text-[var(--accent-text)] dark:text-[var(--accent)]" />
                  <p className="text-xs text-slate-500 dark:text-slate-300">{item.label}</p>
                  <p className="mt-1 text-lg font-semibold">{item.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Link href="/expenses/new">
          <Button className="w-full">
            <Plus className="h-4 w-4" />
            {tExpenses("add")}
          </Button>
        </Link>
        <Link href="/debts/new">
          <Button className="w-full" variant="secondary">
            <Plus className="h-4 w-4" />
            {tDebts("add")}
          </Button>
        </Link>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{t("recentExpenses")}</h2>
          <Link href="/expenses" className="text-sm font-medium text-[var(--accent-text)] dark:text-[var(--accent)]">
            {t("viewAll")}
          </Link>
        </div>
        {loading ? (
          <ListRowSkeleton rows={3} />
        ) : !expenses.length ? (
          <p className="rounded-lg border border-dashed border-sky-100 bg-white/80 p-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300">
            {t("emptyExpenses")}
          </p>
        ) : (
          <ExpenseList expenses={expenses.slice(0, 3)} />
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{t("recentDebts")}</h2>
          <Link href="/debts" className="text-sm font-medium text-[var(--accent-text)] dark:text-[var(--accent)]">
            {t("viewAll")}
          </Link>
        </div>
        {loading ? (
          <ListRowSkeleton rows={3} />
        ) : !debts.length ? (
          <p className="rounded-lg border border-dashed border-sky-100 bg-white/80 p-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300">
            {t("emptyDebts")}
          </p>
        ) : (
          <DebtList debts={debts.slice(0, 3)} />
        )}
      </section>
    </div>
  );
}
