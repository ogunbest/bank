"use client";

import { PiggyBank, Plus, Target } from "lucide-react";
import { useDashboardData } from "@/components/dashboard/useDashboardData";

export default function SavingsPage() {
  const { data, loading } = useDashboardData();

  const balance = data?.balance ?? 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">
              Savings
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Set money aside and work towards your financial goals.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59]"
          >
            <Plus size={18} />
            New goal
          </button>
        </div>

        {/* Savings overview */}
        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <PiggyBank size={22} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Available balance
                </p>

                <p className="mt-1 text-2xl font-bold text-[#0F172A]">
                  {loading
                    ? "Loading..."
                    : `₦${balance.toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Target size={22} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Savings goals
                </p>

                <p className="mt-1 text-2xl font-bold text-[#0F172A]">
                  0
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Empty state */}
        <section className="rounded-3xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-gray-200/70">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600">
            <PiggyBank size={30} />
          </div>

          <h2 className="mt-5 text-lg font-bold text-[#0F172A]">
            Start your first savings goal
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Create a goal for something important and track your progress
            as you save.
          </p>

          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59]"
          >
            <Plus size={18} />
            Create savings goal
          </button>
        </section>
      </main>
    </div>
  );
}