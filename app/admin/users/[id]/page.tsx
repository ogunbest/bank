/* eslint-disable @typescript-eslint/no-explicit-any */
import UserStatusButton from "@/components/admin/UserStatusButton";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getAllBankAccounts,
  getAllTransactions,
  getAllUsers,
  getLoggedInUser,
} from "@/lib/actions/user.actions";

export default async function AdminUserDetailsPage({
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

  const users = await getAllUsers();
const bankAccounts = await getAllBankAccounts();
const transactions = await getAllTransactions();

const user = users.find(
  (item: any) => item.$id === params.id
);

if (!user) {
  notFound();
}

const userBankAccounts = bankAccounts.filter(
  (bank: any) => bank.userId === user.userId
);

const userTransactions = transactions.filter(
  (transaction: any) =>
    transaction.userId === user.userId ||
    transaction.senderId === user.userId ||
    transaction.receiverId === user.userId
);

const totalDeposits = userTransactions
  .filter(
    (transaction: any) =>
      transaction.type?.toLowerCase() === "deposit"
  )
  .reduce(
    (total: number, transaction: any) =>
      total + Number(transaction.amount || 0),
    0
  );

const totalWithdrawals = userTransactions
  .filter(
    (transaction: any) =>
      transaction.type?.toLowerCase() === "withdrawal"
  )
  .reduce(
    (total: number, transaction: any) =>
      total + Number(transaction.amount || 0),
    0
  );

const totalTransfers = userTransactions
  .filter(
    (transaction: any) =>
      transaction.type?.toLowerCase() === "transfer"
  )
  .reduce(
    (total: number, transaction: any) =>
      total + Number(transaction.amount || 0),
    0
  );

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/users"
          className="text-gray-400 hover:text-white"
        >
          ← Back to Users
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold">
            User Details
          </h1>

          <p className="text-gray-400 mt-2">
            View account information for this user.
          </p>
        </div>

        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm">
                First Name
              </p>
              <p className="mt-1 text-lg">
                {user.firstName || "—"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Last Name
              </p>
              <p className="mt-1 text-lg">
                {user.lastName || "—"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Email
              </p>
              <p className="mt-1 text-lg">
                {user.email || "—"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Role
              </p>
              <p className="mt-1 text-lg">
                {user.role?.trim() || "—"}
              </p>
            </div>

            <div className="mt-6 bg-gray-800 rounded-xl p-6">
  <p className="text-gray-400 text-sm">
    Account Status
  </p>

  <p className="mt-2 text-lg font-semibold">
    {user.status?.trim() || "active"}
  </p>

  <UserStatusButton
    userId={user.$id}
    currentStatus={user.status || "active"}
  />
</div>

            <div>
              <p className="text-gray-400 text-sm">
                City
              </p>
              <p className="mt-1 text-lg">
                {user.city || "—"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                State
              </p>
              <p className="mt-1 text-lg">
                {user.state || "—"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Address
              </p>
              <p className="mt-1 text-lg">
                {user.address1 || "—"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Balance
              </p>
              <p className="mt-1 text-lg font-semibold">
                ₦
                {Number(
                  user.balance || 0
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">
            User ID
          </p>

          <p className="mt-2 font-mono text-sm break-all">
            {user.$id}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <div className="bg-gray-800 rounded-xl p-6">
    <p className="text-gray-400 text-sm">
      Current Balance
    </p>
    <p className="mt-2 text-2xl font-bold">
      ₦{Number(user.balance || 0).toLocaleString("en-NG")}
    </p>
  </div>

  <div className="bg-gray-800 rounded-xl p-6">
    <p className="text-gray-400 text-sm">
      Total Deposits
    </p>
    <p className="mt-2 text-2xl font-bold text-green-400">
      ₦{totalDeposits.toLocaleString("en-NG")}
    </p>
  </div>

  <div className="bg-gray-800 rounded-xl p-6">
    <p className="text-gray-400 text-sm">
      Total Withdrawals
    </p>
    <p className="mt-2 text-2xl font-bold text-red-400">
      ₦{totalWithdrawals.toLocaleString("en-NG")}
    </p>
  </div>

  <div className="bg-gray-800 rounded-xl p-6">
    <p className="text-gray-400 text-sm">
      Total Transfers
    </p>
    <p className="mt-2 text-2xl font-bold">
      ₦{totalTransfers.toLocaleString("en-NG")}
    </p>
  </div>
</div>
<div className="mt-6 bg-gray-800 rounded-xl p-6">
  <h2 className="text-xl font-semibold">
    Linked Bank Accounts
  </h2>

  {userBankAccounts.length === 0 ? (
    <p className="mt-4 text-gray-400">
      No bank accounts linked.
    </p>
  ) : (
    <div className="mt-4 space-y-4">
      {userBankAccounts.map((bank: any) => (
        <div
          key={bank.$id}
          className="border border-gray-700 rounded-xl p-4"
        >
          <p className="font-semibold">
            {bank.bankName || "Bank Account"}
          </p>

          <p className="text-gray-400 mt-1">
            {bank.accountName || "—"}
          </p>

          <p className="text-gray-400 text-sm mt-1">
            Account: ••••{" "}
            {String(bank.accountNumber || "").slice(-4)}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
<div className="mt-6 bg-gray-800 rounded-xl p-6">
  <h2 className="text-xl font-semibold">
    Customer Activity
  </h2>

  {userTransactions.length === 0 ? (
    <p className="mt-4 text-gray-400">
      No transactions yet.
    </p>
  ) : (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-3">Type</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Reference</th>
            <th className="p-3">Details</th>
          </tr>
        </thead>

        <tbody>
          {userTransactions.map((transaction: any) => (
            <tr
              key={transaction.$id}
              className="border-b border-gray-700"
            >
              <td className="p-3">
                {transaction.type || "—"}
              </td>

              <td className="p-3">
                ₦
                {Number(
                  transaction.amount || 0
                ).toLocaleString("en-NG")}
              </td>

              <td className="p-3">
                {transaction.status || "—"}
              </td>

              <td className="p-3 text-sm text-gray-400">
  {transaction.reference || transaction.$id}
</td>

<td className="p-3">
  <Link
    href={`/admin/transactions/${transaction.$id}`}
    className="text-blue-400 hover:text-blue-300 hover:underline"
  >
    View
  </Link>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
      </div>
    </div>
  );
}