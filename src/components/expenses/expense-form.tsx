"use client";

import { useRouter } from "next/navigation";
import { type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { expenseSchema } from "@/lib/schemas";
import { expenseCategories, type Expense } from "@/lib/types";
import { todayInput } from "@/lib/format";
import { useData } from "@/contexts/data-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, Input, Label, Select, Textarea } from "@/components/ui/form";

type Values = {
  amount: number;
  category: Expense["category"];
  date: string;
  description?: string;
};

export function ExpenseForm({ expense }: { expense?: Expense }) {
  const router = useRouter();
  const { addExpense, updateExpense } = useData();
  const form = useForm<Values>({
    resolver: zodResolver(expenseSchema) as unknown as Resolver<Values>,
    defaultValues: {
      amount: expense?.amount || 0,
      category: expense?.category || "Food",
      date: expense?.date || todayInput(),
      description: expense?.description || "",
    },
  });

  async function submit(values: Values) {
    try {
      if (expense) {
        await updateExpense(expense.id, values);
        toast.success("Expense updated");
      } else {
        await addExpense(values);
        toast.success("Expense added");
        form.reset({
          amount: 0,
          category: "Food",
          date: todayInput(),
          description: "",
        });
      }
      router.push("/expenses");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save expense");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{expense ? "Edit expense" : "Add expense"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          <Field>
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" step="0.01" inputMode="decimal" {...form.register("amount")} />
            <FieldError message={form.formState.errors.amount?.message} />
          </Field>
          <Field>
            <Label htmlFor="category">Category</Label>
            <Select id="category" {...form.register("category")}>
              {expenseCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </Select>
            <FieldError message={form.formState.errors.category?.message} />
          </Field>
          <Field>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" max={todayInput()} {...form.register("date")} />
            <FieldError message={form.formState.errors.date?.message} />
          </Field>
          <Field>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Optional note" {...form.register("description")} />
            <FieldError message={form.formState.errors.description?.message} />
          </Field>
          <Button className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save expense"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
