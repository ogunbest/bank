"use client";

import Link from "next/link";
import FinancialInsights from "@/components/dashboard/financialInsights";
import FundAccount from "@/components/dashboard/FundAccount";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import {
  ArrowLeftRight,
  CreditCard,
  Eye,
  EyeOff,
  Tv,
  Globe,
  MoreHorizontal,
  PiggyBank,
  Smartphone,
  Users,
  Wallet,
  Wifi,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const { data, loading } = useDashboardData();
  const [showBalance, setShowBalance] = useState(true);

  const user = data?.user;
  const balance = data?.balance ?? 0;
  const firstName = user?.name?.split(" ")[0] || "Customer";

  const transactions = data?.transactions ?? [];

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);

  const moneyIn = transactions
    .filter(
      (transaction) =>
        transaction.direction !== "out" &&
        !["debit", "transfer", "withdrawal"].includes(transaction.type),
    )
    .reduce(
      (total, transaction) => total + Number(transaction.amount ?? 0),
      0,
    );

  const moneyOut = transactions
    .filter(
      (transaction) =>
        transaction.direction === "out" ||
        ["debit", "transfer", "withdrawal"].includes(transaction.type),
    )
    .reduce(
      (total, transaction) => total + Number(transaction.amount ?? 0),
      0,
    );

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0F766E] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* PAGE INTRO */}
      <section>
        <p className="text-sm font-medium text-slate-400">
          Good morning
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {firstName}
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here&apos;s your financial overview.
        </p>
      </section>

      {/* ACCOUNT + QUICK ACTIONS */}
      <section className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        {/* ACCOUNT REVIEW */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0F766E] p-6 text-white shadow-sm sm:p-7">
  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-300/10 blur-3xl" />

  <div className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-teal-400/10 blur-3xl" />

  <div className="relative">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-teal-100">
          Account Review
        </p>

        <div className="mt-3 flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {showBalance ? formatMoney(balance) : "₦••••••••"}
          </h2>

          <button
            type="button"
            onClick={() => setShowBalance((value) => !value)}
            className="rounded-lg p-1.5 text-teal-100 transition hover:bg-white/10 hover:text-white"
            aria-label="Toggle balance visibility"
          >
            {showBalance ? <Eye size={19} /> : <EyeOff size={19} />}
          </button>
        </div>

        <p className="mt-1 text-xs text-teal-100">
          Available balance
        </p>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
        <Wallet size={21} />
      </div>
    </div>

    <div className="mt-7 grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
        <p className="text-xs text-teal-100">Money In</p>

        <p className="mt-1 text-base font-bold">
          {formatMoney(moneyIn)}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
        <p className="text-xs text-teal-100">Money Out</p>

        <p className="mt-1 text-base font-bold">
          {formatMoney(moneyOut)}
        </p>
      </div>
    </div>
  </div>
