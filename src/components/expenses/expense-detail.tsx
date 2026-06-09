"use client";

import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useData } from "@/contexts/data-context";
import { money, prettyDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmButton } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ExpenseCategoryIcon } from "./expense-category-icon";
import { Link, useRouter } from "@/i18n/navigation";

export function ExpenseDetail({ expenseId }: { expenseId: string }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Expenses");
  const tCategories = useTranslations("Categories");
  const tCommon = useTranslations("Common");
  const { expenses, deleteExpense, restoreExpense, loading } = useData();
  const expense = expenses.find((item) => item.id === expenseId);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-14 w-40" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    );
  }
  if (!expense) {
    return (
      <Card className="p-4">
        <p className="font-medium">{t("notFound")}</p>
        <Button className="mt-4 w-full" onClick={() => router.push("/expenses")}>
          {t("backToExpenses")}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{money(expense.amount)}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">{prettyDate(expense.date, locale)}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("details")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-300">{t("category")}</span>
            <Badge className="gap-1.5">
              <ExpenseCategoryIcon category={expense.category} className="h-3.5 w-3.5" />
              {tCategories(expense.category)}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-300">{t("descriptionLabel")}</p>
            <p className="mt-1">{expense.description || t("noDescription")}</p>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-2">
        <Link href={`/expenses/${expense.id}/edit`}>
          <Button variant="outline" className="w-full">
            <Pencil className="h-4 w-4" />
            {tCommon("edit")}
          </Button>
        </Link>
        <ConfirmButton
          title={t("deleteQuestion")}
          description={t("deleteDescription")}
          onConfirm={async () => {
            await deleteExpense(expense.id);
            toast.success(t("deleted"), {
              action: {
                label: tCommon("undo"),
                onClick: () => void restoreExpense(expense.id),
              },
            });
            router.push("/expenses");
          }}
        >
          <Button variant="danger" className="w-full">
            <Trash2 className="h-4 w-4" />
            {tCommon("delete")}
          </Button>
        </ConfirmButton>
      </div>
    </div>
  );
}
