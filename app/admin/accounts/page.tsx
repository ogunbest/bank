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
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0F766E]">
            Administration
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Bank Accounts
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            View and monitor bank accounts connected to Covenant.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total accounts
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {accounts.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Connected status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-900">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Accounts table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className="text-base font-bold text-slate-900">
              Connected Accounts
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Bank accounts currently linked to user profiles.
            </p>
          </div>

          {accounts.length === 0 ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
                <span className="text-lg font-bold">₦</span>
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No bank accounts found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Connected bank accounts will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-100">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                      Account Name
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                      Account Number
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                      Bank
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                      Bank Code
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                      User ID
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {accounts.map((account) => (
                    <tr
                      key={account.$id}
                      className="transition-colors hover:bg-teal-50/40"
                    >
                      <td className="px-5 py-4 sm:px-6">
                        <p className="text-sm font-semibold text-slate-900">
                          {account.accountName || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-mono text-sm text-slate-600 sm:px-6">
                        {account.accountNumber || "—"}
                      </td>

                      <td className="px-5 py-4 sm:px-6">
                        <span className="inline-flex rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-[#0F766E]">
                          {account.bankName || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-mono text-sm text-slate-600 sm:px-6">
                        {account.bankCode || "—"}
                      </td>

                      <td className="px-5 py-4 font-mono text-xs text-slate-400 sm:px-6">
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