"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { money, prettyDate } from "@/lib/format";
import type { Expense } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { SwipeActionCard } from "@/components/ui/swipe-action-card";
import { useData } from "@/contexts/data-context";
import { ExpenseCategoryIcon } from "./expense-category-icon";

export function ExpenseList({ expenses }: { expenses: Expense[] }) {
  const t = useTranslations("Expenses");
  const { deleteExpense, restoreExpense } = useData();

  if (!expenses.length) {
    return <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {expenses.map((expense) => (
        <SwipeActionCard
          key={expense.id}
          detailHref={`/expenses/${expense.id}`}
          editHref={`/expenses/${expense.id}/edit`}
          onDelete={async () => {
            await deleteExpense(expense.id);
            toast.success(t("deleted"), {
              action: {
                label: "Undo",
                onClick: () => void restoreExpense(expense.id),
              },
            });
          }}
        >
          <Card className="flex items-center gap-3 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent-text)] dark:bg-[var(--accent-muted)] dark:text-[var(--accent)]">
              <ExpenseCategoryIcon category={expense.category} className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{expense.description || expense.category}</p>
                <Badge>{expense.category}</Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-300">{prettyDate(expense.date)}</p>
            </div>
            <p className="font-semibold">{money(expense.amount)}</p>
          </Card>
        </SwipeActionCard>
      ))}
    </div>
  );
}
