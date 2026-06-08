"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useData } from "@/contexts/data-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DebtList } from "@/components/debts/debt-list";
import { cn } from "@/lib/utils";

export default function Page() {
  const { debts, loading } = useData();
  const [tab, setTab] = useState<"i-owe" | "owe-me">("i-owe");
  const [status, setStatus] = useState<"all" | "paid" | "unpaid">("all");
  const filtered = debts.filter((debt) => debt.type === tab && (status === "all" || debt.status === status));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Debts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">Remember money owed both ways.</p>
        </div>
        <Link href="/debts/new">
          <Button size="icon" aria-label="Add debt">
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 rounded-lg bg-sky-100/70 p-1 dark:bg-slate-900">
        {[
          ["i-owe", "I Owe"],
          ["owe-me", "Owe Me"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value as "i-owe" | "owe-me")}
            className={cn("h-10 rounded-md text-sm font-medium text-slate-500", tab === value && "bg-white/90 text-teal-600 shadow-sm dark:bg-slate-800 dark:text-teal-200")}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 rounded-lg bg-sky-100/70 p-1 dark:bg-slate-900">
        {[
          ["all", "All"],
          ["unpaid", "Unpaid"],
          ["paid", "Paid"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value as "all" | "paid" | "unpaid")}
            className={cn("h-10 rounded-md text-sm font-medium text-slate-500", status === value && "bg-white/90 text-teal-600 shadow-sm dark:bg-slate-800 dark:text-teal-200")}
          >
            {label}
          </button>
        ))}
      </div>
      {loading ? <Skeleton className="h-44 w-full" /> : <DebtList debts={filtered} />}
    </div>
  );
}
