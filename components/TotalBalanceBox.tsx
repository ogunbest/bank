"use client";

import { Landmark, Wallet } from "lucide-react";

import AnimatedCounter from "./AnimatedCounter";
import DoughnutChart from "./DoughnutChart";

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceBoxProps) => {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-6">
      <div className="grid items-center gap-8 lg:grid-cols-[240px_1fr]">
        {/* Chart */}
        <div className="flex justify-center">
          <div className="relative">
            <DoughnutChart accounts={accounts} />
          </div>
        </div>

        {/* Balance information */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
              <Landmark size={21} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Linked accounts
              </p>

              <h2 className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
                {totalBanks}{" "}
                {Number(totalBanks) === 1
                  ? "Bank Account"
                  : "Bank Accounts"}
              </h2>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Wallet size={17} />

              <p className="text-sm font-medium">
                Total current balance
              </p>
            </div>

            <div className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              <AnimatedCounter
                amount={totalCurrentBalance}
              />
            </div>

            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              Across all linked bank accounts
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;