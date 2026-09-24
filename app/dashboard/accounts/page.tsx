
"use client";

import { Building2, Eye, EyeOff, Wallet, Plus, X } from "lucide-react";
import { useState } from "react";
import { createBankAccountForCurrentUser } from "@/lib/actions/user.actions";
import { useDashboardData } from "@/components/dashboard/useDashboardData";

const formatMoney = (amount: number) =>
  amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });


export default function AccountsPage() {
  const [showBalances, setShowBalances] = useState(true);
  const [showAddBank, setShowAddBank] = useState(false);

  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const {
    data,
    error,
    loading,
    refreshDashboard,
  } = useDashboardData();

  const handleAddBank = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMessage("");

    const cleanBankName = bankName.trim();
    const cleanBankCode = bankCode.trim();
    const cleanAccountNumber = accountNumber.trim();
    const cleanAccountName = accountName.trim();

    if (
      !cleanBankName ||
      !cleanBankCode ||
      !cleanAccountNumber ||
      !cleanAccountName
    ) {
      setMessage("Please fill in all bank account fields.");
      return;
    }

    if (!/^\d{10}$/.test(cleanAccountNumber)) {
      setMessage("Enter a valid 10-digit Nigerian account number.");
      return;
    }

    try {
      setSaving(true);

      await createBankAccountForCurrentUser({
        bankName: cleanBankName,
        bankCode: cleanBankCode,
        accountNumber: cleanAccountNumber,
        accountName: cleanAccountName,
      });

      setBankName("");
      setBankCode("");
      setAccountNumber("");
      setAccountName("");
      setShowAddBank(false);
      setMessage("Bank account added successfully.");

      await refreshDashboard();
    } catch (error) {
      console.error("ADD BANK ACCOUNT ERROR:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to add bank account.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Accounts
              </h1>

              <p className="text-gray-400 mt-1">
                Your Convenant balance and linked bank accounts.
              </p>

              {error && (
                <p className="mt-3 text-sm text-red-300">
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={() => {
                setShowAddBank((current) => !current);
                setMessage("");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-3 text-sm font-medium text-white transition"
            >
              {showAddBank ? (
                <>
                  <X size={18} />
                  Cancel
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add bank account
                </>
              )}
            </button>
          </div>
        </div>

        {showAddBank && (
          <section className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 mb-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                Add bank account
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Add the Nigerian bank account you want to use for withdrawals.
              </p>
            </div>

            <form
              onSubmit={handleAddBank}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label
                  htmlFor="bankName"
                  className="block text-sm text-gray-400 mb-2"
                >
                  Bank name
                </label>

                <input
                  id="bankName"
                  value={bankName}
                  onChange={(event) => setBankName(event.target.value)}
                  placeholder="e.g. Access Bank"
                  className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="bankCode"
                  className="block text-sm text-gray-400 mb-2"
                >
                  Bank code
                </label>

                <input
                  id="bankCode"
                  value={bankCode}
                  onChange={(event) => setBankCode(event.target.value)}
                  placeholder="e.g. 044"
                  className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="accountNumber"
                  className="block text-sm text-gray-400 mb-2"
                >
                  Account number
                </label>

                <input
                  id="accountNumber"
                  inputMode="numeric"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(event) =>
                    setAccountNumber(
                      event.target.value.replace(/\D/g, ""),
                    )
                  }
                  placeholder="10-digit account number"
                  className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="accountName"
                  className="block text-sm text-gray-400 mb-2"
                >
                  Account name
                </label>

                <input
                  id="accountName"
                  value={accountName}
                  onChange={(event) => setAccountName(event.target.value)}
                  placeholder="Name on bank account"
                  className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              {message && (
                <div className="md:col-span-2 rounded-xl border border-gray-700 bg-gray-900/70 p-4">
                  <p className="text-sm text-gray-300">
                    {message}
                  </p>
                </div>
              )}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-3 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save bank account"}
                </button>
              </div>
            </form>
          </section>
        )}

        {message && !showAddBank && (
          <div className="mb-6 rounded-xl border border-green-700/50 bg-green-900/20 p-4">
            <p className="text-sm text-green-300">
              {message}
            </p>
          </div>
        )}

        <section className="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                Horizon balance
              </p>

              <div className="flex items-center gap-3 mt-2">
                <h2 className="text-3xl font-bold text-white">
                  {loading
                    ? "Loading..."
                    : showBalances
                      ? `₦${formatMoney(data?.balance ?? 0)}`
                      : "••••••••"}
                </h2>

                <button
                  onClick={() =>
                    setShowBalances((visible) => !visible)
                  }
                  className="text-gray-400 hover:text-white"
                  aria-label="Toggle balance visibility"
                >
                  {showBalances ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10">
              <Wallet
                size={28}
                className="text-indigo-400"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-4">
            Linked bank accounts
          </h2>

          {loading ? (
            <div className="rounded-2xl bg-gray-800/60 border border-gray-700 p-8 text-gray-400">
              Loading linked accounts...
            </div>
          ) : data?.accounts.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.accounts.map((account) => (
                <article
                  key={account.id}
                  className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-indigo-500/10">
                      <Building2
                        size={24}
                        className="text-indigo-400"
                      />
                    </div>

                    <div>
                      <h3 className="text-white font-semibold">
                        {account.bankName}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        {account.accountName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-gray-700">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Account number
                    </p>

                    <p className="text-gray-200 mt-1">
                      {account.accountNumber}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-700 p-8 text-center">
              <Building2
                className="mx-auto text-gray-500"
                size={28}
              />

              <p className="mt-3 text-white font-medium">
                No linked bank accounts
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add a bank account above to use it for withdrawals.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


