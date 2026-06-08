"use client";

import Link from "next/link";
import { HandCoins } from "lucide-react";
import { money, prettyDate } from "@/lib/format";
import type { Debt } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";

export function DebtList({ debts }: { debts: Debt[] }) {
  if (!debts.length) {
    return <EmptyState title="No debts found" description="Add a debt to remember who owes what." />;
  }

  return (
    <div className="flex flex-col gap-3">
      {debts.map((debt) => (
        <Link href={`/debts/${debt.id}`} key={debt.id} className="block">
          <Card className="flex items-center gap-3 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent-text)] dark:bg-[var(--accent-muted)] dark:text-[var(--accent)]">
              <HandCoins className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{debt.personName}</p>
                <Badge tone={debt.status === "paid" ? "emerald" : "amber"}>{debt.status === "paid" ? "Paid" : "Unpaid"}</Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {debt.dueDate ? `Due ${prettyDate(debt.dueDate)}` : debt.description || "No due date"}
              </p>
            </div>
            <p className="font-semibold">{money(debt.amount)}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
