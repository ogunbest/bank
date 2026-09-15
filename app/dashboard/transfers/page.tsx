"use client";

import { ArrowUpRight, Search, Send } from "lucide-react";
import { useMemo, useState } from "react";
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
    : date.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
};

export default function TransfersPage() {
  const { data, error, loading } = useDashboardData();
  const [search, setSearch] = useState("");

  const transfers = useMemo(
    () =>
      (data?.transactions ?? []).filter(
        (transaction) =>
          transaction.direction === "out" &&
          `${transaction.title} ${transaction.reference}`
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
      ),
    [data?.transactions, search],
  );

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Transfers</h1>
          <p className="text-gray-400 mt-1">
            Outgoing transfer records from your account.
          </p>
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5 mb-6 flex gap-3">
          <Send className="shrink-0 text-indigo-300" size={20} />
          <p className="text-sm text-indigo-100">
            This page now shows only recorded transfers. It does not display sample recipients or amounts.
          </p>
        </div>

        <label className="relative block mb-6 max-w-xl">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search transfers..."
            className="w-full bg-gray-800/60 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
          />
        </label>

        <section className="bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-700 text-xs uppercase text-gray-500">
            <div className="col-span-4">Transfer</div>
            <div className="col-span-3">Reference</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>

          {loading ? (
            <p className="px-6 py-8 text-center text-gray-400">Loading transfers...</p>
          ) : transfers.length === 0 ? (
            <p className="px-6 py-8 text-center text-gray-400">
              No outgoing transfers have been recorded.
            </p>
          ) : (
            transfers.map((transfer) => (
              <article
                key={transfer.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/30"
              >
                <div className="md:col-span-4 flex items-center gap-3">
                  <span className="p-2 rounded-full bg-red-500/10">
                    <ArrowUpRight size={18} className="text-red-400" />
                  </span>
                  <p className="text-white font-medium">{transfer.title}</p>
                </div>
                <p className="md:col-span-3 flex items-center text-gray-400 break-all">{transfer.reference}</p>
                <p className="md:col-span-2 flex items-center text-gray-400">{formatDate(transfer.date)}</p>
                <p className="md:col-span-1 flex items-center capitalize text-gray-300">{transfer.status}</p>
                <p className="md:col-span-2 flex items-center md:justify-end font-semibold text-red-400">
                  -₦{formatMoney(transfer.amount)}
                </p>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
