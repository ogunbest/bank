
import { redirect } from "next/navigation";

import {
  getAllBankAccounts,
  getLoggedInUser,
} from "@/lib/actions/user.actions";

export default async function AdminAccountsPage() {
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

  const accounts = await getAllBankAccounts();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* HEADER */}
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0F766E] dark:text-teal-400">
            Administration
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Bank Accounts
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            View and monitor bank accounts connected to Covenant.
          </p>
        </div>

        {/* SUMMARY */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">

          {/* TOTAL ACCOUNTS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Total accounts
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {accounts.length}
            </p>
          </div>

          {/* STATUS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Connected status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />

              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* ACCOUNTS TABLE */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">

          {/* TABLE HEADER */}
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Connected Accounts
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Bank accounts currently linked to user profiles.
            </p>
          </div>

          {accounts.length === 0 ? (
            /* EMPTY STATE */
            <div className="flex min-h-[240px] flex-col items-center justify-center px-6 text-center">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
                <span className="text-lg font-bold">₦</span>
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                No bank accounts found
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Connected bank accounts will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="min-w-[900px] w-full text-left">

                {/* TABLE HEAD */}
                <thead className="bg-slate-50 dark:bg-slate-800/60">
                  <tr className="border-b border-slate-100 dark:border-slate-800">

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:px-6">
                      Account Name
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:px-6">
                      Account Number
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:px-6">
                      Bank
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:px-6">
                      Bank Code
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:px-6">
                      User ID
                    </th>
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                  {accounts.map((account) => (
                    <tr
                      key={account.$id}
                      className="transition-colors hover:bg-teal-50/40 dark:hover:bg-teal-950/20"
                    >

                      {/* ACCOUNT NAME */}
                      <td className="px-5 py-4 sm:px-6">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {account.accountName || "—"}
                        </p>
                      </td>

                      {/* ACCOUNT NUMBER */}
                      <td className="px-5 py-4 font-mono text-sm text-slate-600 dark:text-slate-300 sm:px-6">
                        {account.accountNumber || "—"}
                      </td>

                      {/* BANK */}
                      <td className="px-5 py-4 sm:px-6">
                        <span className="inline-flex rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-[#0F766E] dark:border-teal-900/60 dark:bg-teal-950/50 dark:text-teal-400">
                          {account.bankName || "—"}
                        </span>
                      </td>

                      {/* BANK CODE */}
                      <td className="px-5 py-4 font-mono text-sm text-slate-600 dark:text-slate-300 sm:px-6">
                        {account.bankCode || "—"}
                      </td>

                      {/* USER ID */}
                      <td className="px-5 py-4 font-mono text-xs text-slate-400 dark:text-slate-500 sm:px-6">
                        {account.userId || "—"}
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

