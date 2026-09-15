"use client";

import { Building2, Eye, EyeOff, Wallet } from "lucide-react";
import { useState } from "react";
import { useDashboardData } from "@/components/dashboard/useDashboardData";

const formatMoney = (amount: number) =>
  amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function AccountsPage() {
  const [showBalances, setShowBalances] = useState(true);
  const { data, error, loading } = useDashboardData();

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Accounts</h1>
          <p className="text-gray-400 mt-1">
            Your Horizon balance and linked bank accounts.
          </p>
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </div>

        <section className="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Horizon balance</p>
              <div className="flex items-center gap-3 mt-2">
                <h2 className="text-3xl font-bold text-white">
                  {loading
                    ? "Loading..."
                    : showBalances
                      ? `₦${formatMoney(data?.balance ?? 0)}`
                      : "••••••••"}
                </h2>
                <button
                  onClick={() => setShowBalances((visible) => !visible)}
                  className="text-gray-400 hover:text-white"
                  aria-label="Toggle balance visibility"
                >
                  {showBalances ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10">
              <Wallet size={28} className="text-indigo-400" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-4">
            Linked bank accounts
          </h2>

          {loading ? (
            <div className="rounded-2xl bg-gray-800/60 border border-gray-700 p-8 text-gray-400">
              Loading linked accounts...
            </div>
          ) : data?.accounts.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.accounts.map((account) => (
                <article
                  key={account.id}
                  className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-indigo-500/10">
                      <Building2 size={24} className="text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{account.bankName}</h3>
                      <p className="text-gray-500 text-sm mt-1">{account.accountName}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-5 border-t border-gray-700">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Account number
                    </p>
                    <p className="text-gray-200 mt-1">{account.accountNumber}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-700 p-8 text-center">
              <Building2 className="mx-auto text-gray-500" size={28} />
              <p className="mt-3 text-white font-medium">No linked bank accounts</p>
              <p className="mt-1 text-sm text-gray-500">
                Linked accounts will appear here when they are saved to your profile.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
