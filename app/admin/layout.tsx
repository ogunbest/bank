import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <aside className="w-64 bg-gray-950 border-r border-gray-800 p-6">
        <h1 className="text-2xl font-bold mb-8">
          Covenant Admin
        </h1>

        <nav className="space-y-2">
          <Link
            href="/admin"
            className="block rounded-lg px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Overview
          </Link>

          <Link
            href="/admin/users"
            className="block rounded-lg px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Users
          </Link>

          <Link
            href="/admin/accounts"
            className="block rounded-lg px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Bank Accounts
          </Link>

          <Link
            href="/admin/transactions"
            className="block rounded-lg px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Transactions
          </Link>

          <div className="pt-6 border-t border-gray-800 mt-6">
            <Link
              href="/dashboard"
              className="block rounded-lg px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              ← User Dashboard
            </Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
