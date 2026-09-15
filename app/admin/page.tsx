import { redirect } from "next/navigation";
import {
  getAllBankAccounts,
  getAllTransactions,
  getAllUsers,
  getLoggedInUser,
} from "@/lib/actions/user.actions";

export default async function AdminPage() {
  const user = await getLoggedInUser();

  if (!user || user.role?.trim().toLowerCase() !== "admin") {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <p className="text-gray-400">Total Users</p>
            <p className="text-3xl font-bold mt-2">
              {users.length}
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <p className="text-gray-400">
              Bank Accounts
            </p>
            <p className="text-3xl font-bold mt-2">
              {bankAccounts.length}
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <p className="text-gray-400">
              Transactions
            </p>
            <p className="text-3xl font-bold mt-2">
              {transactions.length}
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <p className="text-gray-400">
              Total Balance
            </p>
            <p className="text-2xl font-bold mt-2">
              ₦{totalBalance.toLocaleString()}
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
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>

                    <p className="text-sm text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm">
                      {user.role}
                    </p>

                    <p className="text-sm text-gray-400">
                      ₦
                      {Number(
                        user.balance || 0
                      ).toLocaleString()}
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
                      <td className="p-3 text-sm text-gray-400">
                        {transaction.$id}
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