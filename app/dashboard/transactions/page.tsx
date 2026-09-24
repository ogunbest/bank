"use client";

import { useRouter } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Search,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import FinancialInsights from "@/components/dashboard/financialInsights";
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
        dateStyle: "medium",
        timeStyle: "short",
      });
};

export default function TransactionsPage() {
  const { data, error, loading } = useDashboardData();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

 const allTransactions = useMemo(
  () => data?.transactions ?? [],
  [data?.transactions],
);

  const transactions = useMemo(
    () =>
      allTransactions.filter((transaction) => {
        const searchable = `${transaction.title} ${transaction.type} ${transaction.reference}`
          .toLowerCase()
          .includes(search.trim().toLowerCase());

        const matchesFilter =
          filter === "all" ||
          (filter === "incoming" && transaction.direction === "in") ||
          (filter === "outgoing" && transaction.direction === "out");

        const matchesStatus =
          statusFilter === "all" ||
          transaction.status.toLowerCase() === statusFilter;

        return searchable && matchesFilter && matchesStatus;
      }),
    [allTransactions, filter, search, statusFilter],
  );

  const moneyIn = allTransactions
    .filter((transaction) => transaction.direction === "in")
    .reduce(
      (total, transaction) => total + Number(transaction.amount ?? 0),
      0,
    );

  const moneyOut = allTransactions
    .filter((transaction) => transaction.direction === "out")
    .reduce(
      (total, transaction) => total + Number(transaction.amount ?? 0),
      0,
    );

  const successfulCount = allTransactions.filter(
    (transaction) => transaction.status.toLowerCase() === "success",
  ).length;

  return (
    <div className="space-y-7">
      {/* HEADER */}
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Transactions
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Review and manage activity on your account.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </section>

      {/* SUMMARY */}
      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Money In"
          value={`₦${formatMoney(moneyIn)}`}
          icon={<ArrowDownLeft size={19} />}
          iconClass="bg-teal-50 text-teal-600"
        />

        <SummaryCard
          label="Money Out"
          value={`₦${formatMoney(moneyOut)}`}
          icon={<ArrowUpRight size={19} />}
          iconClass="bg-red-50 text-red-500"
        />

        <SummaryCard
          label="Successful"
          value={successfulCount.toString()}
          icon={<CheckCircle2 size={19} />}
          iconClass="bg-slate-100 text-slate-600"
        />
      </section>

      {/* FILTERS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* SEARCH */}
          <label className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transactions..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:bg-white"
            />
          </label>

          {/* DIRECTION */}
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-600 outline-none focus:border-[#0F766E]"
          >
            <option value="all">All transactions</option>
            <option value="incoming">Money in</option>
            <option value="outgoing">Money out</option>
          </select>

          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-600 outline-none focus:border-[#0F766E]"
          >
            <option value="all">All statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </section>

      {/* TRANSACTION TABLE */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <h2 className="font-bold text-slate-900">
            Transaction History
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {transactions.length} transaction
            {transactions.length === 1 ? "" : "s"} found
          </p>
        </div>

        {/* DESKTOP HEADER */}
        <div className="hidden grid-cols-12 gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 md:grid">
          <div className="col-span-4">Transaction</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-4 border-[#0F766E] border-t-transparent" />

            <p className="mt-3 text-sm text-slate-500">
              Loading transactions...
            </p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Search size={20} />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-700">
              No matching transactions
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((transaction) => {
              const incoming = transaction.direction === "in";
              const status = transaction.status.toLowerCase();

              return (
                <article
                  key={transaction.id}
                  onClick={() =>
                    router.push(
                      `/dashboard/transactions/${transaction.id}`,
                    )
                  }
                  className="cursor-pointer px-5 py-4 transition hover:bg-slate-50 sm:px-6 md:grid md:grid-cols-12 md:items-center md:gap-4"
                >
                  {/* TRANSACTION */}
                  <div className="flex min-w-0 items-center gap-3 md:col-span-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        incoming
                          ? "bg-teal-50 text-teal-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {incoming ? (
                        <ArrowDownLeft size={18} />
                      ) : (
                        <ArrowUpRight size={18} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {transaction.title}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        Ref: {transaction.reference}
                      </p>
                    </div>
                  </div>

                  {/* MOBILE META */}
                  <div className="mt-3 flex items-center justify-between md:hidden">
                    <div>
                      <p className="text-xs capitalize text-slate-500">
                        {transaction.type}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {formatDate(transaction.date)}
                      </p>
                    </div>

                    <TransactionStatus status={status}>
                      {transaction.status}
                    </TransactionStatus>
                  </div>

                  {/* DESKTOP TYPE */}
                  <p className="hidden capitalize text-sm text-slate-500 md:col-span-2 md:block">
                    {transaction.type}
                  </p>

                  {/* DESKTOP DATE */}
                  <p className="hidden text-sm text-slate-500 md:col-span-2 md:block">
                    {formatDate(transaction.date)}
                  </p>

                  {/* DESKTOP STATUS */}
                  <div className="hidden md:col-span-2 md:block">
                    <TransactionStatus status={status}>
                      {transaction.status}
                    </TransactionStatus>
                  </div>

                  {/* AMOUNT */}
                  <p
                    className={`mt-3 text-right text-sm font-bold md:col-span-2 md:mt-0 ${
                      incoming ? "text-teal-600" : "text-red-500"
                    }`}
                  >
                    {incoming ? "+" : "-"}₦
                    {formatMoney(Number(transaction.amount ?? 0))}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* FINANCIAL INSIGHTS */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <h2 className="font-bold text-slate-900">
            Financial Insights
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Understand your income, spending and cash flow.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <FinancialInsights
            transactions={allTransactions}
            balance={data?.balance ?? 0}
          />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  iconClass,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function TransactionStatus({
  status,
  children,
}: {
  status: string;
  children: React.ReactNode;
}) {
  const config =
    status === "success"
      ? {
          icon: <CheckCircle2 size={13} />,
          className: "bg-teal-50 text-teal-600",
        }
      : status === "pending"
        ? {
            icon: <Clock3 size={13} />,
            className: "bg-amber-50 text-amber-600",
          }
        : {
            icon: <XCircle size={13} />,
            className: "bg-red-50 text-red-500",
          };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${config.className}`}
    >
      {config.icon}
      {children}
    </span>
  );
}