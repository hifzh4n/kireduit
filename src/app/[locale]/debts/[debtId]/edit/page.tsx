"use client";

import { useParams } from "next/navigation";
import { useData } from "@/contexts/data-context";
import { DebtForm } from "@/components/debts/debt-form";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const { debtId } = useParams<{ debtId: string }>();
  const { debts, loading } = useData();
  const debt = debts.find((item) => item.id === debtId);

  if (loading) return <Skeleton className="h-96 w-full" />;
  if (!debt) return <Card className="p-4">Debt not found.</Card>;
  return <DebtForm debt={debt} />;
}
