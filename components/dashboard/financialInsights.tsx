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
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
            <TrendingUp size={19} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Financial Insights
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Understand where your money is going this month.
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Income */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Monthly Income
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
              <ArrowDownLeft size={18} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold tracking-tight text-[#0F766E]">
            ₦{formatMoney(income)}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Money received this month
          </p>
        </div>

        {/* Spending */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Monthly Spending
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <ArrowUpRight size={18} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold tracking-tight text-red-500">
            ₦{formatMoney(expenses)}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Money spent this month
          </p>
        </div>

        {/* Net */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Net Cash Flow
            </p>

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                net >= 0
                  ? "bg-teal-50 text-[#0F766E]"
                  : "bg-red-50 text-red-500"
              }`}
            >
              <TrendingUp size={18} />
            </div>
          </div>

          <p
            className={`mt-4 text-2xl font-bold tracking-tight ${
              net >= 0
                ? "text-[#0F766E]"
                : "text-red-500"
            }`}
          >
            {net >= 0 ? "+" : "-"}₦
            {formatMoney(Math.abs(net))}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Income minus spending
          </p>
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Spending Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <ArrowUpRight size={19} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Spending Breakdown
              </h3>

              <p className="mt-0.5 text-xs text-slate-400">
                Your top spending categories this month
              </p>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
              <p className="text-sm font-medium text-slate-600">
                No spending transactions yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Your spending breakdown will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {categories.map(([category, amount]) => {
                const percentage =
                  expenses > 0
                    ? Math.min(
                        (amount / expenses) * 100,
                        100,
                      )
                    : 0;

                return (
                  <div key={category}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="truncate text-sm font-medium text-slate-700">
                        {category}
                      </span>

                      <span className="whitespace-nowrap text-sm font-semibold text-slate-900">
                        ₦{formatMoney(amount)}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#0F766E] transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-right text-[11px] text-slate-400">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Money Coach */}
        <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm">
              <Lightbulb size={19} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Money Coach
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                Your financial snapshot
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-teal-100 bg-white/80 p-4">
            <p className="text-sm leading-6 text-slate-600">
              {coachMessage}
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                <PiggyBank size={19} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Current balance
                </p>

                <p className="mt-0.5 text-lg font-bold text-slate-900">
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