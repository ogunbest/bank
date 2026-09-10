
"use client";

import FundAccount from "@/components/dashboard/FundAccount";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Send,
  Wallet,
} from "lucide-react";

import Header from "@/components/common/Header";

export default function DashboardPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">

        {/* WELCOME */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Welcome back
          </h1>

          <p className="text-gray-400 mt-1">
            Here&apos;s what&apos;s happening with your accounts today.
          </p>
        </div>

        {/* BALANCE + QUICK ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* TOTAL BALANCE */}
          <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 shadow-xl">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-indigo-100 text-sm">
                  Total Balance
                </p>

                <h2 className="text-4xl font-bold text-white mt-2">
                  ₦1,250,450.00
                </h2>

                <p className="text-indigo-200 text-sm mt-3">
                  Available balance
                </p>
              </div>

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

              <button className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-700/70 p-4 hover:bg-gray-700 transition">
                <Send
                  size={20}
                  className="text-indigo-400"
                />

                <span className="text-sm text-gray-200">
                  Transfer
                </span>
              </button>

              <button className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-700/70 p-4 hover:bg-gray-700 transition">
                <CreditCard
                  size={20}
                  className="text-purple-400"
                />

                <span className="text-sm text-gray-200">
                  Pay Bills
                </span>
              </button>

              <button className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-700/70 p-4 hover:bg-gray-700 transition">
                <ArrowDownLeft
                  size={20}
                  className="text-green-400"
                />

                <span className="text-sm text-gray-200">
                  Receive
                </span>
              </button>

              <button className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-700/70 p-4 hover:bg-gray-700 transition">
                <ArrowUpRight
                  size={20}
                  className="text-red-400"
                />

                <span className="text-sm text-gray-200">
                  Send
                </span>
              </button>

            </div>
          </div>
        </div>

        {/* FUND ACCOUNT */}
        <div className="mb-8">
          <FundAccount />
        </div>

        {/* ACCOUNT SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="rounded-2xl bg-gray-800/70 border border-gray-700 p-5">
            <p className="text-gray-400 text-sm">
              Money In
            </p>

            <p className="text-2xl font-semibold text-green-400 mt-2">
              +₦450,000
            </p>

            <p className="text-gray-500 text-xs mt-2">
              This month
            </p>
          </div>

          <div className="rounded-2xl bg-gray-800/70 border border-gray-700 p-5">
            <p className="text-gray-400 text-sm">
              Money Out
            </p>

            <p className="text-2xl font-semibold text-red-400 mt-2">
              -₦125,500
            </p>

            <p className="text-gray-500 text-xs mt-2">
              This month
            </p>
          </div>

          <div className="rounded-2xl bg-gray-800/70 border border-gray-700 p-5">
            <p className="text-gray-400 text-sm">
              Savings
            </p>

            <p className="text-2xl font-semibold text-indigo-400 mt-2">
              ₦875,000
            </p>

            <p className="text-gray-500 text-xs mt-2">
              Current savings
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

            <button className="text-sm text-indigo-400 hover:text-indigo-300">
              View all
            </button>

          </div>

          <div className="divide-y divide-gray-700">

            <Transaction
              title="Salary"
              date="Today, 09:42 AM"
              amount="+₦300,000"
              positive
            />

            <Transaction
              title="Electricity Bill"
              date="Yesterday, 04:15 PM"
              amount="-₦35,000"
            />

            <Transaction
              title="Transfer to John"
              date="Yesterday, 12:30 PM"
              amount="-₦50,000"
            />

            <Transaction
              title="Account Deposit"
              date="Sep 6, 2026"
              amount="+₦150,000"
              positive
            />

          </div>
        </div>

      </main>
    </div>
  );
}

interface TransactionProps {
  title: string;
  date: string;
  amount: string;
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
        {amount}
      </p>

    </div>
  );
}