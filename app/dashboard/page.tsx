"use client";
import { motion } from "framer-motion";
import SavingsGoals from "@/components/dashboard/savingsGoals";
import FinancialInsights from "@/components/dashboard/financialInsights";
import FundAccount from "@/components/dashboard/FundAccount";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import Link from "next/link";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Send,
  Wallet,
} from "lucide-react";

import Header from "@/components/common/Header";

interface DashboardTransaction {
  id: string;
  title: string;
  type: string;
  direction: "in" | "out";
  amount: number;
  status: string;
  reference: string;
  date: string;
  category?: string;
}

export default function DashboardPage() {
  const {
  data,
  error,
  loading,
  refreshDashboard,
} = useDashboardData();
  const balance = data?.balance ?? 0;
  const transactions: DashboardTransaction[] = data?.transactions ?? [];

  const formatMoney = (amount: number) =>
    amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">

        {/* WELCOME */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Welcome back{data?.user.name ? `, ${data.user.name.split(" ")[0]}` : ""}
          </h1>

          <p className="text-gray-400 mt-1">
            Here's what's happening with your accounts today.
          </p>

          {error && (
            <p className="mt-3 text-sm text-red-300">{error}</p>
          )}
        </div>

        {/* BALANCE + QUICK ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* TOTAL BALANCE */}
          <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <motion.div
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}>
                <p className="text-indigo-100 text-sm">
                  Total Balance
                </p>

                <h2 className="text-4xl font-bold text-white mt-2">
                  {loading
                    ? "Loading..."
                    : `₦${formatMoney(balance)}`}
                </h2>

                <p className="text-indigo-200 text-sm mt-3">
                  Available balance
                </p>
              </motion.div>

              <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center">
                <Wallet
                  className="text-white"
                  size={28}
                />
              </div>

            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="rounded-2xl bg-gray-800/70 border border-gray-700 p-6">

            <h3 className="text-white font-semibold mb-5">
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-3">

              <Link
                href="/dashboard/transfers"
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-700/70 p-4 hover:bg-gray-700 transition"
              >
                <Send
                  size={20}
                  className="text-indigo-400"
                />

                <span className="text-sm text-gray-200">
                  Transfer
                </span>
              </Link>

              <Link
                href="/dashboard/accounts"
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-700/70 p-4 hover:bg-gray-700 transition"
              >
                <CreditCard
                  size={20}
                  className="text-purple-400"
                />

                <span className="text-sm text-gray-200">
                  Accounts
                </span>
              </Link>

              <a
                href="#fund-account"
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-700/70 p-4 hover:bg-gray-700 transition"
              >
                <ArrowDownLeft
                  size={20}
                  className="text-green-400"
                />

                <span className="text-sm text-gray-200">
                  Fund account
                </span>
              </a>

              <Link
                href="/dashboard/transactions"
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-700/70 p-4 hover:bg-gray-700 transition"
              >
                <ArrowUpRight
                  size={20}
                  className="text-red-400"
                />

                <span className="text-sm text-gray-200">
                  Transactions
                </span>
              </Link>

            </div>
          </div>
        </div>

        {/* FUND ACCOUNT */}
<div id="fund-account" className="mb-8">
  <FundAccount />
</div>

{/* FINANCIAL INSIGHTS */}
<FinancialInsights
  transactions={transactions}
  balance={balance}
/>

{/* SAVINGS GOALS */}
<div className="mt-8">
  <SavingsGoals onBalanceChange={refreshDashboard} />
</div>  {/* ACCOUNT SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="rounded-2xl bg-gray-800/70 border border-gray-700 p-5">
            <p className="text-gray-400 text-sm">
              Money In
            </p>

            <p className="text-2xl font-semibold text-green-400 mt-2">
              ₦
              {formatMoney(
                transactions
                  .filter(
                    (transaction) =>
                      transaction.direction === "in"
                  )
                  .reduce(
                    (total, transaction) =>
                      total + transaction.amount,
                    0
                  )
              )}
            </p>

            <p className="text-gray-500 text-xs mt-2">
              Total deposits
            </p>
          </div>

          <div className="rounded-2xl bg-gray-800/70 border border-gray-700 p-5">
            <p className="text-gray-400 text-sm">
              Money Out
            </p>

            <p className="text-2xl font-semibold text-red-400 mt-2">
              ₦
              {formatMoney(
                transactions
                  .filter(
                    (transaction) =>
                      transaction.direction === "out"
                  )
                  .reduce(
                    (total, transaction) =>
                      total + transaction.amount,
                    0
                  )
              )}
            </p>

            <p className="text-gray-500 text-xs mt-2">
              Total withdrawals
            </p>
          </div>

          <div className="rounded-2xl bg-gray-800/70 border border-gray-700 p-5">
            <p className="text-gray-400 text-sm">
              Savings
            </p>

            <p className="text-2xl font-semibold text-indigo-400 mt-2">
              ₦
              {formatMoney(balance)}
            </p>

            <p className="text-gray-500 text-xs mt-2">
              Current balance
            </p>
          </div>

        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="rounded-2xl bg-gray-800/70 border border-gray-700">

          <div className="flex items-center justify-between p-6 border-b border-gray-700">

            <div>
              <h2 className="text-lg font-semibold text-white">
                Recent Transactions
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Your latest account activity
              </p>
            </div>

            <Link
              href="/dashboard/transactions"
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              View all
            </Link>

          </div>

          <div className="divide-y divide-gray-700">

            {loading ? (
              <div className="px-6 py-8 text-center text-gray-400">
                Loading transactions...
              </div>
            ) : transactions.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400">
                No transactions yet.
              </div>
            ) : (
              transactions
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() -
                    new Date(a.date).getTime()
                )
                .slice(0, 5)
                .map((transaction) => (
                  <Transaction
                    key={transaction.id}
                    title={transaction.title}
                    date={new Date(
                      transaction.date
                    ).toLocaleString("en-NG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    amount={transaction.amount}
                    positive={
                      transaction.direction === "in"
                    }
                  />
                ))
            )}

          </div>
        </div>

      </main>
    </div>
  );
}

interface TransactionProps {
  title: string;
  date: string;
  amount: number;
  positive?: boolean;
}

function Transaction({
  title,
  date,
  amount,
  positive = false,
}: TransactionProps) {
  return (
    <div className="flex items-center justify-between px-6 py-5">

      <div className="flex items-center gap-4">

        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center ${
            positive
              ? "bg-green-500/10"
              : "bg-red-500/10"
          }`}
        >
          {positive ? (
            <ArrowDownLeft
              size={18}
              className="text-green-400"
            />
          ) : (
            <ArrowUpRight
              size={18}
              className="text-red-400"
            />
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-white">
            {title}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {date}
          </p>
        </div>

      </div>

      <p
        className={`font-semibold ${
          positive
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        {positive ? "+" : "-"}₦
        {formatTransactionAmount(amount)}
      </p>

    </div>
  );
}

function formatTransactionAmount(
  amount: number
) {
  return amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
