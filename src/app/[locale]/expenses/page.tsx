"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useData } from "@/contexts/data-context";
import { Button } from "@/components/ui/button";
import { ExpenseList } from "@/components/expenses/expense-list";
import { DateInput, Field, Input, Label, Select } from "@/components/ui/form";
import { expenseCategories, type ExpenseCategory } from "@/lib/types";
import { todayInput } from "@/lib/format";
import { DataError } from "@/components/data-error";
import { ListRowSkeleton } from "@/components/ui/list-row-skeleton";
import { Link } from "@/i18n/navigation";

export default function Page() {
  const t = useTranslations("Expenses");
  const tCategories = useTranslations("Categories");
  const tCommon = useTranslations("Common");
  const { expenses, error, loading } = useData();
  const [category, setCategory] = useState<"all" | ExpenseCategory>("all");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const hasFilters = category !== "all" || Boolean(date) || Boolean(search);
  const filtered = useMemo(
    () => {
      const query = search.trim().toLowerCase();

      return expenses.filter((expense) => {
        const matchesCategory = category === "all" || expense.category === category;
        const matchesDate = !date || expense.date === date;
        const searchableText = [
          expense.description,
          expense.category,
          tCategories(expense.category),
          expense.amount.toString(),
          expense.date,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const matchesSearch = !query || searchableText.includes(query);

        return matchesCategory && matchesDate && matchesSearch;
      });
    },
    [category, date, expenses, search, tCategories],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">{t("description")}</p>
        </div>
        <Link href="/expenses/new">
          <Button size="icon" aria-label={t("addTitle")}>
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      <DataError message={error} />
      <div className="grid gap-3 rounded-lg border border-sky-100 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/90 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <Field>
          <Label htmlFor="expenseSearch">{t("search")}</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              id="expenseSearch"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="pl-9"
            />
          </div>
        </Field>
        <Field>
          <Label htmlFor="categoryFilter">{t("category")}</Label>
          <Select id="categoryFilter" value={category} onChange={(event) => setCategory(event.target.value as "all" | ExpenseCategory)}>
            <option value="all">{t("allCategories")}</option>
            {expenseCategories.map((item) => (
              <option key={item} value={item}>
                {tCategories(item)}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="dateFilter">{t("date")}</Label>
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
              setSearch("");
            }}
          >
            <X className="h-4 w-4" />
            {tCommon("clear")}
          </Button>
        ) : null}
      </div>
      {loading ? <ListRowSkeleton /> : <ExpenseList expenses={filtered} />}
    </div>
  );
}
