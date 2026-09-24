"use client";

import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  Plus,
  UserCircle,
} from "lucide-react";

import BankCard from "./BankCard";
import Category from "./Category";
import { countTransactionCategories } from "@/lib/utils";

const RightSidebar = ({
  user,
  transactions,
  banks,
}: RightSidebarProps) => {
  const categories: CategoryCount[] =
    countTransactionCategories(transactions);

  const fullName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    "Covenant User";

  const firstLetter =
    user?.firstName?.charAt(0)?.toUpperCase() || "U";

  return (
    <aside className="space-y-6">
      {/* Profile */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="h-20 bg-gradient-to-r from-[#0F766E] to-[#115E59]" />

        <div className="px-5 pb-5 sm:px-6">
          <div className="-mt-8 flex items-end gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-teal-50 text-[#0F766E] shadow-sm">
              {firstLetter ? (
                <span className="text-2xl font-bold">
                  {firstLetter}
                </span>
              ) : (
                <UserCircle size={30} />
              )}
            </div>

            <div className="min-w-0 pb-1">
              <h2 className="truncate text-base font-bold text-slate-900">
                {fullName}
              </h2>

              <p className="truncate text-xs text-slate-500">
                {user?.email}
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/settings"
            className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-[#0F766E]"
          >
            <span>Manage profile</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Banks */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              My banks
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Your linked accounts
            </p>
          </div>

          <Link
            href="/dashboard/accounts"
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-50 px-3 py-2 text-xs font-semibold text-[#0F766E] transition hover:bg-teal-100"
          >
            <Plus size={15} />
            Add bank
          </Link>
        </div>

        {banks?.length > 0 ? (
          <div className="mt-6 space-y-4">
            <div className="overflow-hidden rounded-2xl">
              <BankCard
                key={banks[0].appwriteItemId}
                account={banks[0]}
                userName={fullName}
                showBalance={false}
              />
            </div>

            {banks[1] && (
              <div className="overflow-hidden rounded-2xl">
                <BankCard
                  key={banks[1].appwriteItemId}
                  account={banks[1]}
                  userName={fullName}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
              <CreditCard size={20} />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-700">
              No linked banks
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Add a bank account to manage your banking activity.
            </p>

            <Link
              href="/dashboard/accounts"
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#0F766E] hover:underline"
            >
              Add an account
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-bold text-slate-900">
            Top categories
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Where your recent spending goes
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="space-y-5">
            {categories.map((category) => (
              <Category
                key={category.name}
                category={category}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 px-5 py-8 text-center">
            <p className="text-sm font-medium text-slate-600">
              No spending data yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Categories will appear as transactions are recorded.
            </p>
          </div>
        )}
      </section>
    </aside>
  );
};

export default RightSidebar;