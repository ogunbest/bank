import { redirect } from "next/navigation";
import {
  getAllUsers,
  getLoggedInUser,
} from "@/lib/actions/user.actions";
import Link from "next/link";

export default async function AdminUsersPage() {
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Users</h1>

        <p className="text-gray-400 mt-2">
          Manage all registered Horizon users.
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-800">
              <tr>
  <th className="p-4">Name</th>
  <th className="p-4">Email</th>
  <th className="p-4">Balance</th>
  <th className="p-4">Role</th>
  <th className="p-4">Status</th>
  <th className="p-4">City</th>
  <th className="p-4">Activity</th>
</tr>
            </thead>

            <tbody>
              {users.map((user: any) => (
                <tr
                  key={user.$id}
                  className="border-t border-gray-700"
                >
                  <td className="p-4">
  <Link
    href={`/admin/users/${user.$id}`}
    className="font-medium hover:underline"
  >
    {user.firstName} {user.lastName}
  </Link>
</td>

                  <td className="p-4 text-gray-300">
                    {user.email}
                  </td>
                  <td className="p-4 font-medium">
  ₦{Number(user.balance || 0).toLocaleString("en-NG")}
</td>

                  <td className="p-4">
                    {user.role}
                  </td>
                  <td className="p-4">
  {user.status || "active"}
</td>

                  <td className="p-4 text-gray-300">
                    {user.city || "—"}
                  </td>
                  <td className="p-4">
  <Link
    href={`/admin/users/${user.$id}`}
    className="text-blue-400 hover:text-blue-300"
  >
    View activity
  </Link>
</td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="p-6 text-gray-400">
              No users found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}