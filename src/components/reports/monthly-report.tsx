"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDaysInMonth,
  isWithinInterval,
  parseISO,
  startOfMonth,
} from "date-fns";
import { enUS, ms } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertCircle, CalendarDays, ChevronLeft, ChevronRight, CircleDollarSign, Filter, ListChecks, ReceiptText, TrendingUp, Trophy } from "lucide-react";
import { useData } from "@/contexts/data-context";
import { money, prettyDate } from "@/lib/format";
import { expenseCategories, type Debt, type Expense, type ExpenseCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Select } from "@/components/ui/form";

type CategoryTotal = {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
};

const categoryColors: Record<ExpenseCategory, string> = {
  Food: "#10b981",
  Transport: "#3b82f6",
  Fuel: "#f59e0b",
  Shopping: "#ec4899",
  Bills: "#8b5cf6",
  Health: "#ef4444",
  Entertainment: "#06b6d4",
  Education: "#84cc16",
  Other: "#64748b",
};

const categoryChartInitialDimension = { width: 320, height: 208 };
const dailyChartInitialDimension = { width: 640, height: 288 };
const debtChartInitialDimension = { width: 640, height: 256 };

function getCategoryColor(category: ExpenseCategory) {
  return categoryColors[category];
}

const tooltipStyle = {
  backgroundColor: "var(--chart-tooltip-bg)",
  border: "1px solid var(--chart-tooltip-border)",
  borderRadius: "8px",
  color: "var(--foreground)",
  boxShadow: "0 12px 30px rgb(15 23 42 / 0.16)",
};

const tooltipLabelStyle = {
  color: "var(--foreground)",
  fontWeight: 600,
};

