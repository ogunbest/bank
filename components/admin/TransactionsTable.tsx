"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
const searchText = search.toLowerCase();


  const matchesSearch =
    !search ||
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

return (
<> <div className="mt-8 grid gap-4 md:grid-cols-3">
<input
type="text"
placeholder="Search transaction, user or reference..."
value={search}
onChange={(e) => setSearch(e.target.value)}
className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-gray-500"
/>


    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none"
    >
      <option value="all">All statuses</option>
      <option value="success">Success</option>
      <option value="pending">Pending</option>
      <option value="failed">Failed</option>
    </select>

    <select
      value={typeFilter}
      onChange={(e) => setTypeFilter(e.target.value)}
      className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none"
    >
      <option value="all">All types</option>
      <option value="deposit">Deposit</option>
      <option value="transfer">Transfer</option>
      <option value="withdrawal">Withdrawal</option>
      <option value="payment">Payment</option>
    </select>
  </div>

  <div className="mb-3 mt-6 text-sm text-gray-400">
    Showing {filteredTransactions.length} of{" "}
    {transactions.length} transactions
  </div>

  <div className="overflow-x-auto rounded-xl border border-gray-700">
    <table className="w-full text-left">
      <thead className="bg-gray-800">
        <tr>
          <th className="p-4">Transaction</th>
          <th className="p-4">Amount</th>
          <th className="p-4">Type</th>
          <th className="p-4">Status</th>
          <th className="p-4">Date</th>
        </tr>
      </thead>

      <tbody>
        {filteredTransactions.map((transaction) => {
          const status =
            transaction.status?.trim().toLowerCase() || "unknown";

          return (
            <tr
              key={transaction.$id}
              className="border-t border-gray-700 hover:bg-gray-800/50"
            >
              <td className="p-4">
                <Link
                  href={`/admin/transactions/${transaction.$id}`}
                  className="inline-block cursor-pointer font-medium text-blue-400 hover:text-blue-300 hover:underline"
                >
                  {transaction.$id}
                </Link>

                {transaction.reference && (
                  <div className="mt-1 text-xs text-gray-500">
                    Ref: {transaction.reference}
                  </div>
                )}
              </td>

              <td className="p-4 font-medium">
                ₦
                {Number(
                  transaction.amount || 0
                ).toLocaleString()}
              </td>

              <td className="p-4 capitalize">
                {transaction.type || "—"}
              </td>

              <td className="p-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    status === "success"
                      ? "bg-green-500/10 text-green-400"
                      : status === "pending"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : status === "failed"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-gray-500/10 text-gray-400"
                  }`}
                >
                  {transaction.status || "Unknown"}
                </span>
              </td>

              <td className="p-4 text-gray-400">
                {transaction.$createdAt
                  ? new Date(
                      transaction.$createdAt
                    ).toLocaleDateString()
                  : "—"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>

    {filteredTransactions.length === 0 && (
      <p className="p-6 text-gray-400">
        No transactions match your search or filters.
      </p>
    )}
  </div>
</>


);
}
