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

const categoryOpacity = [1, 0.82, 0.68, 0.54, 0.42, 0.32, 0.24, 0.18];

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
  const { expenses, debts, error, loading } = useData();
  const [selectedMonth, setSelectedMonth] = useState(() => startOfMonth(new Date()));
  const [categoryFilter, setCategoryFilter] = useState<"all" | ExpenseCategory>("all");

  const report = useMemo(() => buildMonthlyReport(expenses, debts, selectedMonth, categoryFilter), [categoryFilter, debts, expenses, selectedMonth]);
  const previousReport = useMemo(
    () => buildMonthlyReport(expenses, debts, addMonths(selectedMonth, -1), categoryFilter),
    [categoryFilter, debts, expenses, selectedMonth],
  );
  const comparison = getMonthComparison(report.totalMonthlyExpenses, previousReport.totalMonthlyExpenses);

  if (loading) {
    return <ReportSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-start gap-3 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
          <div>
            <p className="font-semibold">Unable to load report.</p>
            <p className="text-sm text-slate-500 dark:text-slate-300">Please try again later.</p>
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
          <h1 className="text-2xl font-semibold">Monthly Report</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">Expenses and debts for the selected month.</p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent-text)] dark:bg-[var(--accent-muted)] dark:text-[var(--accent)]">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-300">Selected Month</p>
              <p className="text-lg font-semibold">{format(selectedMonth, "MMMM yyyy")}</p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_1.15fr]">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedMonth((month) => addMonths(month, -1))}>
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedMonth(startOfMonth(new Date()))}>
                Current
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedMonth((month) => addMonths(month, 1))}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-sky-100 bg-white/80 px-2 dark:border-slate-800 dark:bg-slate-950/60">
              <Filter className="h-4 w-4 text-[var(--accent-text)] dark:text-[var(--accent)]" />
              <Select
                aria-label="Filter report category"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value as "all" | ExpenseCategory)}
                className="border-0 bg-transparent px-0 focus:ring-0"
              >
                <option value="all">All categories</option>
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {!hasReportData ? (
        <EmptyState title="No expenses found for this month." description="Start tracking your expenses to view monthly reports." />
      ) : null}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <SummaryCard icon={CircleDollarSign} label="Total Expenses" value={money(report.totalMonthlyExpenses)} />
        <SummaryCard icon={ListChecks} label="Transactions" value={report.totalTransactions.toString()} />
        <SummaryCard icon={ReceiptText} label="Average Daily" value={money(report.averageDailySpending)} />
        <SummaryCard icon={Trophy} label="Top Category" value={report.highestSpendingCategory || "None"} />
        <SummaryCard icon={CalendarDays} label="Highest Day" value={report.highestSpendingDay ? money(report.highestSpendingDay.amount) : "None"} />
        <SummaryCard icon={TrendingUp} label="Vs Previous" value={comparison} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Grouped spending with percentage share.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.categoryTotals.length ? (
              <>
                <div className="report-chart h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={report.categoryTotals} dataKey="amount" nameKey="category" innerRadius={48} outerRadius={78} paddingAngle={2}>
                        {report.categoryTotals.map((entry, index) => (
                          <Cell
                            key={entry.category}
                            fill="var(--accent)"
                            fillOpacity={categoryOpacity[index % categoryOpacity.length]}
                            stroke="var(--chart-tooltip-bg)"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => money(Number(value))}
                        contentStyle={tooltipStyle}
                        labelStyle={tooltipLabelStyle}
                        itemStyle={{ color: "var(--foreground)" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {report.categoryTotals.map((item) => (
                    <CategoryRow key={item.category} item={item} index={report.categoryTotals.indexOf(item)} />
                  ))}
                </div>
              </>
            ) : (
              <p className="rounded-lg border border-dashed border-sky-100 bg-white/70 p-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
                No expenses found for this month.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Biggest Expense</CardTitle>
            <CardDescription>Largest expense recorded this month.</CardDescription>
          </CardHeader>
          <CardContent>
            {report.biggestExpense ? (
              <div className="space-y-3 tabular-nums">
                <DetailRow label="Amount" value={money(report.biggestExpense.amount)} />
                <DetailRow label="Category" value={report.biggestExpense.category} />
                <DetailRow label="Date" value={prettyDate(report.biggestExpense.date)} />
                <DetailRow label="Description" value={report.biggestExpense.description || "No description"} />
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300">No expenses found for this month.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Daily Spending</CardTitle>
          <CardDescription>Bar chart of each day in {format(selectedMonth, "MMMM yyyy")}.</CardDescription>
        </CardHeader>
        <CardContent>
          {report.totalMonthlyExpenses > 0 ? (
            <div className="report-chart h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.dailySpending} margin={{ left: -16, right: 4, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="var(--chart-text)" tick={{ fill: "var(--chart-text)" }} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--chart-text)" tick={{ fill: "var(--chart-text)" }} tickFormatter={(value) => `RM${value}`} />
                  <Tooltip
                    formatter={(value) => money(Number(value))}
                    labelFormatter={(label) => `${label} ${format(selectedMonth, "MMM yyyy")}`}
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
            <ChartEmptyState title="No daily spending" description="Add expenses this month to show the daily spending chart." />
          )}
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <DebtSummaryCard title="I Owe" summary={report.debtSummary.iOwe} />
        <DebtSummaryCard title="Owe Me" summary={report.debtSummary.oweMe} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Debt Status Chart</CardTitle>
          <CardDescription>Paid and unpaid debt amounts for the selected month.</CardDescription>
        </CardHeader>
        <CardContent>
          {report.totalDebtRecords > 0 ? (
            <div className="report-chart h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.debtChartData} margin={{ left: -16, right: 4, top: 8, bottom: 0 }}>
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
                  <Bar dataKey="unpaid" name="Unpaid" fill="var(--accent)" background={false} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="paid" name="Paid" fill="var(--accent-hover)" fillOpacity={0.55} background={false} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <ChartEmptyState title="No debt records" description="Add debts this month to show the debt status chart." />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Insight</CardTitle>
          <CardDescription>Simple summary for the selected month.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 rounded-b-lg bg-[var(--accent-soft)] p-4 text-sm leading-6 text-slate-700 dark:bg-[var(--accent-muted)] dark:text-slate-100">
          {report.englishInsights.map((insight) => (
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

function CategoryRow({ item, index }: { item: CategoryTotal; index: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 font-medium">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" style={{ opacity: categoryOpacity[index % categoryOpacity.length] }} />
          {item.category}
        </span>
        <span className="tabular-nums">{money(item.amount)} ({item.percentage.toFixed(0)}%)</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-sky-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${item.percentage}%` }} />
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
}: {
  title: string;
  summary: { unpaid: number; paid: number; records: number };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 tabular-nums">
        <DetailRow label="Unpaid Amount" value={money(summary.unpaid)} />
        <DetailRow label="Paid Amount" value={money(summary.paid)} />
        <DetailRow label="Records" value={summary.records.toString()} />
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

  const englishInsights = [
    highestSpendingCategory
      ? `You spent the most on ${highestSpendingCategory} this month.`
      : "No spending category stands out this month.",
    `Your average daily spending is ${money(averageDailySpending)}.`,
    biggestExpense
      ? `Your largest expense was ${money(biggestExpense.amount)} under ${biggestExpense.category}.`
      : "No largest expense is available for this month.",
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
    englishInsights,
  };
}

function getMonthComparison(current: number, previous: number) {
  if (!current && !previous) return "No change";
  if (!previous) return current ? "New spend" : "No change";

  const difference = current - previous;
  const percentage = Math.abs((difference / previous) * 100);
  if (!difference) return "No change";
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
