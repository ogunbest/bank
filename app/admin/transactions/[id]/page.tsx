import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { redirect } from "next/navigation";

import {
  getLoggedInUser,
  getTransaction,
  getUserInfo,
} from "@/lib/actions/user.actions";

export default async function TransactionDetailsPage({
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

  const transaction = await getTransaction({
    transactionId: params.id,
  });

  if (!transaction) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <XCircle size={28} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Transaction not found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              This transaction could not be found.
            </p>

            <Link
              href="/admin/transactions"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59]"
            >
              <ArrowLeft size={16} />
              Back to Transactions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const transactionUser = transaction.userId
    ? await getUserInfo({
        userId: transaction.userId,
      })
    : null;

  const status = transaction.status?.toLowerCase() || "unknown";

  const StatusIcon =
    status === "success" || status === "successful"
      ? CheckCircle2
      : status === "pending"
        ? Clock3
        : XCircle;

  const statusClass =
    status === "success" || status === "successful"
      ? "border-emerald-100 bg-emerald-50 text-emerald-600"
      : status === "pending"
        ? "border-amber-100 bg-amber-50 text-amber-600"
        : "border-red-100 bg-red-50 text-red-500";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/admin/transactions"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E] transition hover:text-[#115E59]"
            >
              <ArrowLeft size={16} />
              Back to Transactions
            </Link>

            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0F766E]">
              Administration
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Transaction Details
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Complete information about this transaction.
            </p>
          </div>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${statusClass}`}
          >
            <StatusIcon size={15} />
            <span className="capitalize">
              {transaction.status || "Unknown"}
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Amount"
            value={`₦${Number(transaction.amount || 0).toLocaleString()}`}
            highlight
          />

          <SummaryCard
            label="Status"
            value={transaction.status || "Unknown"}
            capitalize
          />

          <SummaryCard
            label="Type"
            value={transaction.type || "—"}
            capitalize
          />

          <SummaryCard
            label="Currency"
            value={transaction.currency || "NGN"}
          />
        </div>

        {/* Sender */}
        <DetailSection title="Sender">
          <DetailItem
            label="Name"
            value={transaction.senderName || "—"}
          />

          <DetailItem
            label="Email"
            value={transaction.senderEmail || "—"}
            breakAll
          />

          <DetailItem
            label="Paystack Customer ID"
            value={transaction.senderId || "—"}
            breakAll
          />

          <DetailItem
            label="Payment Channel"
            value={transaction.channel || "—"}
            capitalize
          />
        </DetailSection>

        {/* Receiver */}
        <DetailSection title="Receiver">
          <DetailItem
            label="Name"
            value={
              transaction.receiverName ||
              [
                transactionUser?.firstName,
                transactionUser?.lastName,
              ]
                .filter(Boolean)
                .join(" ") ||
              "—"
            }
          />

          <DetailItem
            label="Email"
            value={
              transaction.receiverEmail ||
              transactionUser?.email ||
              "—"
            }
            breakAll
          />

          <DetailItem
            label="User ID"
            value={
              transaction.receiverId ||
              transaction.userId ||
              "—"
            }
            breakAll
          />
        </DetailSection>

        {/* Payment Details */}
        <DetailSection title="Payment Details">
          <DetailItem
            label="Transaction ID"
            value={transaction.$id}
            breakAll
          />

          <DetailItem
            label="Paystack Transaction ID"
            value={transaction.paystackTransactionId || "—"}
          />

          <DetailItem
            label="Reference"
            value={transaction.reference || "—"}
            breakAll
          />

          <DetailItem
            label="Fees"
            value={`₦${Number(transaction.fees || 0).toLocaleString()}`}
          />

          <DetailItem
            label="Paid At"
            value={
              transaction.paidAt
                ? new Date(transaction.paidAt).toLocaleString()
                : "—"
            }
          />

          <DetailItem
            label="Created"
            value={
              transaction.$createdAt
                ? new Date(transaction.$createdAt).toLocaleString()
                : "—"
            }
          />
        </DetailSection>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight = false,
  capitalize = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-bold ${
          highlight ? "text-[#0F766E]" : "text-slate-900"
        } ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">
          {title}
        </h2>
      </div>

      <div className="grid gap-x-8 gap-y-6 px-5 py-6 sm:grid-cols-2 sm:px-6">
        {children}
      </div>
    </section>
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