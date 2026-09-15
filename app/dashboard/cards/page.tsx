"use client";

import { CreditCard, Wallet } from "lucide-react";
import { useDashboardData } from "@/components/dashboard/useDashboardData";

const formatMoney = (amount: number) =>
  amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString("en-NG", { dateStyle: "medium" });
};

export default function CardsPage() {
  const { data, error, loading } = useDashboardData();

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Cards</h1>
          <p className="text-gray-400 mt-1">Your issued payment cards.</p>
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 rounded-2xl border border-dashed border-gray-700 bg-gray-800/60 p-8 text-center">
            <CreditCard className="mx-auto text-gray-500" size={32} />
            <h2 className="mt-4 text-white font-semibold">No issued cards</h2>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              This app does not yet store or issue card records, so card numbers, expiry dates, and card controls are not shown as sample data.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-700 bg-gray-800/60 p-6">
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-xl bg-indigo-500/10">
                <Wallet className="text-indigo-400" size={22} />
              </span>
              <div>
                <p className="text-gray-400 text-sm">Available balance</p>
                <p className="text-white text-xl font-semibold mt-1">
                  {loading ? "Loading..." : `₦${formatMoney(data?.balance ?? 0)}`}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Recent account activity</h2>
            <p className="text-gray-500 text-sm mt-1">Transactions recorded for your account.</p>
          </div>
          {loading ? (
            <p className="px-6 py-8 text-center text-gray-400">Loading activity...</p>
          ) : data?.transactions.length ? (
            data.transactions.slice(0, 5).map((transaction) => (
              <article
                key={transaction.id}
                className="flex items-center justify-between gap-6 px-6 py-5 border-b border-gray-700 last:border-b-0"
              >
                <div>
                  <p className="text-white font-medium">{transaction.title}</p>
                  <p className="text-gray-500 text-sm">{formatDate(transaction.date)}</p>
                </div>
                <p className={transaction.direction === "in" ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                  {transaction.direction === "in" ? "+" : "-"}₦{formatMoney(transaction.amount)}
                </p>
              </article>
            ))
          ) : (
            <p className="px-6 py-8 text-center text-gray-400">No activity has been recorded.</p>
          )}
        </section>
      </main>
    </div>
  );
}
