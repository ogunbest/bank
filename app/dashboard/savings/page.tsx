"use client";

import {
  ArrowRight,
  PiggyBank,
  Plus,
  Target,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import SavingsGoals from "@/components/dashboard/savingsGoals";

const formatMoney = (amount: number) =>
  amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function SavingsPage() {
  const { data, loading } = useDashboardData();

  const balance = data?.balance ?? 0;

  return (
    <div className="space-y-7">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#0F766E]">
            Financial goals
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Savings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Set money aside and work towards your financial goals.
          </p>
        </div>

        <Link
          href="#savings-goals"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          <Plus size={18} />
          New goal
        </Link>
      </section>

      {/* Overview */}
      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
              <Wallet size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Available balance
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {loading
                  ? "Loading..."
                  : `₦${formatMoney(balance)}`}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-[#0F766E]" />
            Available to save
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Target size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Savings goals
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                Your goals
              </p>
            </div>
          </div>

          <p className="mt-5 text-xs text-slate-500">
            Create goals below and track your progress as you save.
          </p>
        </div>
      </section>

      {/* Savings goals */}
      <section id="savings-goals" className="scroll-mt-24">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Your savings goals
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep track of what you are saving towards.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SavingsGoals />
        </div>
      </section>

      {/* Savings information */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
            <PiggyBank size={21} />
          </div>

          <div className="flex-1">
            <h2 className="font-bold text-slate-900">
              Build your savings
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Create separate goals for things that matter to you and
              add money whenever you are ready.
            </p>

            <Link
              href="#savings-goals"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E] hover:text-[#115E59]"
            >
              View savings goals
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}