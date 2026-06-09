"use client";

import { type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { expenseSchema } from "@/lib/schemas";
import { expenseCategories, type Expense, type ExpenseCategory } from "@/lib/types";
import { todayInput } from "@/lib/format";
import { useData } from "@/contexts/data-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateInput, Field, FieldError, Input, Label, Select, Textarea } from "@/components/ui/form";
import { useRouter } from "@/i18n/navigation";

type Values = {
  amount: number | "";
  category: Expense["category"] | "";
  date: string;
  description?: string;
};

export function ExpenseForm({ expense }: { expense?: Expense }) {
  const router = useRouter();
  const t = useTranslations("Expenses");
  const tCommon = useTranslations("Common");
  const { addExpense, updateExpense } = useData();
  const form = useForm<Values>({
    resolver: zodResolver(expenseSchema) as unknown as Resolver<Values>,
    defaultValues: {
      amount: expense?.amount ?? "",
      category: expense?.category || "",
      date: expense?.date || todayInput(),
      description: expense?.description || "",
    },
  });

  async function submit(values: Values) {
    try {
      if (!values.category) return;
      const input = { ...values, amount: Number(values.amount), category: values.category as ExpenseCategory };
      if (expense) {
        await updateExpense(expense.id, input);
        toast.success(t("updated"));
      } else {
        await addExpense(input);
        toast.success(t("added"));
        form.reset({
          amount: "",
          category: "",
          date: todayInput(),
          description: "",
        });
      }
      router.push("/expenses");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("save"));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{expense ? t("editTitle") : t("addTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          <Field>
            <Label htmlFor="amount">{t("amount")}</Label>
            <Input id="amount" type="number" step="0.01" inputMode="decimal" placeholder="0.00" {...form.register("amount")} />
            <FieldError message={form.formState.errors.amount?.message} />
          </Field>
          <Field>
            <Label htmlFor="category">{t("category")}</Label>
            <Select id="category" {...form.register("category")}>
              <option value="">{t("selectCategory")}</option>
              {expenseCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
            <FieldError message={form.formState.errors.category?.message} />
          </Field>
          <Field>
            <Label htmlFor="date">{t("date")}</Label>
            <DateInput id="date" max={todayInput()} defaultValue={expense?.date || todayInput()} {...form.register("date")} />
            <FieldError message={form.formState.errors.date?.message} />
          </Field>
          <Field>
            <Label htmlFor="description">{t("descriptionLabel")}</Label>
            <Textarea id="description" placeholder={t("optionalNote")} {...form.register("description")} />
            <FieldError message={form.formState.errors.description?.message} />
          </Field>
          <Button className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? `${tCommon("save")}...` : t("save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
