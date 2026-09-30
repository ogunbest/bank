"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Lightbulb,
  PiggyBank,
  TrendingUp,
} from "lucide-react";

interface AnalyticsTransaction {
  amount: number;
  direction: "in" | "out";
  date: string;
  category?: string;
  title?: string;
}

interface FinancialInsightsProps {
  transactions: AnalyticsTransaction[];
  balance: number;
}

export default function FinancialInsights({
  transactions,
  balance,
}: FinancialInsightsProps) {
  const now = new Date();

  const monthlyTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.date);

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  const income = monthlyTransactions
    .filter((transaction) => transaction.direction === "in")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenses = monthlyTransactions
    .filter((transaction) => transaction.direction === "out")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const net = income - expenses;

  const spendingByCategory = monthlyTransactions
    .filter((transaction) => transaction.direction === "out")
    .reduce<Record<string, number>>((result, transaction) => {
      const category =
        transaction.category?.trim() || "Uncategorised";

      result[category] =
        (result[category] || 0) + transaction.amount;

      return result;
    }, {});

  const categories = Object.entries(spendingByCategory)
    .sort(([, first], [, second]) => second - first)
    .slice(0, 4);

  const topCategory = categories[0];

  const formatMoney = (amount: number) =>
    amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  let coachMessage =
    "Keep tracking your money to build a clearer picture of your finances.";

  if (income === 0 && expenses === 0) {
    coachMessage =
      "Once you make transactions this month, your Money Coach will start giving you personalised spending insights.";
  } else if (expenses > income) {
    coachMessage =
      "Your spending is currently higher than your income this month. Review your recent expenses before making additional large purchases.";
  } else if (topCategory) {
    coachMessage = `Your biggest spending category this month is ${topCategory[0]}, at ₦${formatMoney(topCategory[1])}.`;
  } else if (income > 0) {
    coachMessage =
      "Your income is currently higher than your recorded spending this month. Keep monitoring your expenses.";
  }

  return (
    <section className="space-y-5">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
            <TrendingUp size={19} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Financial Insights
            </h2>

            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Understand where your money is going this month.
            </p>
          </div>
        </div>
      </div>

      {/* MONTHLY SUMMARY */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* INCOME */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Monthly Income
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
              <ArrowDownLeft size={18} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold tracking-tight text-[#0F766E] dark:text-teal-400">
            ₦{formatMoney(income)}
          </p>

          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Money received this month
          </p>
        </div>

        {/* SPENDING */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Monthly Spending
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400">
              <ArrowUpRight size={18} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold tracking-tight text-red-500 dark:text-red-400">
            ₦{formatMoney(expenses)}
          </p>

          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Money spent this month
          </p>
        </div>

        {/* NET */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Net Cash Flow
            </p>

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                net >= 0
                  ? "bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400"
                  : "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400"
              }`}
            >
              <TrendingUp size={18} />
            </div>
          </div>

          <p
            className={`mt-4 text-2xl font-bold tracking-tight ${
              net >= 0
                ? "text-[#0F766E] dark:text-teal-400"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            {net >= 0 ? "+" : "-"}₦
            {formatMoney(Math.abs(net))}
          </p>

          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Income minus spending
          </p>
        </div>
      </div>

      {/* DETAILED INSIGHTS */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* SPENDING BREAKDOWN */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400">
              <ArrowUpRight size={19} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Spending Breakdown
              </h3>

              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                Your top spending categories this month
              </p>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                No spending transactions yet
              </p>

              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Your spending breakdown will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {categories.map(([category, amount]) => {
                const percentage =
                  expenses > 0
                    ? Math.min((amount / expenses) * 100, 100)
                    : 0;

                return (
                  <div key={category}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                        {category}
                      </span>

                      <span className="whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
                        ₦{formatMoney(amount)}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-[#0F766E] transition-all dark:bg-teal-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-right text-[11px] text-slate-400 dark:text-slate-500">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MONEY COACH */}
        <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-5 shadow-sm dark:border-teal-900/50 dark:from-teal-950/40 dark:to-slate-900 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm dark:bg-slate-800 dark:text-teal-400">
              <Lightbulb size={19} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Money Coach
              </h3>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Your financial snapshot
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-teal-100 bg-white/80 p-4 dark:border-teal-900/50 dark:bg-slate-800/80">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {coachMessage}
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
                <PiggyBank size={19} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  Current balance
                </p>

                <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
                  ₦{formatMoney(balance)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}