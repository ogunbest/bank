"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  LockKeyhole,
  Wallet,
} from "lucide-react";
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
    : date.toLocaleDateString("en-NG", {
        dateStyle: "medium",
      });
};

export default function CardsPage() {
  const { data, error, loading } = useDashboardData();

  return (
    <div className="space-y-7">
      {/* Header */}
      <section>
        <p className="text-sm font-medium text-[#0F766E]">Payments</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Cards
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your Covenant cards and card activity.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </section>

      {/* Card overview */}
      <section className="grid gap-5 lg:grid-cols-3">
        {/* Card preview */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Primary card</p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Covenant Card
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
              <CreditCard size={22} />
            </div>
          </div>

          {/* Card */}
          <div className="relative mt-7 overflow-hidden rounded-3xl bg-[#0F766E] p-6 text-white shadow-lg">
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 right-16 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-teal-100">
                    Covenant
                  </p>

                  <p className="mt-1 text-sm text-teal-50">
                    Debit Card
                  </p>
                </div>

                <CreditCard size={28} className="text-white/80" />
              </div>

              <p className="mt-12 text-lg font-semibold tracking-[0.22em] text-white/90">
                •••• •••• •••• ••••
              </p>

              <div className="mt-7 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-teal-100">
                    Card holder
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    Covenant Account
                  </p>
                </div>

                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                  Not issued
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <LockKeyhole size={14} />
            Card details are hidden until a card is issued.
          </div>
        </div>

        {/* Balance */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
              <Wallet size={21} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Available balance
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {loading
                  ? "Loading..."
                  : `₦${formatMoney(data?.balance ?? 0)}`}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Card availability
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              Coming soon
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Card issuing and management will become available
              once the card service is connected.
            </p>
          </div>
        </div>
      </section>

      {/* Card services */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
            <CreditCard size={21} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Card services
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Card controls will appear here when card issuing is
              connected to your Covenant account.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            "View card details",
            "Freeze or unfreeze card",
            "Manage card limits",
          ].map((service) => (
            <div
              key={service}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <LockKeyhole size={17} className="text-slate-400" />

              <p className="mt-3 text-sm font-medium text-slate-700">
                {service}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Not available yet
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <h2 className="font-bold text-slate-900">
            Recent account activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Recent transactions recorded on your account.
          </p>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#0F766E]" />

            <p className="mt-3 text-sm text-slate-500">
              Loading activity...
            </p>
          </div>
        ) : data?.transactions?.length ? (
          <div>
            {data.transactions.slice(0, 5).map((transaction) => {
              const isIncoming = transaction.direction === "in";

              return (
                <article
                  key={transaction.id}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0 sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      {isIncoming ? (
                        <ArrowDownLeft size={18} />
                      ) : (
                        <ArrowUpRight size={18} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {transaction.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`shrink-0 text-sm font-semibold ${
                      isIncoming
                        ? "text-[#0F766E]"
                        : "text-slate-900"
                    }`}
                  >
                    {isIncoming ? "+" : "-"}₦
                    {formatMoney(Number(transaction.amount ?? 0))}
                  </p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <CreditCard
              className="mx-auto text-slate-300"
              size={32}
            />

            <p className="mt-3 text-sm font-semibold text-slate-900">
              No activity yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Your account transactions will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}