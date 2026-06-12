"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useData } from "@/contexts/data-context";
import { Button } from "@/components/ui/button";
import { DebtList } from "@/components/debts/debt-list";
import { DateInput, Field, Input, Label } from "@/components/ui/form";
import { todayInput } from "@/lib/format";
import { cn } from "@/lib/utils";
import { DataError } from "@/components/data-error";
import { ListRowSkeleton } from "@/components/ui/list-row-skeleton";
import { Link } from "@/i18n/navigation";

export default function Page() {
  const t = useTranslations("Debts");
  const tCommon = useTranslations("Common");
  const { debts, error, loading } = useData();
  const [tab, setTab] = useState<"i-owe" | "owe-me">("i-owe");
  const [status, setStatus] = useState<"all" | "paid" | "unpaid">("all");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const hasFilters = status !== "all" || Boolean(date) || Boolean(search);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return debts.filter((debt) => {
      const matchesType = debt.type === tab;
      const matchesStatus = status === "all" || debt.status === status;
      const matchesDate = !date || debt.dueDate === date;
      const searchableText = [
        debt.personName,
        debt.description,
        debt.amount.toString(),
        debt.dueDate,
        debt.status,
        debt.status === "paid" ? t("paid") : t("unpaid"),
        debt.type,
        debt.type === "i-owe" ? t("iOwe") : t("oweMe"),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !query || searchableText.includes(query);

      return matchesType && matchesStatus && matchesDate && matchesSearch;
    });
  }, [date, debts, search, status, t, tab]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">{t("description")}</p>
        </div>
        <Link href="/debts/new">
          <Button size="icon" aria-label={t("addTitle")}>
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      <DataError message={error} />
      <div className="grid grid-cols-2 rounded-lg bg-sky-100/70 p-1 dark:bg-slate-900">
        {[
          ["i-owe", t("iOwe")],
          ["owe-me", t("oweMe")],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value as "i-owe" | "owe-me")}
            className={cn("h-10 rounded-md text-sm font-medium text-slate-500", tab === value && "bg-white/90 text-[var(--accent-text)] shadow-sm dark:bg-slate-800 dark:text-[var(--accent)]")}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 rounded-lg bg-sky-100/70 p-1 dark:bg-slate-900">
        {[
          ["all", t("all")],
          ["unpaid", t("unpaid")],
          ["paid", t("paid")],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value as "all" | "paid" | "unpaid")}
            className={cn("h-10 rounded-md text-sm font-medium text-slate-500", status === value && "bg-white/90 text-[var(--accent-text)] shadow-sm dark:bg-slate-800 dark:text-[var(--accent)]")}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 rounded-lg border border-sky-100 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/90 sm:grid-cols-[1fr_1fr_auto]">
        <Field>
          <Label htmlFor="debtSearch">{t("search")}</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              id="debtSearch"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="pl-9"
            />
          </div>
        </Field>
        <Field>
          <Label htmlFor="debtDateFilter">{t("debtDate")}</Label>
          <DateInput id="debtDateFilter" max={todayInput()} value={date} onChange={(event) => setDate(event.target.value)} />
        </Field>
        {hasFilters ? (
          <Button
            type="button"
            variant="outline"
            className="mt-1 w-full self-end sm:mt-0 sm:w-auto"
            onClick={() => {
              setStatus("all");
              setDate("");
              setSearch("");
            }}
          >
            <X className="h-4 w-4" />
            {tCommon("clear")}
          </Button>
        ) : null}
      </div>
      {loading ? <ListRowSkeleton /> : <DebtList debts={filtered} />}
    </div>
  );
}
