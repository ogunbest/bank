"use client";

import {
  ArrowDownLeft,
  CheckCircle2,
  Clock3,
  Wallet,
} from "lucide-react";
import { useDashboardData } from "@/components/dashboard/useDashboardData";

const formatMoney = (amount: number) =>
  amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function WithdrawalsPage() {
  const { data, loading, error } = useDashboardData();

  const balance = data?.balance ?? 0;

  const withdrawals = (data?.transactions ?? []).filter(
    (transaction) =>
      transaction.direction === "out" &&
      transaction.type?.toLowerCase().includes("withdraw"),
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-[#0F766E] dark:text-teal-400">
            Banking
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            Withdrawals
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Move money from your Covenant account to a linked bank account.
          </p>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Balance + withdrawal status */}
        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-[#0F766E] p-6 text-white shadow-sm dark:bg-teal-700">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <Wallet size={22} />
              </div>

              <div>
                <p className="text-sm text-teal-100">
                  Available balance
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {loading
                    ? "Loading..."
                    : `₦${formatMoney(balance)}`}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Withdrawal service
                </p>

                <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                  Available soon
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Withdrawal form placeholder */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
              <ArrowDownLeft size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Withdraw money
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Withdrawal processing will be connected to your linked bank
                account once the withdrawal service is enabled.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 dark:text-slate-400">
                  ₦
                </span>

                <input
                  disabled
                  placeholder="0.00"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-9 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Destination account
              </label>

              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
                No withdrawal account selected
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="mt-5 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white opacity-50 dark:bg-slate-700"
          >
            Withdrawal unavailable
          </button>
        </section>

        {/* History */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-white">
              Withdrawal history
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your recent withdrawal activity.
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              Loading withdrawal history...
            </div>
          ) : withdrawals.length > 0 ? (
            withdrawals.slice(0, 10).map((transaction) => (
              <article
                key={transaction.id}
                className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400">
                    <ArrowDownLeft size={19} />
                  </div>

                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {transaction.title}
                    </p>

                    <p className="mt-1 text-sm capitalize text-slate-500 dark:text-slate-400">
                      {transaction.status}
                    </p>
                  </div>
                </div>

                <p className="font-semibold text-red-500 dark:text-red-400">
                  -₦{formatMoney(transaction.amount)}
                </p>
              </article>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <Clock3 size={21} />
              </div>

              <p className="mt-4 font-medium text-slate-700 dark:text-slate-300">
                No withdrawals yet
              </p>

              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                Your withdrawal transactions will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}