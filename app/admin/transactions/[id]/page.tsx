
import { redirect } from "next/navigation";
import Link from "next/link";
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
      <div className="p-8">
        <h1 className="text-2xl font-bold">
          Transaction not found
        </h1>

        <p className="mt-2 text-gray-400">
          This transaction could not be found.
        </p>

        <Link
          href="/admin/transactions"
          className="mt-6 inline-block rounded-lg bg-gray-800 px-5 py-3 hover:bg-gray-700"
        >
          ← Back to Transactions
        </Link>
      </div>
    );
  }

  const transactionUser = transaction.userId
    ? await getUserInfo({
        userId: transaction.userId,
      })
    : null;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold">
            Transaction Details
          </h1>

          <p className="mt-2 text-gray-400">
            Complete information about this transaction.
          </p>
        </div>

        {/* Summary */}
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
            <p className="text-sm text-gray-500">
              Amount
            </p>

            <p className="mt-2 text-2xl font-bold">
              ₦{Number(
                transaction.amount || 0
              ).toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
            <p className="text-sm text-gray-500">
              Status
            </p>

            <p className="mt-2 font-semibold capitalize text-green-400">
              {transaction.status || "Unknown"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
            <p className="text-sm text-gray-500">
              Type
            </p>

            <p className="mt-2 font-semibold capitalize">
              {transaction.type || "—"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
            <p className="text-sm text-gray-500">
              Currency
            </p>

            <p className="mt-2 font-semibold">
              {transaction.currency || "NGN"}
            </p>
          </div>
        </div>

        {/* Sender */}
        <div className="mt-8 rounded-xl border border-gray-700 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold">
            Sender
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="mt-1">
                {transaction.senderName || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 break-all">
                {transaction.senderEmail || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Paystack Customer ID
              </p>

              <p className="mt-1 break-all">
                {transaction.senderId || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Payment Channel
              </p>

              <p className="mt-1 capitalize">
                {transaction.channel || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Receiver */}
        <div className="mt-6 rounded-xl border border-gray-700 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold">
            Receiver
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="mt-1">
                {transaction.receiverName ||
                  [
                    transactionUser?.firstName,
                    transactionUser?.lastName,
                  ]
                    .filter(Boolean)
                    .join(" ") ||
                  "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 break-all">
                {transaction.receiverEmail ||
                  transactionUser?.email ||
                  "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                User ID
              </p>

              <p className="mt-1 break-all">
                {transaction.receiverId ||
                  transaction.userId ||
                  "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mt-6 rounded-xl border border-gray-700 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold">
            Payment Details
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">
                Transaction ID
              </p>

              <p className="mt-1 break-all">
                {transaction.$id}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Paystack Transaction ID
              </p>

              <p className="mt-1">
                {transaction.paystackTransactionId ||
                  "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Reference
              </p>

              <p className="mt-1 break-all">
                {transaction.reference || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Fees
              </p>

              <p className="mt-1">
                ₦{Number(
                  transaction.fees || 0
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Paid At
              </p>

              <p className="mt-1">
                {transaction.paidAt
                  ? new Date(
                      transaction.paidAt
                    ).toLocaleString()
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Created
              </p>

              <p className="mt-1">
                {transaction.$createdAt
                  ? new Date(
                      transaction.$createdAt
                    ).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/transactions"
          className="mt-6 inline-block rounded-lg bg-gray-800 px-5 py-3 text-sm font-medium hover:bg-gray-700"
        >
          ← Back to Transactions
        </Link>
      </div>
    </div>
  );
}

