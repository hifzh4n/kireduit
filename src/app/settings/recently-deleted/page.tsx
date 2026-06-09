"use client";

import { RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/data-context";
import { money, prettyDate } from "@/lib/format";
import type { DeletedDebt, DeletedExpense } from "@/lib/types";
import { ExpenseCategoryIcon } from "@/components/expenses/expense-category-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmButton } from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/empty-state";
import { ListRowSkeleton } from "@/components/ui/list-row-skeleton";

export default function Page() {
  const {
    deletedDebts,
    deletedExpenses,
    loading,
    permanentlyDeleteDebt,
    permanentlyDeleteExpense,
    restoreDebt,
    restoreExpense,
  } = useData();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Recently Deleted</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">Deleted records stay here for 30 days before removal.</p>
      </div>

      {loading ? (
        <ListRowSkeleton rows={4} />
      ) : deletedExpenses.length || deletedDebts.length ? (
        <>
          <DeletedSection title="Expenses" emptyText="No deleted expenses.">
            {deletedExpenses.map((expense) => (
              <DeletedExpenseRow
                key={expense.id}
                expense={expense}
                onRestore={async () => {
                  try {
                    await restoreExpense(expense.id);
                    toast.success("Expense restored");
                  } catch (error) {
                    toast.error(error instanceof Error ? friendlyFirebaseMessage(error.message) : "Unable to restore expense.");
                  }
                }}
                onPermanentDelete={async () => {
                  await permanentlyDeleteExpense(expense.id);
                  toast.success("Expense permanently deleted");
                }}
              />
            ))}
          </DeletedSection>

          <DeletedSection title="Debts" emptyText="No deleted debts.">
            {deletedDebts.map((debt) => (
              <DeletedDebtRow
                key={debt.id}
                debt={debt}
                onRestore={async () => {
                  try {
                    await restoreDebt(debt.id);
                    toast.success("Debt restored");
                  } catch (error) {
                    toast.error(error instanceof Error ? friendlyFirebaseMessage(error.message) : "Unable to restore debt.");
                  }
                }}
                onPermanentDelete={async () => {
                  await permanentlyDeleteDebt(debt.id);
                  toast.success("Debt permanently deleted");
                }}
              />
            ))}
          </DeletedSection>
        </>
      ) : (
        <EmptyState title="Nothing recently deleted" description="Deleted expenses and debts will appear here for 30 days." />
      )}
    </div>
  );
}

function DeletedSection({ children, emptyText, title }: { children: React.ReactNode; emptyText: string; title: string }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);

  return (
    <section className="space-y-3">
      <h2 className="font-semibold">{title}</h2>
      {hasChildren ? <div className="flex flex-col gap-3">{children}</div> : <p className="text-sm text-slate-500 dark:text-slate-300">{emptyText}</p>}
    </section>
  );
}

function DeletedExpenseRow({
  expense,
  onPermanentDelete,
  onRestore,
}: {
  expense: DeletedExpense;
  onPermanentDelete: () => Promise<void>;
  onRestore: () => Promise<void>;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent-text)] dark:bg-[var(--accent-muted)] dark:text-[var(--accent)]">
            <ExpenseCategoryIcon category={expense.category} className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <CardTitle className="truncate">{expense.description || expense.category}</CardTitle>
              <Badge className="shrink-0">{expense.category}</Badge>
            </div>
            <CardDescription>{prettyDate(expense.date)}</CardDescription>
          </div>
          <p className="font-semibold tabular-nums">{money(expense.amount)}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
          <span>{countdown(expense.expiresAt)}</span>
        </div>
        <DeletedActions itemLabel="expense" onPermanentDelete={onPermanentDelete} onRestore={onRestore} />
      </CardContent>
    </Card>
  );
}

function DeletedDebtRow({
  debt,
  onPermanentDelete,
  onRestore,
}: {
  debt: DeletedDebt;
  onPermanentDelete: () => Promise<void>;
  onRestore: () => Promise<void>;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent-text)] dark:bg-[var(--accent-muted)] dark:text-[var(--accent)]">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">{debt.personName}</CardTitle>
            <CardDescription>{debt.dueDate ? `Debt date ${prettyDate(debt.dueDate)}` : "No debt date"}</CardDescription>
          </div>
          <p className="font-semibold tabular-nums">{money(debt.amount)}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
          <Badge tone={debt.status === "paid" ? "emerald" : "amber"}>{debt.status === "paid" ? "Paid" : "Unpaid"}</Badge>
          <span>{countdown(debt.expiresAt)}</span>
        </div>
        <DeletedActions itemLabel="debt" onPermanentDelete={onPermanentDelete} onRestore={onRestore} />
      </CardContent>
    </Card>
  );
}

function DeletedActions({
  itemLabel,
  onPermanentDelete,
  onRestore,
}: {
  itemLabel: string;
  onPermanentDelete: () => Promise<void>;
  onRestore: () => Promise<void>;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button type="button" variant="outline" className="w-full" onClick={onRestore}>
        <RotateCcw className="h-4 w-4" />
        Restore
      </Button>
      <ConfirmButton
        title={`Delete ${itemLabel} permanently?`}
        description="This cannot be undone."
        actionLabel="Delete"
        onConfirm={onPermanentDelete}
      >
        <Button type="button" variant="danger" className="w-full">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </ConfirmButton>
    </div>
  );
}

function countdown(expiresAt: number) {
  const remaining = Math.max(0, expiresAt - Date.now());
  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.ceil((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  if (days > 0) return `Deletes in ${days}d ${hours}h`;
  if (hours > 0) return `Deletes in ${hours}h`;
  return "Deletes soon";
}

function friendlyFirebaseMessage(message: string) {
  if (message.toLowerCase().includes("permission")) {
    return "Missing Firestore permission. Deploy the latest Firestore rules and try again.";
  }

  return message || "Unable to complete action.";
}
