"use client";

import { ArrowLeft, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/components/dashboard/useDashboardData";

const formatMoney = (amount: number) =>
  amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleString("en-NG", {
        dateStyle: "full",
        timeStyle: "short",
      });
};

export default function TransactionDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data, loading, error } = useDashboardData();

  const transaction = data?.transactions.find(
    (item) => item.id === params.id,
  );

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto py-10 px-4 text-gray-400">
        Loading transaction...
      </main>
    );
  }

  if (error || !transaction) {
    return (
      <main className="max-w-3xl mx-auto py-10 px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white">
            Transaction not found
          </h1>
          <p className="text-gray-400 mt-2">
            {error || "This transaction could not be found."}
          </p>
        </div>
      </main>
    );
  }

  const incoming = transaction.direction === "in";
  const successful = transaction.status.toLowerCase() === "success";

  return (
    <main className="max-w-3xl mx-auto py-8 px-4 lg:px-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft size={18} />
        Back to Transactions
      </button>

      <section className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-8 text-center border-b border-gray-700 bg-gray-900">
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              incoming ? "bg-emerald-500/10" : "bg-red-500/10"
            }`}
          >
            {incoming ? (
              <ArrowDownLeft size={30} className="text-emerald-400" />
            ) : (
              <ArrowUpRight size={30} className="text-red-400" />
            )}
          </div>

          <p className="text-gray-400 mt-5">
            {incoming ? "Money received" : "Money sent"}
          </p>

          <h1
            className={`text-3xl font-bold mt-2 ${
              incoming ? "text-emerald-400" : "text-red-400"
            }`}
          >
           {incoming ? "+" : "-"}NGN {formatMoney(transaction.amount)}
          </h1>

          <span
            className={`inline-block mt-4 px-3 py-1 rounded-full text-xs ${
              successful
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-yellow-500/10 text-yellow-400"
            }`}
          >
            {transaction.status}
          </span>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-white mt-1">{transaction.title}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Transaction type</p>
            <p className="text-white mt-1 capitalize">
              {transaction.type}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Reference</p>
            <p className="text-white mt-1 break-all">
              {transaction.reference}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="text-white mt-1">
              {formatDate(transaction.date)}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

