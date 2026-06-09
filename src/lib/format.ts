import { format, isToday, parseISO, startOfMonth } from "date-fns";
import { enUS, ms } from "date-fns/locale";
import type { Expense } from "./types";

export function money(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(value || 0);
}

export function prettyDate(value?: string, locale = "en") {
  if (!value) return "No date";
  return format(parseISO(value), "dd MMM yyyy", { locale: locale === "ms" ? ms : enUS });
}

export function todayInput() {
  return format(new Date(), "yyyy-MM-dd");
}

export function totalExpensesToday(expenses: Expense[]) {
  return expenses
    .filter((expense) => isToday(parseISO(expense.date)))
    .reduce((sum, expense) => sum + expense.amount, 0);
}

export function totalExpensesThisMonth(expenses: Expense[]) {
  const monthStart = startOfMonth(new Date());
  return expenses
    .filter((expense) => parseISO(expense.date) >= monthStart)
    .reduce((sum, expense) => sum + expense.amount, 0);
}
