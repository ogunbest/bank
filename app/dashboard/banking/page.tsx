"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Landmark,
  PiggyBank,
  Wallet,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Fund account",
    description: "Add money to your Covenant account.",
    icon: Wallet,
    href: "/dashboard",
    label: "Add money",
  },
  {
    title: "Transfer money",
    description: "Send money to another bank account.",
    icon: ArrowUpRight,
    href: "/dashboard/transfers",
    label: "Send money",
  },
  {
    title: "Withdraw",
    description: "Withdraw money to your linked bank account.",
    icon: ArrowDownLeft,
    href: "/dashboard/withdrawals",
    label: "Withdraw",
  },
  {
    title: "Cards",
    description: "Manage your cards and card settings.",
    icon: CreditCard,
    href: "/dashboard/cards",
    label: "Manage cards",
  },
  {
    title: "Accounts",
    description: "Manage your linked bank accounts.",
    icon: Landmark,
    href: "/dashboard/accounts",
    label: "View accounts",
  },
  {
    title: "Savings",
    description: "Create and manage your savings goals.",
    icon: PiggyBank,
    href: "/dashboard/savings",
    label: "View savings",
  },
];

export default function BankingPage() {
  return (
    <div className="space-y-7">
      {/* HEADER */}
      <section>
        <p className="text-sm font-medium text-[#0F766E]">
          Banking
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Banking services
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Everything you need to manage your money, accounts, cards and
          savings in one place.
        </p>
      </section>

      {/* OVERVIEW */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F766E] to-[#115E59] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />

        <div className="absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <Landmark size={27} />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/60">
              Covenant Banking
            </p>

            <h2 className="mt-1 text-xl font-bold sm:text-2xl">
              What would you like to do?
            </h2>

            <p className="mt-1 max-w-xl text-sm text-white/70">
              Access transfers, withdrawals, cards, accounts and
              savings from one place.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            All services
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose a service to continue.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                key={service.title}
                href={service.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-100 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E] transition group-hover:bg-[#0F766E] group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <span className="text-lg text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#0F766E]">
                    →
                  </span>
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-1 min-h-[48px] text-sm leading-6 text-slate-500">
                  {service.description}
                </p>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <span className="text-xs font-semibold text-[#0F766E]">
                    {service.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* QUICK HELP */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">
              Need to manage your account?
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View your transactions or update your banking settings.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/transactions"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Transactions
            </Link>

            <Link
              href="/dashboard/settings"
              className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
            >
              Settings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}