"use client";

import Link from "next/link";
import { ArrowRight, ReceiptText } from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { BankTabItem } from "./BankTabItem";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";
import { Pagination } from "./Pagination";

const RecentTransactions = ({
  accounts,
  transactions = [],
  appwriteItemId,
  page = 1,
}: RecentTransactionsProps) => {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction =
    indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction,
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <header className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
            <ReceiptText size={19} />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              Recent transactions
            </h2>

            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Review activity across your accounts.
            </p>
          </div>
        </div>

        <Link
          href={`/dashboard/transactions?id=${appwriteItemId}`}
          className="inline-flex w-fit items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-[#0F766E] transition hover:bg-teal-50"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </header>

      <div className="p-4 sm:p-6">
        <Tabs defaultValue={appwriteItemId} className="w-full">
          {/* Account tabs */}
          <TabsList className="mb-5 flex h-auto w-full gap-2 overflow-x-auto rounded-2xl bg-slate-50 p-1.5">
            {accounts.map((account: Account) => (
              <TabsTrigger
                key={account.id}
                value={account.appwriteItemId}
                className="shrink-0 rounded-xl px-3 py-2 data-[state=active]:bg-white data-[state=active]:text-[#0F766E] data-[state=active]:shadow-sm"
              >
                <BankTabItem
                  account={account}
                  appwriteItemId={appwriteItemId}
                />
              </TabsTrigger>
            ))}
          </TabsList>

          {accounts.map((account: Account) => (
            <TabsContent
              value={account.appwriteItemId}
              key={account.id}
              className="mt-0 space-y-5"
            >
              {/* Account information */}
              <BankInfo
                account={account}
                appwriteItemId={appwriteItemId}
                type="full"
              />

              {/* Transactions */}
              {currentTransactions.length > 0 ? (
                <TransactionsTable
                  transactions={currentTransactions}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                    <ReceiptText size={21} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-slate-700">
                    No transactions yet
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Transactions for this account will appear here.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-1">
                  <Pagination
                    totalPages={totalPages}
                    page={page}
                  />
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default RecentTransactions;