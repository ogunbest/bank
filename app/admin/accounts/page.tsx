
/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import {
  getAllBankAccounts,
  getLoggedInUser,
} from "@/lib/actions/user.actions";

export default async function AdminAccountsPage() {
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

  const accounts = await getAllBankAccounts();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">
          Bank Accounts
        </h1>

        <p className="text-gray-400 mt-2">
          View all bank accounts connected to Covenant.
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4">Account Name</th>
                <th className="p-4">Account Number</th>
                <th className="p-4">Bank</th>
                <th className="p-4">Bank Code</th>
                <th className="p-4">User ID</th>
              </tr>
            </thead>

            <tbody>
              {accounts.map((account: any) => (
                <tr
                  key={account.$id}
                  className="border-t border-gray-700"
                >
                  <td className="p-4">
                    {account.accountName || "—"}
                  </td>

                  <td className="p-4">
                    {account.accountNumber || "—"}
                  </td>

                  <td className="p-4">
                    {account.bankName || "—"}
                  </td>

                  <td className="p-4">
                    {account.bankCode || "—"}
                  </td>

                  <td className="p-4 text-gray-400">
                    {account.userId || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {accounts.length === 0 && (
            <p className="p-6 text-gray-400">
              No bank accounts found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
