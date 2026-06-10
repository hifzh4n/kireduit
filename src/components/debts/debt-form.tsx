"use client";

import * as React from "react";
import { type Resolver, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Star, X } from "lucide-react";
import { debtSchema } from "@/lib/schemas";
import { todayInput } from "@/lib/format";
import type { Debt } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateInput, Field, FieldError, Label, Select, Textarea } from "@/components/ui/form";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useRouter } from "@/i18n/navigation";

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
  const t = useTranslations("Debts");
  const tCommon = useTranslations("Common");
  const tSettings = useTranslations("Settings");
  const { profile } = useAuth();
  const { debts, addDebt, updateDebt } = useData();
  const [showFavPicker, setShowFavPicker] = React.useState(false);
  const favPickerRef = React.useRef<HTMLDivElement>(null);

  const favoriteContacts = profile?.favoriteContacts || [];

  // Only history names (not favorites) for autocomplete
  const historySuggestions = React.useMemo(() => {
    const favSet = new Set(favoriteContacts);
    const names = new Set<string>();
    debts.forEach((d) => {
      if (d.personName && !favSet.has(d.personName)) names.add(d.personName);
    });
    return Array.from(names);
  }, [favoriteContacts, debts]);

  // Close picker on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (favPickerRef.current && !favPickerRef.current.contains(e.target as Node)) {
        setShowFavPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        toast.success(t("updated"));
      } else {
        await addDebt(input);
        toast.success(t("added"));
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
      toast.error(error instanceof Error ? error.message : t("save"));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{debt ? t("editTitle") : t("addTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          <Field>
            <Label htmlFor="personName">{t("personName")}</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <AutocompleteInput
                  id="personName"
                  placeholder="e.g. Ahmad"
                  suggestions={historySuggestions}
                  {...form.register("personName")}
                />
              </div>
              {favoriteContacts.length > 0 && (
                <div className="relative" ref={favPickerRef}>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={tSettings("favoriteContacts")}
                    onClick={() => setShowFavPicker((v) => !v)}
                    className="h-11 w-11 shrink-0 text-amber-500 border-amber-200 hover:bg-amber-50 hover:text-amber-600 dark:border-amber-800 dark:hover:bg-amber-950"
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </Button>
                  {showFavPicker && (
                    <div className="absolute right-0 top-12 z-20 w-48 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                        <span className="text-xs font-semibold text-slate-500">{tSettings("favoriteContacts")}</span>
                        <button
                          type="button"
                          onClick={() => setShowFavPicker(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <ul className="max-h-52 overflow-auto py-1">
                        {favoriteContacts.map((name) => (
                          <li
                            key={name}
                            className="cursor-pointer px-3 py-2 text-sm hover:bg-[var(--accent-soft)] hover:text-[var(--accent-text)] dark:hover:bg-[var(--accent-muted)] dark:hover:text-[var(--accent)]"
                            onClick={() => {
                              form.setValue("personName", name, { shouldValidate: true });
                              setShowFavPicker(false);
                            }}
                          >
                            {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            <FieldError message={form.formState.errors.personName?.message} />
          </Field>
          <Field>
            <Label htmlFor="amount">{t("amount")}</Label>
            <Controller
              name="amount"
              control={form.control}
              render={({ field }) => (
                <CurrencyInput
                  id="amount"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
            <FieldError message={form.formState.errors.amount?.message} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label htmlFor="type">{t("debtType")}</Label>
              <Select id="type" {...form.register("type")}>
                <option value="i-owe">{t("iOwe")}</option>
                <option value="owe-me">{t("oweMe")}</option>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="status">{t("status")}</Label>
              <Select id="status" {...form.register("status")}>
                <option value="unpaid">{t("unpaid")}</option>
                <option value="paid">{t("paid")}</option>
              </Select>
            </Field>
          </div>
          <Field>
            <Label htmlFor="dueDate">{t("debtDate")}</Label>
            <DateInput id="dueDate" max={todayInput()} defaultValue={debt?.dueDate || todayInput()} {...form.register("dueDate")} />
            <FieldError message={form.formState.errors.dueDate?.message} />
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
