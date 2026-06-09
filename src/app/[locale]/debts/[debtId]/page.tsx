"use client";

import { useParams } from "next/navigation";
import { DebtDetail } from "@/components/debts/debt-detail";

export default function Page() {
  const params = useParams<{ debtId: string }>();
  return <DebtDetail debtId={params.debtId} />;
}
