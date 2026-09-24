"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleCheck,
  Clock3,
  ReceiptText,
  XCircle,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transactionCategoryStyles } from "@/constants";
import {
  cn,
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from "@/lib/utils";

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const styles =
    transactionCategoryStyles[
      category as keyof typeof transactionCategoryStyles
    ] || transactionCategoryStyles.default;

  const status = category.toLowerCase();

  const Icon =
    status === "completed" || status === "success"
      ? CircleCheck
      : status === "pending"
        ? Clock3
        : status === "failed" || status === "declined"
          ? XCircle
          : null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1",
        styles.borderColor,
        styles.chipBackgroundColor,
      )}
    >
      <div
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          styles.backgroundColor,
        )}
      />

      {Icon && (
        <Icon
          size={13}
          className={styles.textColor}
        />
      )}

      <span
        className={cn(
          "text-xs font-semibold capitalize",
          styles.textColor,
        )}
      >
        {category}
      </span>
    </div>
  );
};

const TransactionsTable = ({
  transactions,
}: TransactionTableProps) => {
  if (!transactions?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
          <ReceiptText size={21} />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-700">
          No transactions yet
        </h3>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Your account activity will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200">
      <Table className="min-w-[760px]">
        <TableHeader className="bg-slate-50">
          <TableRow className="border-slate-200 hover:bg-slate-50">
            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Transaction
            </TableHead>

            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Amount
            </TableHead>

            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </TableHead>

            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date
            </TableHead>

            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Channel
            </TableHead>

            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Category
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((t: Transaction) => {
            const status = getTransactionStatus(new Date(t.date));
            const amount = formatAmount(t.amount);

            const isDebit = t.type === "debit";
            const isCredit = t.type === "credit";

            const displayAmount = isDebit
              ? `-${amount}`
              : isCredit
                ? `+${amount}`
                : amount;

            return (
              <TableRow
                key={t.id}
                className="border-slate-100 transition-colors hover:bg-teal-50/40"
              >
                {/* Transaction */}
                <TableCell className="max-w-[240px] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                        isDebit
                          ? "bg-red-50 text-red-500"
                          : "bg-teal-50 text-[#0F766E]",
                      )}
                    >
                      {isDebit ? (
                        <ArrowUpRight size={17} />
                      ) : (
                        <ArrowDownLeft size={17} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {removeSpecialCharacters(t.name)}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {isDebit ? "Money sent" : "Money received"}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Amount */}
                <TableCell
                  className={cn(
                    "whitespace-nowrap px-4 py-4 text-sm font-bold",
                    isDebit
                      ? "text-red-500"
                      : "text-[#0F766E]",
                  )}
                >
                  {displayAmount}
                </TableCell>

                {/* Status */}
                <TableCell className="px-4 py-4">
                  <CategoryBadge category={status} />
                </TableCell>

                {/* Date */}
                <TableCell className="whitespace-nowrap px-4 py-4">
                  <p className="text-sm font-medium text-slate-700">
                    {formatDateTime(new Date(t.date)).dateTime}
                  </p>
                </TableCell>

                {/* Channel */}
                <TableCell className="px-4 py-4">
                  <span className="text-sm capitalize text-slate-500">
                    {t.paymentChannel || "—"}
                  </span>
                </TableCell>

                {/* Category */}
                <TableCell className="px-4 py-4">
                  {t.category ? (
                    <CategoryBadge category={t.category} />
                  ) : (
                    <span className="text-sm text-slate-400">
                      —
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;