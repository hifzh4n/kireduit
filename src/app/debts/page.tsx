"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useData } from "@/contexts/data-context";
import { Button } from "@/components/ui/button";
import { DebtList } from "@/components/debts/debt-list";
import { DateInput, Field, Label } from "@/components/ui/form";
import { todayInput } from "@/lib/format";
import { cn } from "@/lib/utils";
import { DataError } from "@/components/data-error";
import { ListRowSkeleton } from "@/components/ui/list-row-skeleton";

export default function Page() {
  const { debts, error, loading } = useData();
  const [tab, setTab] = useState<"i-owe" | "owe-me">("i-owe");
  const [status, setStatus] = useState<"all" | "paid" | "unpaid">("all");
  const [date, setDate] = useState("");
  const hasFilters = status !== "all" || Boolean(date);
  const filtered = debts.filter((debt) => {
    const matchesType = debt.type === tab;
    const matchesStatus = status === "all" || debt.status === status;
    const matchesDate = !date || debt.dueDate === date;
    return matchesType && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Debts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">Remember money owed both ways.</p>
        </div>
        <Link href="/debts/new">
          <Button size="icon" aria-label="Add debt">
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      <DataError message={error} />
      <div className="grid grid-cols-2 rounded-lg bg-sky-100/70 p-1 dark:bg-slate-900">
        {[
          ["i-owe", "I Owe"],
          ["owe-me", "Owe Me"],
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
          ["all", "All"],
          ["unpaid", "Unpaid"],
          ["paid", "Paid"],
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
      <div className="grid gap-3 rounded-lg border border-sky-100 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/90 sm:grid-cols-[1fr_auto]">
        <Field>
          <Label htmlFor="debtDateFilter">Debt date</Label>
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
            }}
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        ) : null}
      </div>
      {loading ? <ListRowSkeleton /> : <DebtList debts={filtered} />}
    </div>
  );
}
