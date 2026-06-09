"use client";

import { useParams } from "next/navigation";
import { useData } from "@/contexts/data-context";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const { expenseId } = useParams<{ expenseId: string }>();
  const { expenses, loading } = useData();
  const expense = expenses.find((item) => item.id === expenseId);

  if (loading) return <Skeleton className="h-96 w-full" />;
  if (!expense) return <Card className="p-4">Expense not found.</Card>;
  return <ExpenseForm expense={expense} />;
}
