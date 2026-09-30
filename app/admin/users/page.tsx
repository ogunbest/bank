import Link from "next/link";
import { ArrowUpRight, Users, UserRound } from "lucide-react";
import { redirect } from "next/navigation";

import { getAllUsers, getLoggedInUser } from "@/lib/actions/user.actions";

export default async function AdminUsersPage() {
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

  const activeUsers = users.filter(
    (item) => item.status?.trim().toLowerCase() !== "disabled",
  ).length;

  const disabledUsers = users.filter(
    (item) => item.status?.trim().toLowerCase() === "disabled",
  ).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0F766E] dark:text-teal-400">
            Administration
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Users
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Manage registered Covenant customers and monitor account access.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard
            icon={<Users size={20} />}
            label="Total users"
            value={users.length.toLocaleString("en-NG")}
          />

          <SummaryCard
            label="Active users"
            value={activeUsers.toLocaleString("en-NG")}
            positive
          />

          <SummaryCard
            label="Disabled users"
            value={disabledUsers.toLocaleString("en-NG")}
            negative
          />
        </div>

        {/* Users table */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
              Registered Users
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select a customer to view their profile, linked accounts, and
              transaction activity.
            </p>
          </div>

          {users.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
                <UserRound size={25} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                No users found
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Registered users will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[950px] w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60">
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Balance</TableHeader>
                    <TableHeader>Role</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>City</TableHeader>
                    <TableHeader>Activity</TableHeader>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((customer) => {
                    const status =
                      customer.status?.trim().toLowerCase() || "active";

                    const isDisabled = status === "disabled";

                    const fullName =
                      [customer.firstName, customer.lastName]
                        .filter(Boolean)
                        .join(" ") || "Unnamed User";

                    return (
                      <tr
                        key={customer.$id}
                        className="transition-colors hover:bg-teal-50/40 dark:hover:bg-teal-950/20"
                      >
                        {/* Name */}
                        <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                          <Link
                            href={`/admin/users/${customer.$id}`}
                            className="group flex items-center gap-3"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 font-bold text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
                              {(
                                customer.firstName?.charAt(0) ||
                                customer.email?.charAt(0) ||
                                "U"
                              ).toUpperCase()}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#0F766E] dark:text-white dark:group-hover:text-teal-400">
                                {fullName}
                              </p>

                              <p className="text-xs text-slate-400">
                                User account
                              </p>
                            </div>
                          </Link>
                        </td>

                        {/* Email */}
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600 dark:text-slate-400 sm:px-6">
                          {customer.email || "—"}
                        </td>

                        {/* Balance */}
                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white sm:px-6">
                          ₦
                          {Number(
                            customer.balance || 0,
                          ).toLocaleString("en-NG")}
                        </td>

                        {/* Role */}
                        <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                          <span className="inline-flex rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-xs font-semibold capitalize text-[#0F766E] dark:border-teal-900/60 dark:bg-teal-950/50 dark:text-teal-400">
                            {customer.role?.trim() || "Customer"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                              isDisabled
                                ? "border-red-100 bg-red-50 text-red-500 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400"
                                : "border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isDisabled
                                  ? "bg-red-500 dark:bg-red-400"
                                  : "bg-emerald-500 dark:bg-emerald-400"
                              }`}
                            />

                            {isDisabled ? "Disabled" : "Active"}
                          </span>
                        </td>

                        {/* City */}
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600 dark:text-slate-400 sm:px-6">
                          {customer.city || "—"}
                        </td>

                        {/* Activity */}
                        <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                          <Link
                            href={`/admin/users/${customer.$id}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] transition hover:text-[#115E59] dark:text-teal-400 dark:hover:text-teal-300"
                          >
                            View activity
                            <ArrowUpRight size={15} />
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
  icon,
  label,
  value,
  positive = false,
  negative = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
          {icon}
        </div>
      )}

      <p
        className={`text-xs font-medium uppercase tracking-wide text-slate-400 ${
          icon ? "mt-4" : ""
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${
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

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:px-6">
      {children}
    </th>
  );
}