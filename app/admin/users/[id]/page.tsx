import UserStatusButton from "@/components/admin/UserStatusButton";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getAllUsers,
  getLoggedInUser,
} from "@/lib/actions/user.actions";

export default async function AdminUserDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const admin = await getLoggedInUser();

  if (!admin || admin.role?.trim().toLowerCase() !== "admin") {
    redirect("/dashboard");
  }

  const users = await getAllUsers();

  const user = users.find(
    (item: any) => item.$id === params.id
  );

  if (!user) {
    notFound();
  }

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
                {user.address || "—"}
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
      </div>
    </div>
  );
}