export function MonthlyReport() {
  const locale = useLocale();
  const dateLocale = locale === "ms" ? ms : enUS;
  const t = useTranslations("Reports");
  const tCommon = useTranslations("Common");
  const tCategories = useTranslations("Categories");
  const tDebts = useTranslations("Debts");
  const tErrors = useTranslations("Errors");
  const { expenses, debts, error, loading } = useData();
  const [selectedMonth, setSelectedMonth] = useState(() => startOfMonth(new Date()));
  const [categoryFilter, setCategoryFilter] = useState<"all" | ExpenseCategory>("all");

  const report = useMemo(() => buildMonthlyReport(expenses, debts, selectedMonth, categoryFilter), [categoryFilter, debts, expenses, selectedMonth]);
  const previousReport = useMemo(
    () => buildMonthlyReport(expenses, debts, addMonths(selectedMonth, -1), categoryFilter),
    [categoryFilter, debts, expenses, selectedMonth],
  );
  const comparison = getMonthComparison(report.totalMonthlyExpenses, previousReport.totalMonthlyExpenses, t);
  const monthLabel = format(selectedMonth, "MMMM yyyy", { locale: dateLocale });
  const shortMonthLabel = format(selectedMonth, "MMM yyyy", { locale: dateLocale });
  const categoryLabel = (category: ExpenseCategory) => tCategories(category);
  const insights = [
    report.highestSpendingCategory
      ? t("spentMostOn", { category: categoryLabel(report.highestSpendingCategory) })
      : t("noCategoryStandsOut"),
    t("averageDailyInsight", { amount: money(report.averageDailySpending) }),
    report.biggestExpense
      ? t("largestExpenseInsight", { amount: money(report.biggestExpense.amount), category: categoryLabel(report.biggestExpense.category) })
      : t("noLargestExpense"),
  ];
  const debtChartData = [
    { ...report.debtChartData[0], name: tDebts("iOwe") },
    { ...report.debtChartData[1], name: tDebts("oweMe") },
  ];

  if (loading) {
    return <ReportSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-start gap-3 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
          <div>
            <p className="font-semibold">{t("unableToLoad")}</p>
            <p className="text-sm text-slate-500 dark:text-slate-300">{tErrors("tryAgain")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasReportData = report.monthExpenses.length > 0 || report.monthDebts.length > 0;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">{t("description")}</p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent-text)] dark:bg-[var(--accent-muted)] dark:text-[var(--accent)]">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-300">{t("selectedMonth")}</p>
              <p className="text-lg font-semibold">{monthLabel}</p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_1.15fr]">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedMonth((month) => addMonths(month, -1))}>
                <ChevronLeft className="h-4 w-4" />
                {t("previous")}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedMonth(startOfMonth(new Date()))}>
                {t("current")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedMonth((month) => addMonths(month, 1))}>
                {t("next")}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-sky-100 bg-white/80 px-2 dark:border-slate-800 dark:bg-slate-950/60">
              <Filter className="h-4 w-4 text-[var(--accent-text)] dark:text-[var(--accent)]" />
              <Select
                aria-label={t("filterCategory")}
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value as "all" | ExpenseCategory)}
                className="border-0 bg-transparent px-0 focus:ring-0"
              >
                <option value="all">{t("allCategories")}</option>
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabel(category)}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {!hasReportData ? (
        <EmptyState title={t("emptyMonthTitle")} description={t("emptyMonthDescription")} />
      ) : null}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <SummaryCard icon={CircleDollarSign} label={t("totalExpenses")} value={money(report.totalMonthlyExpenses)} />
        <SummaryCard icon={ListChecks} label={t("transactions")} value={report.totalTransactions.toString()} />
        <SummaryCard icon={ReceiptText} label={t("averageDaily")} value={money(report.averageDailySpending)} />
        <SummaryCard icon={Trophy} label={t("topCategory")} value={report.highestSpendingCategory ? categoryLabel(report.highestSpendingCategory) : tCommon("none")} />
        <SummaryCard icon={CalendarDays} label={t("highestDay")} value={report.highestSpendingDay ? money(report.highestSpendingDay.amount) : tCommon("none")} />
        <SummaryCard icon={TrendingUp} label={t("vsPrevious")} value={comparison} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("expensesByCategory")}</CardTitle>
            <CardDescription>{t("expensesByCategoryDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.categoryTotals.length ? (
              <>
                <div className="report-chart h-52">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={categoryChartInitialDimension}>
                    <PieChart>
                      <Pie data={report.categoryTotals} dataKey="amount" nameKey="category" innerRadius={48} outerRadius={78} paddingAngle={2}>
                        {report.categoryTotals.map((entry) => (
                          <Cell
                            key={entry.category}
                            fill={getCategoryColor(entry.category)}
                            stroke="var(--chart-tooltip-bg)"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [
                          money(Number(value)),
                          typeof name === "string" && expenseCategories.includes(name as ExpenseCategory)
                            ? categoryLabel(name as ExpenseCategory)
                            : name,
                        ]}
                        contentStyle={tooltipStyle}
                        labelStyle={tooltipLabelStyle}
                        itemStyle={{ color: "var(--foreground)" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {report.categoryTotals.map((item) => (
                    <CategoryRow key={item.category} item={item} categoryLabel={categoryLabel(item.category)} />
                  ))}
                </div>
              </>
            ) : (
              <p className="rounded-lg border border-dashed border-sky-100 bg-white/70 p-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
                {t("emptyMonthTitle")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("biggestExpense")}</CardTitle>
            <CardDescription>{t("biggestExpenseDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            {report.biggestExpense ? (
              <div className="space-y-3 tabular-nums">
                <DetailRow label={t("amount")} value={money(report.biggestExpense.amount)} />
                <DetailRow label={t("category")} value={categoryLabel(report.biggestExpense.category)} />
                <DetailRow label={t("date")} value={prettyDate(report.biggestExpense.date, locale)} />
                <DetailRow label={t("descriptionLabel")} value={report.biggestExpense.description || tCommon("none")} />
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300">{t("emptyMonthTitle")}</p>
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{t("dailySpending")}</CardTitle>
          <CardDescription>{t("dailySpendingDescription", { month: monthLabel })}</CardDescription>
        </CardHeader>
        <CardContent>
          {report.totalMonthlyExpenses > 0 ? (
            <div className="report-chart h-72">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={dailyChartInitialDimension}>
                <BarChart data={report.dailySpending} margin={{ left: -16, right: 4, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="var(--chart-text)" tick={{ fill: "var(--chart-text)" }} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--chart-text)" tick={{ fill: "var(--chart-text)" }} tickFormatter={(value) => `RM${value}`} />
                  <Tooltip
                    formatter={(value) => [money(Number(value)), t("amount")]}
                    labelFormatter={(label) => {
                      const day = Number(label);
                      return Number.isFinite(day)
                        ? format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day), "d MMM yyyy", { locale: dateLocale })
                        : `${label} ${shortMonthLabel}`;
                    }}
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    itemStyle={{ color: "var(--foreground)" }}
                    cursor={{ fill: "var(--accent-muted)" }}
                  />
                  <Bar dataKey="amount" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <ChartEmptyState title={t("noDailySpending")} description={t("noDailySpendingDescription")} />
          )}
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <DebtSummaryCard title={tDebts("iOwe")} summary={report.debtSummary.iOwe} labels={{ unpaid: t("unpaidAmount"), paid: t("paidAmount"), records: t("records") }} />
        <DebtSummaryCard title={tDebts("oweMe")} summary={report.debtSummary.oweMe} labels={{ unpaid: t("unpaidAmount"), paid: t("paidAmount"), records: t("records") }} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{t("debtStatusChart")}</CardTitle>
          <CardDescription>{t("debtStatusChartDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {report.totalDebtRecords > 0 ? (
            <div className="report-chart h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={debtChartInitialDimension}>
                <BarChart data={debtChartData} margin={{ left: -16, right: 4, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="var(--chart-text)" tick={{ fill: "var(--chart-text)" }} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--chart-text)" tick={{ fill: "var(--chart-text)" }} tickFormatter={(value) => `RM${value}`} />
                  <Tooltip
                    formatter={(value) => money(Number(value))}
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    itemStyle={{ color: "var(--foreground)" }}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar dataKey="unpaid" name={tDebts("unpaid")} fill="var(--accent)" background={false} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="paid" name={tDebts("paid")} fill="var(--accent-hover)" fillOpacity={0.55} background={false} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <ChartEmptyState title={t("noDebtRecords")} description={t("noDebtRecordsDescription")} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("monthlyInsight")}</CardTitle>
          <CardDescription>{t("monthlyInsightDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 rounded-b-lg bg-[var(--accent-soft)] p-4 text-sm leading-6 text-slate-700 dark:bg-[var(--accent-muted)] dark:text-slate-100">
          {insights.map((insight) => (
            <p key={insight}>{insight}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: typeof CircleDollarSign; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <Icon className="mb-3 h-5 w-5 text-[var(--accent-text)] dark:text-[var(--accent)]" />
        <p className="text-xs text-slate-500 dark:text-slate-300">{label}</p>
        <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}

function CategoryRow({ item, categoryLabel }: { item: CategoryTotal; categoryLabel: string }) {
  const categoryColor = getCategoryColor(item.category);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 font-medium">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: categoryColor }} />
          {categoryLabel}
        </span>
        <span className="tabular-nums">{money(item.amount)} ({item.percentage.toFixed(0)}%)</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-sky-100 dark:bg-slate-800">
        <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: categoryColor }} />
      </div>
    </div>
  );
}

function ChartEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex h-56 flex-col items-center justify-center rounded-lg border border-dashed border-sky-100 bg-white/70 p-4 text-center dark:border-slate-800 dark:bg-slate-950/60">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-300">{description}</p>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-16 w-56" />
      <Skeleton className="h-24 w-full" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
      <Skeleton className="h-80 w-full" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-52 w-full" />
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-sky-100 pb-2 last:border-0 last:pb-0 dark:border-slate-800">
      <span className="text-sm text-slate-500 dark:text-slate-300">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function DebtSummaryCard({
  title,
  summary,
  labels,
}: {
  title: string;
  summary: { unpaid: number; paid: number; records: number };
  labels: { unpaid: string; paid: string; records: string };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 tabular-nums">
        <DetailRow label={labels.unpaid} value={money(summary.unpaid)} />
        <DetailRow label={labels.paid} value={money(summary.paid)} />
        <DetailRow label={labels.records} value={summary.records.toString()} />
      </CardContent>
    </Card>
  );
}

function buildMonthlyReport(expenses: Expense[], debts: Debt[], selectedMonth: Date, categoryFilter: "all" | ExpenseCategory) {
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const interval = { start: monthStart, end: monthEnd };
  const monthExpenses = expenses.filter((expense) => {
    const matchesMonth = isWithinInterval(parseISO(expense.date), interval);
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    return matchesMonth && matchesCategory;
  });
  const monthDebts = debts.filter((debt) => isDebtInMonth(debt, interval));
  const totalMonthlyExpenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalTransactions = monthExpenses.length;
  const averageDailySpending = totalMonthlyExpenses / getDaysInMonth(selectedMonth);

  const categoryTotals = expenseCategories
    .map((category) => {
      const amount = monthExpenses.filter((expense) => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0);
      return {
        category,
        amount,
        percentage: totalMonthlyExpenses > 0 ? (amount / totalMonthlyExpenses) * 100 : 0,
      };
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const highestSpendingCategory = categoryTotals[0]?.category ?? "";
  const biggestExpense = [...monthExpenses].sort((a, b) => b.amount - a.amount)[0];
  const dailySpending = eachDayOfInterval(interval).map((day) => {
    const key = format(day, "yyyy-MM-dd");
    return {
      day: format(day, "d"),
      amount: monthExpenses.filter((expense) => expense.date === key).reduce((sum, expense) => sum + expense.amount, 0),
    };
  });
  const highestSpendingDay = [...dailySpending].sort((a, b) => b.amount - a.amount)[0];

  const debtSummary = {
    iOwe: summarizeDebts(monthDebts, "i-owe"),
    oweMe: summarizeDebts(monthDebts, "owe-me"),
  };
  const totalDebtRecords = debtSummary.iOwe.records + debtSummary.oweMe.records;
  const debtChartData = [
    { name: "I Owe", unpaid: debtSummary.iOwe.unpaid, paid: debtSummary.iOwe.paid },
    { name: "Owe Me", unpaid: debtSummary.oweMe.unpaid, paid: debtSummary.oweMe.paid },
  ];

  return {
    monthExpenses,
    monthDebts,
    totalMonthlyExpenses,
    totalTransactions,
    averageDailySpending,
    categoryTotals,
    dailySpending,
    highestSpendingDay: highestSpendingDay?.amount ? highestSpendingDay : null,
    highestSpendingCategory,
    biggestExpense,
    debtSummary,
    totalDebtRecords,
    debtChartData,
  };
}

function getMonthComparison(current: number, previous: number, t: ReturnType<typeof useTranslations<"Reports">>) {
  if (!current && !previous) return t("noChange");
  if (!previous) return current ? t("newSpend") : t("noChange");

  const difference = current - previous;
  const percentage = Math.abs((difference / previous) * 100);
  if (!difference) return t("noChange");
  return `${difference > 0 ? "+" : "-"}${percentage.toFixed(0)}%`;
}

function summarizeDebts(debts: Debt[], type: Debt["type"]) {
  const records = debts.filter((debt) => debt.type === type);
  return {
    unpaid: records.filter((debt) => debt.status === "unpaid").reduce((sum, debt) => sum + debt.amount, 0),
    paid: records.filter((debt) => debt.status === "paid").reduce((sum, debt) => sum + debt.amount, 0),
    records: records.length,
  };
}

function isDebtInMonth(debt: Debt, interval: { start: Date; end: Date }) {
  if (debt.dueDate) {
    return isWithinInterval(parseISO(debt.dueDate), interval);
  }

  const createdAt = debt.createdAt && "toDate" in debt.createdAt ? debt.createdAt.toDate() : null;
  return createdAt ? isWithinInterval(createdAt, interval) : false;
}
