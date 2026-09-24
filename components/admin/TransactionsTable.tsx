"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Search,
  XCircle,
} from "lucide-react";

type Transaction = {
  $id: string;
  amount?: number | string;
  type?: string;
  status?: string;
  userId?: string;
  reference?: string;
  $createdAt?: string;
};

export default function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        transaction.$id.toLowerCase().includes(searchText) ||
        transaction.userId?.toLowerCase().includes(searchText) ||
        transaction.reference?.toLowerCase().includes(searchText);

      const transactionStatus =
        transaction.status?.trim().toLowerCase() || "";

      const transactionType =
        transaction.type?.trim().toLowerCase() || "";

      const matchesStatus =
        statusFilter === "all" ||
        transactionStatus === statusFilter;

      const matchesType =
        typeFilter === "all" ||
        transactionType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [transactions, search, statusFilter, typeFilter]);

  const formatAmount = (amount: number | string | undefined) =>
    Number(amount || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getStatusIcon = (status: string) => {
    if (status === "success") {
      return <CheckCircle2 size={14} />;
    }

    if (status === "pending") {
      return <Clock3 size={14} />;
    }

    if (status === "failed") {
      return <XCircle size={14} />;
    }

    return null;
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "success":
        return "border-teal-100 bg-teal-50 text-[#0F766E]";

      case "pending":
        return "border-amber-100 bg-amber-50 text-amber-600";

      case "failed":
        return "border-red-100 bg-red-50 text-red-500";

      default:
        return "border-slate-200 bg-slate-50 text-slate-500";
    }
  };

  const getTypeIcon = (type: string) => {
    if (
      type.includes("deposit") ||
      type.includes("credit")
    ) {
      return (
        <ArrowDownLeft
          size={17}
          className="text-[#0F766E]"
        />
      );
    }

    return (
      <ArrowUpRight
        size={17}
        className="text-red-500"
      />
    );
  };

  return (
    <section>
      {/* Filters */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search transaction, user or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-teal-100"
          >
            <option value="all">All statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-teal-100"
          >
            <option value="all">All types</option>
            <option value="deposit">Deposit</option>
            <option value="transfer">Transfer</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="payment">Payment</option>
          </select>
        </div>
      </div>

      {/* Result count */}
      <div className="mb-3 mt-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredTransactions.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {transactions.length}
          </span>{" "}
          transactions
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Transaction
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((transaction) => {
                const status =
                  transaction.status?.trim().toLowerCase() ||
                  "unknown";

                const type =
                  transaction.type?.trim().toLowerCase() ||
                  "";

                return (
                  <tr
                    key={transaction.$id}
                    className="border-b border-slate-100 transition-colors last:border-0 hover:bg-teal-50/30"
                  >
                    {/* Transaction */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                          {getTypeIcon(type)}
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/admin/transactions/${transaction.$id}`}
                            className="block max-w-[280px] truncate text-sm font-semibold text-slate-800 transition hover:text-[#0F766E]"
                          >
                            {transaction.$id}
                          </Link>

                          {transaction.reference && (
                            <p className="mt-1 max-w-[280px] truncate text-xs text-slate-400">
                              Ref: {transaction.reference}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="text-sm font-bold text-slate-900">
                        ₦{formatAmount(transaction.amount)}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold capitalize text-slate-600">
                        {transaction.type || "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold capitalize ${getStatusClasses(
                          status,
                        )}`}
                      >
                        {getStatusIcon(status)}
                        {transaction.status || "Unknown"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                      {transaction.$createdAt
                        ? new Date(
                            transaction.$createdAt,
                          ).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty */}
        {filteredTransactions.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Search size={20} />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              No transactions found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}