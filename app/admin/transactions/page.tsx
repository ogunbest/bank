import { redirect } from "next/navigation";
import {
  getAllTransactions,
  getLoggedInUser,
} from "@/lib/actions/user.actions";
import TransactionsTable from "@/components/admin/TransactionsTable";

export default async function AdminTransactionsPage() {
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

  const transactions = await getAllTransactions();

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold">
          Transactions
        </h1>

        <p className="mt-2 text-gray-400">
          View all transactions processed through Horizon.
        </p>

        <TransactionsTable transactions={transactions as any[]} />
      </div>
    </div>
  );
}