"use client";

import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
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
      <main className="flex min-h-[60vh] items-center justify-center text-slate-900 dark:text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#0F766E] border-t-transparent dark:border-teal-400 dark:border-t-transparent" />

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Loading transaction...
          </p>
        </div>
      </main>
    );
  }

  if (error || !transaction) {
    return (
      <main className="mx-auto max-w-3xl text-slate-900 dark:text-white">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#0F766E] dark:text-slate-400 dark:hover:text-teal-400"
        >
          <ArrowLeft size={18} />
          Back to Transactions
        </button>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400">
            <XCircle size={24} />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Transaction not found
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {error || "This transaction could not be found."}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 rounded-2xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500"
          >
            Go back
          </button>
        </section>
      </main>
    );
  }

  const incoming = transaction.direction === "in";
  const status = transaction.status.toLowerCase();

  const statusConfig =
    status === "success"
      ? {
          icon: <CheckCircle2 size={15} />,
          className:
            "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
        }
      : status === "pending" || status === "processing"
        ? {
            icon: <Clock3 size={15} />,
            className:
              "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
          }
        : {
            icon: <XCircle size={15} />,
            className:
              "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
          };

  return (
    <main className="mx-auto max-w-3xl text-slate-900 transition-colors dark:text-white">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#0F766E] dark:text-slate-400 dark:hover:text-teal-400"
      >
        <ArrowLeft size={18} />
        Back to Transactions
      </button>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        {/* AMOUNT HEADER */}
        <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-10 text-center transition-colors dark:border-slate-800 dark:bg-slate-800/40 sm:px-8">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
              incoming
                ? "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400"
                : "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400"
            }`}
          >
            {incoming ? (
              <ArrowDownLeft size={30} />
            ) : (
              <ArrowUpRight size={30} />
            )}
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
            {incoming ? "Money received" : "Money sent"}
          </p>

          <h1
            className={`mt-2 text-3xl font-bold sm:text-4xl ${
              incoming
                ? "text-teal-700 dark:text-teal-400"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            {incoming ? "+" : "-"}₦
            {formatMoney(Number(transaction.amount ?? 0))}
          </h1>

          <div className="mt-4 flex justify-center">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusConfig.className}`}
            >
              {statusConfig.icon}
              {transaction.status}
            </span>
          </div>
        </div>

        {/* DETAILS */}
        <div className="p-5 sm:p-8">
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Transaction details
            </h2>

            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Information about this transaction
            </p>
          </div>

          <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 dark:divide-slate-800 dark:border-slate-800">
            <DetailRow
              label="Description"
              value={transaction.title}
            />

            <DetailRow
              label="Transaction type"
              value={transaction.category || transaction.type}
              capitalize
            />

            <DetailRow
              label="Category"
              value={transaction.category}
              capitalize
            />

            <DetailRow
              label="Channel"
              value={transaction.channel}
              capitalize
            />

            <DetailRow
              label="Currency"
              value={transaction.currency}
            />

            <DetailRow
              label="Fees"
              value={`₦${formatMoney(Number(transaction.fees ?? 0))}`}
            />

            <DetailRow
              label="Date"
              value={formatDate(transaction.date)}
            />

            <div className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <p className="shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500">
                Reference
              </p>

              <p className="break-all text-left text-sm font-medium text-slate-700 dark:text-slate-300 sm:text-right">
                {transaction.reference}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function DetailRow({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string | number;
  capitalize?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 px-4 py-4 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
        {label}
      </p>

      <p
        className={`text-sm font-medium text-slate-800 dark:text-slate-200 sm:text-right ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}