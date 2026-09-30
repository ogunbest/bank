
import { redirect } from "next/navigation";

import TransactionsTable from "@/components/admin/TransactionsTable";
import {
  getAllTransactions,
  getLoggedInUser,
} from "@/lib/actions/user.actions";

export default async function AdminTransactionsPage() {
  const user = await getLoggedInUser();

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = user?.email?.trim().toLowerCase();

  if (
    !user ||
    !adminEmail ||
    userEmail !== adminEmail ||
    user.role?.trim().toLowerCase() !== "admin"
  ) {
    redirect("/dashboard");
  }

  const transactions = await getAllTransactions();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* HEADER */}
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0F766E] dark:text-teal-400">
            Administration
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Transactions
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            View and monitor transactions processed through Covenant.
          </p>
        </div>

        {/* SUMMARY */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* TOTAL TRANSACTIONS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Total transactions
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {transactions.length}
            </p>
          </div>

          {/* PROCESSING STATUS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Processing status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />

              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Operational
              </span>
            </div>
          </div>

          {/* CURRENCY */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Currency
            </p>

            <p className="mt-2 text-2xl font-bold text-[#0F766E] dark:text-teal-400">
              NGN
            </p>
          </div>
        </div>

        {/* TRANSACTIONS */}
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
}