</div>

        {/* QUICK ACTIONS */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="mb-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage your money quickly.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <ActionItem
              icon={<FundAccount />}
              label="Fund"
              special
            />

            <ActionItem
              href="/dashboard/transfers"
              icon={<ArrowLeftRight size={20} />}
              label="Transfer"
            />

            <ActionItem
              href="/dashboard/cards"
              icon={<CreditCard size={20} />}
              label="Cards"
            />

            <ActionItem
              href="/dashboard/accounts"
              icon={<Wallet size={20} />}
              label="Accounts"
            />

            <ActionItem
              href="/dashboard/savings"
              icon={<PiggyBank size={20} />}
              label="Savings"
            />

            <ActionItem
              href="/dashboard/beneficiaries"
              icon={<Users size={20} />}
              label="Beneficiaries"
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Services
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Pay bills and access digital services.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-11">
          <ServiceItem
            href="/dashboard/services/airtime"
            icon={<Smartphone size={19} />}
            label="Airtime"
          />

          <ServiceItem
            href="/dashboard/services/data"
            icon={<Wifi size={19} />}
            label="Data"
          />

          <ServiceItem
            href="/dashboard/services/electricity"
            icon={<Zap size={19} />}
            label="Electricity"
          />

          <ServiceItem
            href="/dashboard/services/tv"
            icon={<Tv size={19} />}
            label="TV"
          />

          <ServiceItem
            href="/dashboard/services/internet"
            icon={<Globe size={19} />}
            label="Internet"
          />

          <ServiceItem
            href="/dashboard/services/exam"
            icon={<CreditCard size={19} />}
            label="Exam"
          />

          <ServiceItem
            href="/dashboard/services/data-pin"
            icon={<Wifi size={19} />}
            label="Data PIN"
          />

          <ServiceItem
            href="/dashboard/services/data-cable"
            icon={<Zap size={19} />}
            label="Data Cable"
          />

          <ServiceItem
            href="/dashboard/services/bulk-sms"
            icon={<Users size={19} />}
            label="Bulk SMS"
          />

          <ServiceItem
            href="/dashboard/services/recharge"
            icon={<Smartphone size={19} />}
            label="Recharge"
          />

          <ServiceItem
            href="/dashboard/services/more"
            icon={<MoreHorizontal size={19} />}
            label="More"
          />
        </div>
      </section>

      {/* TRANSACTION HISTORY */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-6">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              Transaction History
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Recent activity and financial insights.
            </p>
          </div>

          <Link
            href="/dashboard/transactions"
            className="text-sm font-semibold text-[#0F766E] transition hover:text-[#115E59] dark:text-teal-400 dark:hover:text-teal-300"
          >
            View all
          </Link>
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {transactions
            .slice()
            .sort(
              (a, b) =>
                new Date(b.date).getTime() -
                new Date(a.date).getTime(),
            )
            .slice(0, 5)
            .map((transaction) => {
              const outgoing =
                transaction.direction === "out" ||
                ["debit", "transfer", "withdrawal"].includes(
                  transaction.type,
                );

              const amount = Number(transaction.amount ?? 0);

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        outgoing
                          ? "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400"
                          : "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400"
                      }`}
                    >
                      <span className="text-sm font-bold">
                        {outgoing ? "↑" : "↓"}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {transaction.title}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                        {new Date(
                          transaction.date,
                        ).toLocaleString("en-NG", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className={`text-sm font-bold ${
                        outgoing
                          ? "text-red-500 dark:text-red-400"
                          : "text-teal-600 dark:text-teal-400"
                      }`}
                    >
                      {outgoing ? "-" : "+"}
                      {formatMoney(amount)}
                    </p>

                    <p className="text-[11px] capitalize text-slate-400 dark:text-slate-500">
                      {transaction.status}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>

        {/* EMPTY STATE */}
        {transactions.length === 0 && (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <ReceiptIcon />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              No transactions yet
            </p>

            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Your recent transactions will appear here.
            </p>
          </div>
        )}

        {/* SUMMARY */}
        <div className="grid grid-cols-3 border-t border-slate-100 dark:border-slate-800">
          <SummaryItem
            label="Money In"
            value={formatMoney(moneyIn)}
            className="text-teal-600 dark:text-teal-400"
          />

          <SummaryItem
            label="Money Out"
            value={formatMoney(moneyOut)}
            className="border-x border-slate-100 text-red-500 dark:border-slate-800 dark:text-red-400"
          />

          <SummaryItem
            label="Transactions"
            value={transactions.length.toString()}
            className="text-slate-900 dark:text-white"
          />
        </div>

        {/* FINANCIAL INSIGHTS */}
        <div className="border-t border-slate-100 p-5 dark:border-slate-800 sm:p-6">
          <FinancialInsights
            transactions={transactions}
            balance={balance}
          />
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function ActionItem({
  href,
  icon,
  label,
  special,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  special?: boolean;
}) {
  const content = (
    <>
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
          special
            ? "bg-[#0F766E] text-white"
            : "bg-[#F0FDFA] text-[#0F766E] group-hover:bg-[#0F766E] group-hover:text-white dark:bg-teal-950/50 dark:text-teal-400"
        }`}
      >
        {icon}
      </span>

      <span className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group flex flex-col items-center rounded-2xl p-2 transition hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="group flex flex-col items-center rounded-2xl p-2">
      {content}
    </div>
  );
}

/* =========================================================
   SERVICE ITEM
========================================================= */

function ServiceItem({
  href,
  icon,
  label,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
}) {
  const content = (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition group-hover:bg-[#F0FDFA] group-hover:text-[#0F766E] dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-teal-950/50 dark:group-hover:text-teal-400">
        {icon}
      </span>

      <span className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white py-4 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-800 dark:hover:shadow-none"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white py-4 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-800 dark:hover:shadow-none"
    >
      {content}
    </button>
  );
}

/* =========================================================
   SUMMARY ITEM
========================================================= */

function SummaryItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`px-4 py-4 sm:px-6 ${className ?? ""}`}>
      <p className="text-[11px] text-slate-400 dark:text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   RECEIPT ICON
========================================================= */

function ReceiptIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  );
}