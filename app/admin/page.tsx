import { redirect } from "next/navigation";
import Link from "next/link";
import {
  getAllBankAccounts,
  getAllTransactions,
  getAllUsers,
  getLoggedInUser,
} from "@/lib/actions/user.actions";

export default async function AdminPage() {
  const user = await getLoggedInUser();

const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const userEmail = user?.email?.trim().toLowerCase();

if (
  !user ||
  !adminEmail ||
  userEmail !== adminEmail ||
  user.role?.trim().toLowerCase() !== "admin"
) {
  redirect("/dashboard");
}

  const users = await getAllUsers();
  const bankAccounts = await getAllBankAccounts();
  const transactions = await getAllTransactions();

  const totalBalance = users.reduce(
  (total: number, user: any) =>
    total + Number(user.balance || 0),
  0
);

const totalDeposits = transactions
  .filter(
    (transaction: any) =>
      transaction.type?.toLowerCase() === "deposit"
  )
  .reduce(
    (total: number, transaction: any) =>
      total + Number(transaction.amount || 0),
    0
  );

const totalWithdrawals = transactions
  .filter(
    (transaction: any) =>
      transaction.type?.toLowerCase() === "withdrawal"
  )
  .reduce(
    (total: number, transaction: any) =>
      total + Number(transaction.amount || 0),
    0
  );

const totalTransfers = transactions
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Welcome to the Horizon administration panel.
        </p>

        {/* Statistics */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
  <div className="bg-gray-800 rounded-xl p-6">
    <p className="text-gray-400">Total Users</p>
    <p className="text-3xl font-bold mt-2">
      {users.length}
    </p>
  </div>

  <div className="bg-gray-800 rounded-xl p-6">
    <p className="text-gray-400">Bank Accounts</p>
    <p className="text-3xl font-bold mt-2">
      {bankAccounts.length}
    </p>
  </div>

  <div className="bg-gray-800 rounded-xl p-6">
    <p className="text-gray-400">Transactions</p>
    <p className="text-3xl font-bold mt-2">
      {transactions.length}
    </p>
  </div>

  <div className="bg-gray-800 rounded-xl p-6">
    <p className="text-gray-400">Total Customer Funds</p>
    <p className="text-2xl font-bold mt-2">
      ₦{totalBalance.toLocaleString("en-NG")}
    </p>
  </div>

  <div className="bg-gray-800 rounded-xl p-6">
    <p className="text-gray-400">Total Deposits</p>
    <p className="text-2xl font-bold mt-2 text-green-400">
      ₦{totalDeposits.toLocaleString("en-NG")}
    </p>
  </div>

  <div className="bg-gray-800 rounded-xl p-6">
    <p className="text-gray-400">Total Withdrawals</p>
    <p className="text-2xl font-bold mt-2 text-red-400">
      ₦{totalWithdrawals.toLocaleString("en-NG")}
    </p>
  </div>

  <div className="bg-gray-800 rounded-xl p-6">
    <p className="text-gray-400">Total Transfers</p>
    <p className="text-2xl font-bold mt-2">
      ₦{totalTransfers.toLocaleString("en-NG")}
    </p>
  </div>
</div>

        {/* Recent Users */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold">
            Recent Users
          </h2>

          <div className="mt-4 space-y-3">
            {users
              .slice(-5)
              .reverse()
              .map((user: any) => (
                <div
                  key={user.$id}
                  className="flex justify-between items-center border-b border-gray-700 pb-3"
                >
                  <div>
                    <Link
  href={`/admin/users/${user.$id}`}
  className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
>
  {user.firstName} {user.lastName}
</Link>

                    <p className="text-sm text-gray-400">
                      {user.email}
                    </p>
                  </div>
<div className="text-right">
  <p className="text-sm">
    {user.role || "user"}
  </p>

  <p className="text-sm">
    {user.status || "active"}
  </p>

  <p className="text-sm text-gray-400">
    ₦
    {Number(
      user.balance || 0
    ).toLocaleString("en-NG")}
  </p>
</div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold">
            Recent Transactions
          </h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-3">ID</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {transactions
                  .slice(-5)
                  .reverse()
                  .map((transaction: any) => (
                    <tr
                      key={transaction.$id}
                      className="border-b border-gray-700"
                    >
                      <td className="p-3 text-sm">
  <Link
    href={`/admin/transactions/${transaction.$id}`}
    className="text-blue-400 hover:text-blue-300 hover:underline"
  >
    {transaction.$id}
  </Link>
</td>

                      <td className="p-3">
                        ₦
                        {Number(
                          transaction.amount || 0
                        ).toLocaleString()}
                      </td>

                      <td className="p-3">
                        {transaction.type || "—"}
                      </td>

                      <td className="p-3">
                        {transaction.status || "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {transactions.length === 0 && (
              <p className="text-gray-400 py-4">
                No transactions yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}