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
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-8 text-[#0F172A] lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-[#0F766E]">
            Banking
          </p>

          <h1 className="mt-1 text-2xl font-bold">
            Withdrawals
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Move money from your Covenant account to a linked bank account.
          </p>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Balance + withdrawal status */}
        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-[#0F766E] p-6 text-white shadow-sm">
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

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Withdrawal service
                </p>

                <p className="mt-1 font-semibold text-[#0F172A]">
                  Available soon
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Withdrawal form placeholder */}
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
              <ArrowDownLeft size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Withdraw money
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Withdrawal processing will be connected to your linked bank
                account once the withdrawal service is enabled.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  ₦
                </span>

                <input
                  disabled
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-9 pr-4 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Destination account
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-400">
                No withdrawal account selected
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="mt-5 rounded-xl bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white opacity-50"
          >
            Withdrawal unavailable
          </button>
        </section>

        {/* History */}
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/70">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-bold">
              Withdrawal history
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your recent withdrawal activity.
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              Loading withdrawal history...
            </div>
          ) : withdrawals.length > 0 ? (
            withdrawals.slice(0, 10).map((transaction) => (
              <article
                key={transaction.id}
                className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <ArrowDownLeft size={19} />
                  </div>

                  <div>
                    <p className="font-medium">
                      {transaction.title}
                    </p>

                    <p className="mt-1 text-sm capitalize text-slate-500">
                      {transaction.status}
                    </p>
                  </div>
                </div>

                <p className="font-semibold text-slate-900">
                  -₦{formatMoney(transaction.amount)}
                </p>
              </article>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Clock3 size={21} />
              </div>

              <p className="mt-4 font-medium text-slate-700">
                No withdrawals yet
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Your withdrawal transactions will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}