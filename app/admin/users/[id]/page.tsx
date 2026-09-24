import Link from "next/link";
import { ArrowLeft, Building2, UserRound } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import UserStatusButton from "@/components/admin/UserStatusButton";
import {
  getAllBankAccounts,
  getAllTransactions,
  getAllUsers,
  getLoggedInUser,
} from "@/lib/actions/user.actions";

export default async function AdminUserDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const admin = await getLoggedInUser();

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminUserEmail = admin?.email?.trim().toLowerCase();

  if (
    !admin ||
    !adminEmail ||
    adminUserEmail !== adminEmail ||
    admin.role?.trim().toLowerCase() !== "admin"
  ) {
    redirect("/dashboard");
  }

  const users = await getAllUsers();
  const bankAccounts = await getAllBankAccounts();
  const transactions = await getAllTransactions();

  const user = users.find((item) => item.$id === params.id);

  if (!user) {
    notFound();
  }

  const userBankAccounts = bankAccounts.filter(
    (bank) => bank.userId === user.userId,
  );

  const userTransactions = transactions.filter(
    (transaction) =>
      transaction.userId === user.userId ||
      transaction.senderId === user.userId ||
      transaction.receiverId === user.userId,
  );

  const totalDeposits = userTransactions
    .filter(
      (transaction) =>
        transaction.type?.toLowerCase() === "deposit",
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0,
    );

  const totalWithdrawals = userTransactions
    .filter(
      (transaction) =>
        transaction.type?.toLowerCase() === "withdrawal",
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0,
    );

  const totalTransfers = userTransactions
    .filter(
      (transaction) =>
        transaction.type?.toLowerCase() === "transfer",
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0,
    );

  const fullName =
    [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ") || "Unknown User";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="mb-7">
          <Link
            href="/admin/users"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E] transition hover:text-[#115E59]"
          >
            <ArrowLeft size={16} />
            Back to Users
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
                <UserRound size={26} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0F766E]">
                  Customer Profile
                </p>

                <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {fullName}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {user.email || "No email available"}
                </p>
              </div>
            </div>

            <div className="rounded-full border border-teal-100 bg-teal-50 px-3 py-2 text-xs font-semibold text-[#0F766E]">
              {user.role?.trim() || "Customer"}
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Current Balance"
            value={`₦${Number(user.balance || 0).toLocaleString("en-NG")}`}
            highlight
          />

          <SummaryCard
            label="Total Deposits"
            value={`₦${totalDeposits.toLocaleString("en-NG")}`}
            positive
          />

          <SummaryCard
            label="Total Withdrawals"
            value={`₦${totalWithdrawals.toLocaleString("en-NG")}`}
            negative
          />

          <SummaryCard
            label="Total Transfers"
            value={`₦${totalTransfers.toLocaleString("en-NG")}`}
          />
        </div>

        {/* Account Information */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            title="Account Information"
            description="Personal and account details for this customer."
          />

          <div className="grid gap-x-8 gap-y-6 px-5 py-6 sm:grid-cols-2 lg:grid-cols-3 sm:px-6">
            <DetailItem
              label="First Name"
              value={user.firstName || "—"}
            />

            <DetailItem
              label="Last Name"
              value={user.lastName || "—"}
            />

            <DetailItem
              label="Email"
              value={user.email || "—"}
              breakAll
            />

            <DetailItem
              label="Role"
              value={user.role?.trim() || "—"}
              capitalize
            />

            <DetailItem
              label="City"
              value={user.city || "—"}
            />

            <DetailItem
              label="State"
              value={user.state || "—"}
            />

            <DetailItem
              label="Address"
              value={user.address1 || "—"}
            />

            <DetailItem
              label="User ID"
              value={user.$id}
              breakAll
            />

            <DetailItem
              label="Account Type"
              value="Personal Account"
            />
          </div>
        </section>

        {/* Account Status */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Account Status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    user.status?.trim().toLowerCase() === "disabled"
                      ? "bg-red-500"
                      : "bg-emerald-500"
                  }`}
                />

                <p className="text-lg font-bold capitalize text-slate-900">
                  {user.status?.trim() || "active"}
                </p>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Control whether this customer can access their account.
              </p>
            </div>

            <UserStatusButton
              userId={user.$id}
              currentStatus={user.status || "active"}
            />
          </div>
        </section>

        {/* Linked Bank Accounts */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            title="Linked Bank Accounts"
            description="Bank accounts connected to this customer."
          />

          {userBankAccounts.length === 0 ? (
            <EmptyState
              icon={<Building2 size={22} />}
              title="No bank accounts linked"
              description="This customer has not connected a bank account yet."
            />
          ) : (
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              {userBankAccounts.map((bank) => (
                <div
                  key={bank.$id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-teal-100 hover:bg-teal-50/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {bank.bankName || "Bank Account"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {bank.accountName || "—"}
                      </p>
                    </div>

                    <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                      Linked
                    </span>
                  </div>

                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Account Number
                    </p>

                    <p className="mt-1 font-mono text-sm font-medium text-slate-700">
                      ••••{" "}
                      {String(bank.accountNumber || "").slice(-4)}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Bank Code
                    </p>

                    <p className="mt-1 font-mono text-sm text-slate-600">
                      {bank.bankCode || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Customer Activity */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            title="Customer Activity"
            description={`${userTransactions.length} transaction${
              userTransactions.length === 1 ? "" : "s"
            } associated with this customer.`}
          />

          {userTransactions.length === 0 ? (
            <EmptyState
              title="No transactions yet"
              description="Customer transactions will appear here once activity is recorded."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[800px] w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-100">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                      Type
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                      Reference
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {userTransactions.map((transaction) => {
                    const status =
                      transaction.status?.toLowerCase();

                    const statusClass =
                      status === "success" ||
                      status === "successful"
                        ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                        : status === "pending"
                          ? "border-amber-100 bg-amber-50 text-amber-600"
                          : "border-red-100 bg-red-50 text-red-500";

                    return (
                      <tr
                        key={transaction.$id}
                        className="transition-colors hover:bg-teal-50/40"
                      >
                        <td className="px-5 py-4 sm:px-6">
                          <span className="text-sm font-semibold capitalize text-slate-800">
                            {transaction.type || "—"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-900 sm:px-6">
                          ₦
                          {Number(
                            transaction.amount || 0,
                          ).toLocaleString("en-NG")}
                        </td>

                        <td className="px-5 py-4 sm:px-6">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass}`}
                          >
                            {transaction.status || "Unknown"}
                          </span>
                        </td>

                        <td className="max-w-[220px] truncate px-5 py-4 font-mono text-xs text-slate-500 sm:px-6">
                          {transaction.reference ||
                            transaction.$id}
                        </td>

                        <td className="px-5 py-4 sm:px-6">
                          <Link
                            href={`/admin/transactions/${transaction.$id}`}
                            className="text-sm font-semibold text-[#0F766E] transition hover:text-[#115E59] hover:underline"
                          >
                            View
                          </Link>
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
  );
}

function SummaryCard({
  label,
  value,
  highlight = false,
  positive = false,
  negative = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-bold sm:text-2xl ${
          highlight
            ? "text-[#0F766E]"
            : positive
              ? "text-emerald-600"
              : negative
                ? "text-red-500"
                : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
      <h2 className="text-base font-bold text-slate-900 sm:text-lg">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

function DetailItem({
  label,
  value,
  breakAll = false,
  capitalize = false,
}: {
  label: string;
  value: string;
  breakAll?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1.5 text-sm font-medium text-slate-800 ${
          breakAll ? "break-all" : ""
        } ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center px-6 text-center">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
          {icon}
        </div>
      )}

      <h3 className={`${icon ? "mt-4" : ""} text-sm font-semibold text-slate-900`}>
        {title}
      </h3>

      <p className="mt-1 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}