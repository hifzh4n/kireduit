"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useData } from "@/contexts/data-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExpenseList } from "@/components/expenses/expense-list";
import { Field, Input, Label, Select } from "@/components/ui/form";
import { expenseCategories, type ExpenseCategory } from "@/lib/types";

export default function Page() {
  const { expenses, loading } = useData();
  const [category, setCategory] = useState<"all" | ExpenseCategory>("all");
  const [date, setDate] = useState("");
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
          <p className="text-sm text-slate-500 dark:text-slate-400">Track daily spending.</p>
        </div>
        <Link href="/expenses/new">
          <Button size="icon" aria-label="Add expense">
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2">
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
          <Input id="dateFilter" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </Field>
      </div>
      {loading ? <Skeleton className="h-44 w-full" /> : <ExpenseList expenses={filtered} />}
    </div>
  );
}
