"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, UserRound } from "lucide-react";

const userData = [
  {
    id: 1,
    name: "Ada",
    email: "ada@example.com",
    role: "Customer",
    status: "Active",
  },
  {
    id: 2,
    name: "Prince",
    email: "prince@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 3,
    name: "Bobo",
    email: "bob@example.com",
    role: "Customer",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Alice",
    email: "alice@example.com",
    role: "Customer",
    status: "Active",
  },
  {
    id: 5,
    name: "Joseph",
    email: "joseph@example.com",
    role: "Moderator",
    status: "Active",
  },
];

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = userData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <motion.div
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
            Management
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
            Users
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage registered users and account access.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-[#0F766E]/10"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
            <UserRound size={22} />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            No users found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Try searching with a different name or email.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                  User
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                  Role
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="transition-colors hover:bg-teal-50/40"
                >
                  <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 font-bold text-[#0F766E]">
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          User #{user.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600 sm:px-6">
                    {user.email}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                    <span className="inline-flex rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-[#0F766E]">
                      {user.role}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.status === "Active"
                          ? "border border-emerald-100 bg-emerald-50 text-emerald-600"
                          : "border border-red-100 bg-red-50 text-red-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.status === "Active"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm sm:px-6">
                    <button
                      type="button"
                      className="mr-3 font-semibold text-[#0F766E] transition hover:text-[#115E59]"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="font-semibold text-red-500 transition hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default UsersTable;