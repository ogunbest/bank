"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  Bell,
  CreditCard,
  Eye,
  EyeOff,
  Gift,
  Landmark,
  MoreHorizontal,
  PiggyBank,
  Settings,
  Smartphone,
  Users,
  Wallet,
  Wifi,
  Zap,
} from "lucide-react";
import { useState } from "react";

import FundAccount from "@/components/dashboard/FundAccount";
import { useDashboardData } from "@/components/dashboard/useDashboardData";

export default function DashboardPage() {
  const { data, loading } = useDashboardData();
  const [showBalance, setShowBalance] = useState(true);

  const user = data?.user;
  const balance = data?.balance ?? 0;
 const firstName = user?.name?.split(" ")[0] || "Customer";

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);

  const services = [
    {
      name: "Airtime",
      icon: Smartphone,
    },
    {
      name: "Data",
      icon: Wifi,
    },
    {
      name: "Electricity",
      icon: Zap,
    },
    {
      name: "Gifts",
      icon: Gift,
    },
    {
      name: "Banking",
      icon: Landmark,
      href: "/dashboard/banking",
    },
    {
      name: "More",
      icon: MoreHorizontal,
      href: "/dashboard/transactions",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#14B8A6] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC]">

      {/* BACKGROUND DESIGN */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#14B8A6]/10 blur-3xl" />

        <div className="absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-[#0F172A]/10 blur-3xl" />

        <div className="absolute bottom-[-200px] left-1/3 h-[500px] w-[500px] rounded-full bg-[#2DD4BF]/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">

        {/* HEADER */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Good morning
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#0F172A]">
              {firstName}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/settings"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0F172A] shadow-sm ring-1 ring-gray-200 transition hover:bg-[#CCFBF1]"
              aria-label="Settings"
            >
              <Settings size={20} />
            </Link>

            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0F172A] shadow-sm ring-1 ring-gray-200 transition hover:bg-[#CCFBF1]"
              aria-label="Notifications"
            >
              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#14B8A6]" />
            </button>
          </div>
        </header>

        {/* ACCOUNT OVERVIEW */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#122C3A] to-[#0F766E] p-6 text-white shadow-xl">

          {/* CARD GLOW */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#2DD4BF]/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#14B8A6]/20 blur-3xl" />

          <div className="relative">

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-300">
                  Account Overview
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <h2 className="text-3xl font-bold">
                    {showBalance
                      ? formatMoney(balance)
                      : "₦••••••"}
                  </h2>

                  <button
                    type="button"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-gray-300 transition hover:text-[#2DD4BF]"
                    aria-label="Toggle balance visibility"
                  >
                    {showBalance ? (
                      <Eye size={20} />
                    ) : (
                      <EyeOff size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#14B8A6] shadow-lg shadow-[#14B8A6]/20">
                <Wallet size={22} />
              </div>
            </div>

            {/* MONEY STATS */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs text-gray-300">
                  Money In
                </p>

                <p className="mt-1 text-lg font-semibold">
  ₦
  {data?.transactions
    ?.filter(
      (transaction) =>
        transaction.type === "credit" ||
        transaction.type === "deposit" ||
        transaction.type === "funding"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount ?? 0),
      0
    )
    .toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs text-gray-300">
                  Money Out
                </p>

                <p className="mt-1 text-lg font-semibold">
  ₦
  {data?.transactions
    ?.filter(
      (transaction) =>
        transaction.type === "debit" ||
        transaction.type === "withdrawal" ||
        transaction.type === "transfer"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount ?? 0),
      0
    )
    .toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
</p>
              </div>
            </div>

          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-7">
          <h2 className="mb-4 text-lg font-bold text-[#0F172A]">
            Quick Actions
          </h2>

          <div className="grid grid-cols-4 gap-4 sm:grid-cols-5 lg:grid-cols-7">

            <FundAccount />

            <QuickAction
              href="/dashboard/transfers"
              icon={<ArrowLeftRight size={20} />}
              label="Transfer"
            />


            <QuickAction
              href="/dashboard/cards"
              icon={<CreditCard size={20} />}
              label="Cards"
            />

            <QuickAction
              href="/dashboard/accounts"
              icon={<Wallet size={20} />}
              label="Accounts"
            />

            <QuickAction
              href="/dashboard/savings"
              icon={<PiggyBank size={20} />}
              label="Savings"
            />

            <QuickAction
              href="/dashboard/beneficiaries"
              icon={<Users size={20} />}
              label="Beneficiaries"
            />

          </div>
        </section>

        {/* SERVICES */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-[#0F172A]">
            Services
          </h2>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {services.map((service) => {
              const Icon = service.icon;

              const content = (
                <>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CCFBF1] text-[#0F766E] transition group-hover:bg-[#14B8A6] group-hover:text-white">
                    <Icon size={20} />
                  </span>

                  <span className="mt-2 text-xs font-medium text-gray-700">
                    {service.name}
                  </span>
                </>
              );

              if (service.href) {
                return (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="group flex flex-col items-center justify-center rounded-2xl bg-white/90 px-2 py-4 shadow-sm ring-1 ring-gray-200/70 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[#14B8A6]"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={service.name}
                  type="button"
                  className="group flex flex-col items-center justify-center rounded-2xl bg-white/90 px-2 py-4 shadow-sm ring-1 ring-gray-200/70 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[#14B8A6]"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </section>

        {/* TRANSACTION HISTORY */}
<section className="mt-8 overflow-hidden rounded-3xl bg-white/90 shadow-sm ring-1 ring-gray-200/70 backdrop-blur-sm">
  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
    <div>
      <h2 className="font-bold text-[#0F172A]">Transaction History</h2>
      <p className="mt-1 text-sm text-gray-500">
        Recent activity and financial insights
      </p>
    </div>

    <Link
      href="/dashboard/transactions"
      className="text-sm font-semibold text-[#0F766E] hover:text-[#0F172A]"
    >
      View all
    </Link>
  </div>

  <div className="divide-y divide-gray-100">
    {(data?.transactions ?? [])
      .slice()
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
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
            className="flex items-center justify-between gap-3 px-5 py-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  outgoing
                    ? "bg-red-50 text-red-500"
                    : "bg-teal-50 text-teal-600"
                }`}
              >
                <span className="text-sm font-bold">
                  {outgoing ? "↑" : "↓"}
                </span>
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {transaction.title}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {new Date(transaction.date).toLocaleString("en-NG", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p
                className={`text-sm font-bold ${
                  outgoing ? "text-red-500" : "text-teal-600"
                }`}
              >
                {outgoing ? "-" : "+"}
                {formatMoney(amount)}
              </p>

              <p className="text-xs capitalize text-slate-400">
                {transaction.status}
              </p>
            </div>
          </div>
        );
      })}
  </div>

  {(data?.transactions ?? []).length === 0 && (
    <div className="px-5 py-10 text-center">
      <p className="text-sm font-medium text-slate-600">
        No transactions yet
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Your recent transactions will appear here.
      </p>
    </div>
  )}

  <div className="grid grid-cols-3 border-t border-gray-100">
    <div className="px-4 py-4">
      <p className="text-xs text-gray-400">Money In</p>
      <p className="mt-1 text-sm font-bold text-teal-600">
        {formatMoney(
          (data?.transactions ?? [])
            .filter(
              (transaction) =>
                transaction.direction !== "out" &&
                !["debit", "transfer", "withdrawal"].includes(
                  transaction.type,
                ),
            )
            .reduce(
              (total, transaction) =>
                total + Number(transaction.amount ?? 0),
              0,
            ),
        )}
      </p>
    </div>

    <div className="border-x border-gray-100 px-4 py-4">
      <p className="text-xs text-gray-400">Money Out</p>
      <p className="mt-1 text-sm font-bold text-red-500">
        {formatMoney(
          (data?.transactions ?? [])
            .filter(
              (transaction) =>
                transaction.direction === "out" ||
                ["debit", "transfer", "withdrawal"].includes(
                  transaction.type,
                ),
            )
            .reduce(
              (total, transaction) =>
                total + Number(transaction.amount ?? 0),
              0,
            ),
        )}
      </p>
    </div>

    <div className="px-4 py-4">
      <p className="text-xs text-gray-400">Transactions</p>
      <p className="mt-1 text-sm font-bold text-[#0F172A]">
        {(data?.transactions ?? []).length}
      </p>
    </div>
  </div>
</section>

      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-[#0F766E] shadow-sm ring-1 ring-gray-200 backdrop-blur-sm transition group-hover:bg-[#CCFBF1] group-hover:ring-[#14B8A6] active:scale-95">
        {icon}
      </span>

      <span className="mt-2 text-xs font-medium text-gray-700">
        {label}
      </span>
    </Link>
  );
}
