"use client";

import { useRouter } from "next/navigation";
import { type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { debtSchema } from "@/lib/schemas";
import { todayInput } from "@/lib/format";
import type { Debt } from "@/lib/types";
import { useData } from "@/contexts/data-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, Input, Label, Select, Textarea } from "@/components/ui/form";

type Values = {
  personName: string;
  amount: number | "";
  type: Debt["type"];
  status: Debt["status"];
  dueDate?: string;
  description?: string;
};

export function DebtForm({ debt }: { debt?: Debt }) {
  const router = useRouter();
  const { addDebt, updateDebt } = useData();
  const form = useForm<Values>({
    resolver: zodResolver(debtSchema) as unknown as Resolver<Values>,
    defaultValues: {
      personName: debt?.personName || "",
      amount: debt?.amount ?? "",
      type: debt?.type || "i-owe",
      status: debt?.status || "unpaid",
      dueDate: debt?.dueDate || todayInput(),
      description: debt?.description || "",
    },
  });

  async function submit(values: Values) {
    try {
      const input = { ...values, amount: Number(values.amount) };
      if (debt) {
        await updateDebt(debt.id, input);
        toast.success("Debt updated");
      } else {
        await addDebt(input);
        toast.success("Debt added");
        form.reset({
          personName: "",
          amount: "",
          type: "i-owe",
          status: "unpaid",
          dueDate: todayInput(),
          description: "",
        });
      }
      router.push("/debts");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save debt");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{debt ? "Edit debt" : "Add debt"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          <Field>
            <Label htmlFor="personName">Person name</Label>
            <Input id="personName" autoComplete="name" placeholder="e.g. Ahmad" {...form.register("personName")} />
            <FieldError message={form.formState.errors.personName?.message} />
          </Field>
          <Field>
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" step="0.01" inputMode="decimal" placeholder="0.00" {...form.register("amount")} />
            <FieldError message={form.formState.errors.amount?.message} />
          </Field>
          <Field>
            <Label htmlFor="type">Debt type</Label>
            <Select id="type" {...form.register("type")}>
              <option value="i-owe">I Owe</option>
              <option value="owe-me">Owe Me</option>
            </Select>
          </Field>
          <Field>
            <Label htmlFor="status">Status</Label>
            <Select id="status" {...form.register("status")}>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </Select>
          </Field>
          <Field>
            <Label htmlFor="dueDate">Due date</Label>
            <Input id="dueDate" type="date" max={todayInput()} {...form.register("dueDate")} />
            <FieldError message={form.formState.errors.dueDate?.message} />
          </Field>
          <Field>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Optional note" {...form.register("description")} />
            <FieldError message={form.formState.errors.description?.message} />
          </Field>
          <Button className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save debt"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
