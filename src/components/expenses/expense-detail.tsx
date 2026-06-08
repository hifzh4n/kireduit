"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { useData } from "@/contexts/data-context";
import { money, prettyDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmButton } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function ExpenseDetail({ expenseId }: { expenseId: string }) {
  const router = useRouter();
  const { expenses, deleteExpense, loading } = useData();
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
        <p className="font-medium">Expense not found</p>
        <Button className="mt-4 w-full" onClick={() => router.push("/expenses")}>
          Back to expenses
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{money(expense.amount)}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">{prettyDate(expense.date)}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Expense details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-300">Category</span>
            <Badge>{expense.category}</Badge>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-300">Description</p>
            <p className="mt-1">{expense.description || "No description"}</p>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-2">
        <Link href={`/expenses/${expense.id}/edit`}>
          <Button variant="outline" className="w-full">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </Link>
        <ConfirmButton
          title="Delete expense?"
          description="This expense will be removed permanently."
          onConfirm={async () => {
            await deleteExpense(expense.id);
            toast.success("Expense deleted");
            router.push("/expenses");
          }}
        >
          <Button variant="danger" className="w-full">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </ConfirmButton>
      </div>
    </div>
  );
}
