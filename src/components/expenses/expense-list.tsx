"use client";

import Link from "next/link";
import { ReceiptText } from "lucide-react";
import { money, prettyDate } from "@/lib/format";
import type { Expense } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";

export function ExpenseList({ expenses }: { expenses: Expense[] }) {
  if (!expenses.length) {
    return <EmptyState title="No expenses found" description="Add your first expense when you spend money." />;
  }

  return (
    <div className="flex flex-col gap-3">
      {expenses.map((expense) => (
        <Link href={`/expenses/${expense.id}`} key={expense.id} className="block">
          <Card className="flex items-center gap-3 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-200">
              <ReceiptText className="h-5 w-5" />
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
        </Link>
      ))}
    </div>
  );
}
