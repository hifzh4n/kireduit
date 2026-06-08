"use client";

import { useParams } from "next/navigation";
import { ExpenseDetail } from "@/components/expenses/expense-detail";

export default function Page() {
  const params = useParams<{ expenseId: string }>();
  return <ExpenseDetail expenseId={params.expenseId} />;
}
