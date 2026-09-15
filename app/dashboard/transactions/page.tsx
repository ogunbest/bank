"use client";

import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";
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

export default function TransactionsPage() {
  const { data, error, loading } = useDashboardData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const transactions = useMemo(
    () =>
      (data?.transactions ?? []).filter((transaction) => {
        const searchable = `${transaction.title} ${transaction.type} ${transaction.reference}`
          .toLowerCase()
          .includes(search.trim().toLowerCase());
        const matchesFilter =
          filter === "all" ||
          (filter === "incoming" && transaction.direction === "in") ||
          (filter === "outgoing" && transaction.direction === "out");

        return searchable && matchesFilter;
      }),
    [data?.transactions, filter, search],
  );

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Transactions</h1>
          <p className="text-gray-400 mt-1">Activity recorded for your account.</p>
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <label className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transactions..."
              className="w-full bg-gray-800/60 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
            />
          </label>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 outline-none"
          >
            <option value="all">All transactions</option>
            <option value="incoming">Money in</option>
            <option value="outgoing">Money out</option>
          </select>
        </div>

        <section className="bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-700 text-xs uppercase text-gray-500">
            <div className="col-span-4">Transaction</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>

          {loading ? (
            <p className="px-6 py-8 text-center text-gray-400">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="px-6 py-8 text-center text-gray-400">
              No matching transactions yet.
            </p>
          ) : (
            transactions.map((transaction) => {
              const incoming = transaction.direction === "in";
              const successful = transaction.status.toLowerCase() === "success";

              return (
                <article
                  key={transaction.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/30"
                >
                  <div className="md:col-span-4 flex items-center gap-3">
                    <div className={`p-2 rounded-full ${incoming ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                      {incoming ? (
                        <ArrowDownLeft size={18} className="text-emerald-400" />
                      ) : (
                        <ArrowUpRight size={18} className="text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.title}</p>
                      <p className="text-gray-500 text-sm">Ref: {transaction.reference}</p>
                    </div>
                  </div>
                  <p className="md:col-span-2 flex items-center text-gray-400 capitalize">{transaction.type}</p>
                  <p className="md:col-span-2 flex items-center text-gray-400">{formatDate(transaction.date)}</p>
                  <div className="md:col-span-2 flex items-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs ${successful ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                      {transaction.status}
                    </span>
                  </div>
                  <p className={`md:col-span-2 flex items-center md:justify-end font-semibold ${incoming ? "text-emerald-400" : "text-red-400"}`}>
                    {incoming ? "+" : "-"}₦{formatMoney(transaction.amount)}
                  </p>
                </article>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}
