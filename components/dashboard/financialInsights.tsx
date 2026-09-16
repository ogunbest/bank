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

  let coachMessage = "Keep tracking your money to build a clearer picture of your finances.";

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
    <section className="mb-8">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">
          Financial Insights
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Understand where your money is going this month.
        </p>
      </div>

      {/* MONTHLY SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div className="rounded-2xl bg-gray-800/70 border border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Monthly Income
            </p>

            <div className="h-9 w-9 rounded-full bg-green-500/10 flex items-center justify-center">
              <ArrowDownLeft
                size={18}
                className="text-green-400"
              />
            </div>
          </div>

          <p className="text-2xl font-semibold text-green-400 mt-4">
            ₦{formatMoney(income)}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Money received this month
          </p>
        </div>

        <div className="rounded-2xl bg-gray-800/70 border border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Monthly Spending
            </p>

            <div className="h-9 w-9 rounded-full bg-red-500/10 flex items-center justify-center">
              <ArrowUpRight
                size={18}
                className="text-red-400"
              />
            </div>
          </div>

          <p className="text-2xl font-semibold text-red-400 mt-4">
            ₦{formatMoney(expenses)}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Money spent this month
          </p>
        </div>

        <div className="rounded-2xl bg-gray-800/70 border border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Net Cash Flow
            </p>

            <div className="h-9 w-9 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <TrendingUp
                size={18}
                className="text-indigo-400"
              />
            </div>
          </div>

          <p
            className={`text-2xl font-semibold mt-4 ${
              net >= 0
                ? "text-indigo-400"
                : "text-red-400"
            }`}
          >
            {net >= 0 ? "+" : "-"}₦
            {formatMoney(Math.abs(net))}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Income minus spending
          </p>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* SPENDING */}
        <div className="rounded-2xl bg-gray-800/70 border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <ArrowUpRight
                size={20}
                className="text-red-400"
              />
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Spending Breakdown
              </h3>

              <p className="text-xs text-gray-500">
                This month
              </p>
            </div>
          </div>

          {categories.length === 0 ? (
            <p className="text-sm text-gray-400">
              No spending transactions recorded this month.
            </p>
          ) : (
            <div className="space-y-4">
              {categories.map(([category, amount]) => {
                const percentage =
                  expenses > 0
                    ? Math.min(
                        (amount / expenses) * 100,
                        100
                      )
                    : 0;

                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">
                        {category}
                      </span>

                      <span className="text-sm text-white">
                        ₦{formatMoney(amount)}
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MONEY COACH */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <Lightbulb
                size={20}
                className="text-indigo-400"
              />
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Money Coach
              </h3>

              <p className="text-xs text-gray-400">
                Your financial snapshot
              </p>
            </div>
          </div>

          <p className="text-gray-300 leading-7">
            {coachMessage}
          </p>

          <div className="mt-6 rounded-xl bg-gray-900/50 border border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <PiggyBank
                size={20}
                className="text-indigo-400"
              />

              <div>
                <p className="text-xs text-gray-500">
                  Current balance
                </p>

                <p className="text-lg font-semibold text-white">
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