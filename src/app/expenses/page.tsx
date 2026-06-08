"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { useData } from "@/contexts/data-context";
import { Button } from "@/components/ui/button";
import { ExpenseList } from "@/components/expenses/expense-list";
import { DateInput, Field, Label, Select } from "@/components/ui/form";
import { expenseCategories, type ExpenseCategory } from "@/lib/types";
import { todayInput } from "@/lib/format";
import { DataError } from "@/components/data-error";
import { ListRowSkeleton } from "@/components/ui/list-row-skeleton";

export default function Page() {
  const { expenses, error, loading } = useData();
  const [category, setCategory] = useState<"all" | ExpenseCategory>("all");
  const [date, setDate] = useState("");
  const hasFilters = category !== "all" || Boolean(date);
  const filtered = useMemo(
    () =>
      expenses.filter((expense) => {
        const matchesCategory = category === "all" || expense.category === category;
        const matchesDate = !date || expense.date === date;
        return matchesCategory && matchesDate;
      }),
    [category, date, expenses],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expenses</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">Track daily spending.</p>
        </div>
        <Link href="/expenses/new">
          <Button size="icon" aria-label="Add expense">
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      <DataError message={error} />
      <div className="grid gap-3 rounded-lg border border-sky-100 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/90 sm:grid-cols-[1fr_1fr_auto]">
        <Field>
          <Label htmlFor="categoryFilter">Category</Label>
          <Select id="categoryFilter" value={category} onChange={(event) => setCategory(event.target.value as "all" | ExpenseCategory)}>
            <option value="all">All categories</option>
            {expenseCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="dateFilter">Date</Label>
          <DateInput id="dateFilter" max={todayInput()} value={date} onChange={(event) => setDate(event.target.value)} />
        </Field>
        {hasFilters ? (
          <Button
            type="button"
            variant="outline"
            className="mt-1 w-full self-end sm:mt-0 sm:w-auto"
            onClick={() => {
              setCategory("all");
              setDate("");
            }}
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        ) : null}
      </div>
      {loading ? <ListRowSkeleton /> : <ExpenseList expenses={filtered} />}
    </div>
  );
}
