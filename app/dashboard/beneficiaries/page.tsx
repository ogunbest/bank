"use client";

import { Send, UserRound, Users } from "lucide-react";
import { useDashboardData } from "@/components/dashboard/useDashboardData";

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString("en-NG", { dateStyle: "medium" });
};

export default function BeneficiariesPage() {
  const { data, error, loading } = useDashboardData();
  const outgoingTransactions = (data?.transactions ?? []).filter(
    (transaction) => transaction.direction === "out",
  );

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Beneficiaries</h1>
          <p className="text-gray-400 mt-1">Saved transfer recipients.</p>
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </div>

        <section className="rounded-2xl border border-dashed border-gray-700 bg-gray-800/60 p-8 text-center">
          <Users className="mx-auto text-gray-500" size={32} />
          <h2 className="mt-4 text-white font-semibold">No saved beneficiaries</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
            Beneficiary storage is not configured in the current database, so this page no longer shows placeholder people or account numbers.
          </p>
        </section>

        <section className="mt-8 bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Recent outgoing activity</h2>
            <p className="text-gray-500 text-sm mt-1">Recorded transfers you have sent.</p>
          </div>

          {loading ? (
            <p className="px-6 py-8 text-center text-gray-400">Loading transfer activity...</p>
          ) : outgoingTransactions.length ? (
            outgoingTransactions.slice(0, 5).map((transaction) => (
              <article
                key={transaction.id}
                className="flex items-center gap-4 px-6 py-5 border-b border-gray-700 last:border-b-0"
              >
                <span className="p-3 rounded-full bg-indigo-500/10">
                  <UserRound className="text-indigo-400" size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{transaction.title}</p>
                  <p className="text-gray-500 text-sm">{formatDate(transaction.date)}</p>
                </div>
                <Send className="ml-auto text-gray-500" size={18} />
              </article>
            ))
          ) : (
            <p className="px-6 py-8 text-center text-gray-400">No outgoing transfers have been recorded.</p>
          )}
        </section>
      </main>
    </div>
  );
}
