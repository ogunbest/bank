import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CreditCard,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { redirect } from "next/navigation";

import {
  getAllBankAccounts,
  getAllTransactions,
  getAllUsers,
  getLoggedInUser,
} from "@/lib/actions/user.actions";

export default async function AdminPage() {
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

  const users = await getAllUsers();
  const bankAccounts = await getAllBankAccounts();
  const transactions = await getAllTransactions();

  const totalBalance = users.reduce(
    (total, customer) =>
      total + Number(customer.balance || 0),
    0,
  );

  const totalDeposits = transactions
    .filter(
      (transaction) =>
        transaction.type?.toLowerCase() === "deposit",
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0,
    );

  const totalWithdrawals = transactions
    .filter(
      (transaction) =>
        transaction.type?.toLowerCase() === "withdrawal",
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0,
    );

  const totalTransfers = transactions
    .filter(
      (transaction) =>
        transaction.type?.toLowerCase() === "transfer",
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0,
    );

  const recentUsers = users.slice(-5).reverse();
  const recentTransactions = transactions.slice(-5).reverse();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0F766E] dark:text-teal-400">
              Administration
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Admin Overview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Monitor Covenant users, accounts, funds, and transaction
              activity from one place.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            System operational
          </div>
        </div>

        {/* Main Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users size={20} />}
            label="Total Users"
            value={users.length.toLocaleString("en-NG")}
            href="/admin/users"
          />

          <StatCard
            icon={<Building2 size={20} />}
            label="Bank Accounts"
            value={bankAccounts.length.toLocaleString("en-NG")}
            href="/admin/accounts"
          />

          <StatCard
            icon={<ReceiptText size={20} />}
            label="Transactions"
            value={transactions.length.toLocaleString("en-NG")}
            href="/admin/transactions"
          />

          <StatCard
            icon={<Wallet size={20} />}
            label="Customer Funds"
            value={`₦${totalBalance.toLocaleString("en-NG")}`}
            highlight
          />
        </div>

        {/* Financial Overview */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FinanceCard
            icon={<TrendingUp size={19} />}
            label="Total Deposits"
            value={`₦${totalDeposits.toLocaleString("en-NG")}`}
            positive
          />

          <FinanceCard
            icon={<TrendingDown size={19} />}
            label="Total Withdrawals"
            value={`₦${totalWithdrawals.toLocaleString("en-NG")}`}
            negative
          />

          <FinanceCard
            icon={<CreditCard size={19} />}
            label="Total Transfers"
            value={`₦${totalTransfers.toLocaleString("en-NG")}`}
          />
        </div>

        {/* Recent Activity */}
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          {/* Recent Users */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Users
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Latest customer accounts.
                </p>
              </div>

              <Link
                href="/admin/users"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#0F766E] transition hover:text-[#115E59] dark:text-teal-400 dark:hover:text-teal-300"
              >
                View all
                <ArrowUpRight size={15} />
              </Link>
            </div>

            {recentUsers.length === 0 ? (
              <EmptyState message="No users found." />
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentUsers.map((customer) => {
                  const name =
                    [customer.firstName, customer.lastName]
                      .filter(Boolean)
                      .join(" ") || "Unnamed User";

                  const status =
                    customer.status?.trim().toLowerCase() || "active";

                  const disabled = status === "disabled";

                  return (
                    <div
                      key={customer.$id}
                      className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-teal-50/40 dark:hover:bg-teal-950/20 sm:px-6"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 font-bold text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
                          {(
                            customer.firstName?.charAt(0) ||
                            customer.email?.charAt(0) ||
                            "U"
                          ).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/admin/users/${customer.$id}`}
                            className="block truncate text-sm font-semibold text-slate-900 transition hover:text-[#0F766E] dark:text-white dark:hover:text-teal-400"
                          >
                            {name}
                          </Link>

                          <p className="truncate text-xs text-slate-400">
                            {customer.email || "No email"}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                            disabled
                              ? "border-red-100 bg-red-50 text-red-500 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400"
                              : "border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              disabled
                                ? "bg-red-500 dark:bg-red-400"
                                : "bg-emerald-500 dark:bg-emerald-400"
                            }`}
                          />

                          {disabled ? "Disabled" : "Active"}
                        </span>

                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                          ₦
                          {Number(
                            customer.balance || 0,
                          ).toLocaleString("en-NG")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Recent Transactions */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Transactions
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Latest transaction activity.
                </p>
              </div>

              <Link
                href="/admin/transactions"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#0F766E] transition hover:text-[#115E59] dark:text-teal-400 dark:hover:text-teal-300"
              >
                View all
                <ArrowUpRight size={15} />
              </Link>
            </div>

            {recentTransactions.length === 0 ? (
              <EmptyState message="No transactions yet." />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[650px] w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60">
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:px-6">
                        Transaction
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:px-6">
                        Amount
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:px-6">
                        Type
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:px-6">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentTransactions.map((transaction) => {
                      const status =
                        transaction.status?.toLowerCase();

                      const statusClass =
                        status === "success" ||
                        status === "successful"
                          ? "border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : status === "pending"
                            ? "border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-400"
                            : "border-red-100 bg-red-50 text-red-500 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400";

                      return (
                        <tr
                          key={transaction.$id}
                          className="transition hover:bg-teal-50/40 dark:hover:bg-teal-950/20"
                        >
                          <td className="px-5 py-4 sm:px-6">
                            <Link
                              href={`/admin/transactions/${transaction.$id}`}
                              className="font-mono text-xs font-semibold text-[#0F766E] hover:underline dark:text-teal-400"
                            >
                              {transaction.reference ||
                                transaction.$id}
                            </Link>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white sm:px-6">
                            ₦
                            {Number(
                              transaction.amount || 0,
                            ).toLocaleString("en-NG")}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-sm capitalize text-slate-600 dark:text-slate-400 sm:px-6">
                            {transaction.type || "—"}
                          </td>

                          <td className="px-5 py-4 sm:px-6">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass}`}
                            >
                              {transaction.status || "Unknown"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  highlight?: boolean;
}) {
  const content = (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-100 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-900/60">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
          {icon}
        </div>

        {href && (
          <ArrowUpRight
            size={17}
            className="text-slate-300 transition group-hover:text-[#0F766E] dark:text-slate-600 dark:group-hover:text-teal-400"
          />
        )}
      </div>

      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${
          highlight
            ? "text-[#0F766E] dark:text-teal-400"
            : "text-slate-900 dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="group block">
      {content}
    </Link>
  );
}

function FinanceCard({
  icon,
  label,
  value,
  positive = false,
  negative = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          positive
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
            : negative
              ? "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400"
              : "bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400"
        }`}
      >
        {icon}
      </div>

      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-bold ${
          positive
            ? "text-emerald-600 dark:text-emerald-400"
            : negative
              ? "text-red-500 dark:text-red-400"
              : "text-slate-900 dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center px-6 text-center">
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}