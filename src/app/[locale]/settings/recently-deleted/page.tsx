"use client";

import { RotateCcw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Settings");
  const tExpenses = useTranslations("Expenses");
  const tDebts = useTranslations("Debts");
  const tErrors = useTranslations("Errors");
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
        <h1 className="text-2xl font-semibold">{t("recentlyDeletedTitle")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">{t("recentlyDeletedIntro")}</p>
      </div>

      {loading ? (
        <ListRowSkeleton rows={4} />
      ) : deletedExpenses.length || deletedDebts.length ? (
        <>
          <DeletedSection title={tExpenses("title")} emptyText={t("noDeletedExpenses")}>
            {deletedExpenses.map((expense) => (
              <DeletedExpenseRow
                key={expense.id}
                expense={expense}
                onRestore={async () => {
                  try {
                    await restoreExpense(expense.id);
                    toast.success(t("expenseRestored"));
                  } catch (error) {
                    toast.error(error instanceof Error ? friendlyFirebaseMessage(error.message, tErrors("permission"), t("unableRestoreExpense")) : t("unableRestoreExpense"));
                  }
                }}
                onPermanentDelete={async () => {
                  await permanentlyDeleteExpense(expense.id);
                  toast.success(t("expensePermanentlyDeleted"));
                }}
              />
            ))}
          </DeletedSection>

          <DeletedSection title={tDebts("title")} emptyText={t("noDeletedDebts")}>
            {deletedDebts.map((debt) => (
              <DeletedDebtRow
                key={debt.id}
                debt={debt}
                onRestore={async () => {
                  try {
                    await restoreDebt(debt.id);
                    toast.success(t("debtRestored"));
                  } catch (error) {
                    toast.error(error instanceof Error ? friendlyFirebaseMessage(error.message, tErrors("permission"), t("unableRestoreDebt")) : t("unableRestoreDebt"));
                  }
                }}
                onPermanentDelete={async () => {
                  await permanentlyDeleteDebt(debt.id);
                  toast.success(t("debtPermanentlyDeleted"));
                }}
              />
            ))}
          </DeletedSection>
        </>
      ) : (
        <EmptyState title={t("nothingRecentlyDeleted")} description={t("deletedRecordsEmpty")} />
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
  const t = useTranslations("Settings");
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
          <span>{countdown(expense.expiresAt, t)}</span>
        </div>
        <DeletedActions itemLabel={t("expenseItem")} onPermanentDelete={onPermanentDelete} onRestore={onRestore} />
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
  const t = useTranslations("Settings");
  const tDebts = useTranslations("Debts");
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent-text)] dark:bg-[var(--accent-muted)] dark:text-[var(--accent)]">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">{debt.personName}</CardTitle>
            <CardDescription>{debt.dueDate ? t("debtDateValue", { date: prettyDate(debt.dueDate) }) : tDebts("noDebtDate")}</CardDescription>
          </div>
          <p className="font-semibold tabular-nums">{money(debt.amount)}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
          <Badge tone={debt.status === "paid" ? "emerald" : "amber"}>{debt.status === "paid" ? tDebts("paid") : tDebts("unpaid")}</Badge>
          <span>{countdown(debt.expiresAt, t)}</span>
        </div>
        <DeletedActions itemLabel={t("debtItem")} onPermanentDelete={onPermanentDelete} onRestore={onRestore} />
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
  const t = useTranslations("Settings");
  const tCommon = useTranslations("Common");
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button type="button" variant="outline" className="w-full" onClick={onRestore}>
        <RotateCcw className="h-4 w-4" />
        {tCommon("restore")}
      </Button>
      <ConfirmButton
        title={t("deleteItemPermanently", { item: itemLabel })}
        description={t("cannotBeUndone")}
        actionLabel={tCommon("delete")}
        onConfirm={onPermanentDelete}
      >
        <Button type="button" variant="danger" className="w-full">
          <Trash2 className="h-4 w-4" />
          {tCommon("delete")}
        </Button>
      </ConfirmButton>
    </div>
  );
}

function countdown(expiresAt: number, t: ReturnType<typeof useTranslations<"Settings">>) {
  const remaining = Math.max(0, expiresAt - Date.now());
  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.ceil((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  if (days > 0) return t("deletedInDaysHours", { days, hours });
  if (hours > 0) return t("deletedInHours", { hours });
  return t("deletesSoon");
}

function friendlyFirebaseMessage(message: string, permissionMessage: string, fallback: string) {
  if (message.toLowerCase().includes("permission")) {
    return permissionMessage;
  }

  return message || fallback;
}
