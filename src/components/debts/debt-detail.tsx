"use client";

import { toast } from "sonner";
import { Check, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useData } from "@/contexts/data-context";
import { money, prettyDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmButton } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useRouter } from "@/i18n/navigation";

export function DebtDetail({ debtId }: { debtId: string }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Debts");
  const tCommon = useTranslations("Common");
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

  if (!debt) return <Card className="p-4">{t("notFound")}</Card>;

  const paid = debt.status === "paid";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{money(debt.amount)}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">{debt.type === "i-owe" ? t("iOwe") : t("oweMe")}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("details")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-300">{t("person")}</span>
            <span className="font-medium">{debt.personName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-300">{t("status")}</span>
            <Badge tone={paid ? "emerald" : "amber"}>{paid ? t("paid") : t("unpaid")}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-300">{t("debtDate")}</span>
            <span>{debt.dueDate ? prettyDate(debt.dueDate, locale) : t("noDebtDate")}</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-300">{t("descriptionLabel")}</p>
            <p className="mt-1">{debt.description || t("noDescription")}</p>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-3">
        <ConfirmButton
          title={paid ? t("markUnpaidQuestion") : t("markPaidQuestion")}
          description={paid ? t("markUnpaidDescription", { person: debt.personName }) : t("markPaidDescription", { person: debt.personName })}
          actionLabel={paid ? t("markUnpaid") : t("markPaid")}
          variant="default"
          onConfirm={async () => {
            await markDebt(debt.id, paid ? "unpaid" : "paid");
            toast.success(paid ? t("markedUnpaid") : t("markedPaid"));
          }}
        >
          <Button className="w-full" variant={paid ? "secondary" : "default"}>
            {paid ? <RotateCcw className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            {paid ? t("markUnpaid") : t("markPaid")}
          </Button>
        </ConfirmButton>
        <div className="grid grid-cols-2 gap-2">
          <Link href={`/debts/${debt.id}/edit`}>
            <Button variant="outline" className="w-full">
              <Pencil className="h-4 w-4" />
              {tCommon("edit")}
            </Button>
          </Link>
          <ConfirmButton
            title={t("deleteQuestion")}
            description={t("deleteDescription")}
            onConfirm={async () => {
              await deleteDebt(debt.id);
              toast.success(t("deleted"), {
                action: {
                  label: tCommon("undo"),
                  onClick: () => void restoreDebt(debt.id),
                },
              });
              router.push("/debts");
            }}
          >
            <Button variant="danger" className="w-full">
              <Trash2 className="h-4 w-4" />
              {tCommon("delete")}
            </Button>
          </ConfirmButton>
        </div>
      </div>
    </div>
  );
}
