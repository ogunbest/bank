"use client";

import {
  ArrowUpRight,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useDashboardData } from "@/components/dashboard/useDashboardData";

const formatDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString("en-NG", {
        dateStyle: "medium",
      });
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value);

export default function BeneficiariesPage() {
  const { data, error, loading } = useDashboardData();

  const outgoingTransactions = (data?.transactions ?? []).filter(
    (transaction) => transaction.direction === "out",
  );

  return (
    <div className="space-y-7">
      {/* HEADER */}
      <section>
        <p className="text-sm font-medium text-[#0F766E]">
          Payments
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Beneficiaries
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage people and accounts you frequently send money to.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </section>

      {/* EMPTY BENEFICIARY STATE */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
            <Users size={30} />
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-900">
            No saved beneficiaries
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Beneficiary storage is not configured yet. Once it is
            available, your frequently used transfer recipients will
            appear here.
          </p>

          <Link
            href="/dashboard/transfers"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59]"
          >
            <ArrowUpRight size={17} />
            Make a transfer
          </Link>
        </div>
      </section>

      {/* RECENT TRANSFERS */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="font-bold text-slate-900">
              Recent outgoing activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your most recent recorded outgoing transfers.
            </p>
          </div>

          <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E] sm:flex">
            <WalletCards size={20} />
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#0F766E]" />
            <p className="mt-3 text-sm text-slate-500">
              Loading transfer activity...
            </p>
          </div>
        ) : outgoingTransactions.length ? (
          <div>
            {outgoingTransactions.slice(0, 5).map((transaction) => (
              <article
                key={transaction.id}
                className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0 sm:px-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <UserRound size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {transaction.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(transaction.date)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600">
                    -{formatAmount(Number(transaction.amount ?? 0))}
                  </p>

                  <ArrowUpRight
                    size={16}
                    className="ml-auto mt-1 text-slate-400"
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <SendIcon />
            </div>

            <p className="mt-4 font-medium text-slate-700">
              No outgoing transfers yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Your transfer activity will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function SendIcon() {
  return <ArrowUpRight size={21} />;
}