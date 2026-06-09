"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { useData } from "@/contexts/data-context";
import { money, prettyDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmButton } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function DebtDetail({ debtId }: { debtId: string }) {
  const router = useRouter();
  const { debts, deleteDebt, markDebt, restoreDebt, loading } = useData();
  const debt = debts.find((item) => item.id === debtId);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-14 w-40" />
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!debt) return <Card className="p-4">Debt not found.</Card>;

  const paid = debt.status === "paid";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{money(debt.amount)}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">{debt.type === "i-owe" ? "I owe" : "Owe me"}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Debt details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-300">Person</span>
            <span className="font-medium">{debt.personName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-300">Status</span>
            <Badge tone={paid ? "emerald" : "amber"}>{paid ? "Paid" : "Unpaid"}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-300">Debt date</span>
            <span>{debt.dueDate ? prettyDate(debt.dueDate) : "No debt date"}</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-300">Description</p>
            <p className="mt-1">{debt.description || "No description"}</p>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-3">
        <ConfirmButton
          title={paid ? "Mark debt as unpaid?" : "Mark debt as paid?"}
          description={
            paid
              ? `This will move ${debt.personName}'s debt back to unpaid.`
              : `Confirm that ${debt.personName}'s debt has been paid.`
          }
          actionLabel={paid ? "Mark unpaid" : "Mark paid"}
          variant="default"
          onConfirm={async () => {
            await markDebt(debt.id, paid ? "unpaid" : "paid");
            toast.success(paid ? "Debt marked as unpaid" : "Debt marked as paid");
          }}
        >
          <Button className="w-full" variant={paid ? "secondary" : "default"}>
            {paid ? <RotateCcw className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            {paid ? "Mark unpaid" : "Mark paid"}
          </Button>
        </ConfirmButton>
        <div className="grid grid-cols-2 gap-2">
          <Link href={`/debts/${debt.id}/edit`}>
            <Button variant="outline" className="w-full">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <ConfirmButton
            title="Delete debt?"
            description="This debt record will move to recently deleted for 30 days."
            onConfirm={async () => {
              await deleteDebt(debt.id);
              toast.success("Debt moved to recently deleted", {
                action: {
                  label: "Undo",
                  onClick: () => void restoreDebt(debt.id),
                },
              });
              router.push("/debts");
            }}
          >
            <Button variant="danger" className="w-full">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </ConfirmButton>
        </div>
      </div>
    </div>
  );
}
