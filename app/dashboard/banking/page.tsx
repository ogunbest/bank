"use client";

import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Search,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useDashboardData } from "@/components/dashboard/useDashboardData";
import {
  createBankAccountForCurrentUser,deleteBankAccountForCurrentUser,
} from "@/lib/actions/user.actions";
import {
  getPaystackBanks,
  resolvePaystackAccount,
} from "@/lib/actions/paystack.actions";

const formatMoney = (amount: number) =>
  amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

type Bank = {
  name: string;
  code: string;
};

type VerifiedAccount = {
  accountNumber: string;
  accountName: string;
  bankId?: number;
};

export default function BankingPage() {
  const {
    data,
    error,
    loading,
    refreshDashboard,
  } = useDashboardData();

  const [showBalance, setShowBalance] = useState(true);

  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksLoading, setBanksLoading] = useState(true);

  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [verifiedAccount, setVerifiedAccount] =
    useState<VerifiedAccount | null>(null);

  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);

  const [bankMessage, setBankMessage] = useState("");
  const [bankMessageType, setBankMessageType] = useState<
    "success" | "error" | ""
  >("");

  const balance = data?.balance ?? 0;

  useEffect(() => {
    const loadBanks = async () => {
      try {
        setBanksLoading(true);

        const result = await getPaystackBanks();

        setBanks(result);
      } catch (error) {
        console.error("LOAD BANKS ERROR:", error);

        setBankMessage(
          error instanceof Error
            ? error.message
            : "Unable to load Nigerian banks."
        );
        setBankMessageType("error");
      } finally {
        setBanksLoading(false);
      }
    };

    loadBanks();
  }, []);

    const handleVerifyAccount = async () => {
  try {
    setVerifying(true);
    setBankMessage("");
    setBankMessageType("");
    setVerifiedAccount(null);

    const result = await resolvePaystackAccount({
      accountNumber,
      bankCode: selectedBankCode,
    });

    setVerifiedAccount(result);

    setBankMessage(
      `Account verified: ${result.accountName}`
    );
    setBankMessageType("success");
  } catch (error) {
    console.error("VERIFY ACCOUNT ERROR:", error);

    setBankMessage(
      error instanceof Error
        ? error.message
        : "Could not verify bank account."
    );
    setBankMessageType("error");
  } finally {
    setVerifying(false);
  }
};

  const handleDeleteBankAccount = async (bankId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this bank account?"
    );

    if (!confirmed) return;

    try {
      setBankMessage("");
      setBankMessageType("");

      await deleteBankAccountForCurrentUser(bankId);


      setBankMessage(
        "Bank account removed successfully."
      );
      setBankMessageType("success");

      await refreshDashboard();
    } catch (error) {
      console.error(
        "DELETE BANK ACCOUNT ERROR:",
        error
      );

      setBankMessage(
        error instanceof Error
          ? error.message
          : "Could not remove bank account."
      );
      setBankMessageType("error");
    }
  };

  const handleSaveBank = async () => {
    if (!verifiedAccount) {
      setBankMessage(
        "Verify the bank account before saving it."
      );
      setBankMessageType("error");
      return;
    }

    const selectedBank = banks.find(
      (bank) => bank.code === selectedBankCode
    );

    if (!selectedBank) {
      setBankMessage("Bank information is missing.");
      setBankMessageType("error");
      return;
    }

    try {
      setSaving(true);
      setBankMessage("");
      setBankMessageType("");

      await createBankAccountForCurrentUser({
        bankName: selectedBank.name,
        bankCode: selectedBank.code,
        accountNumber: verifiedAccount.accountNumber,
        accountName: verifiedAccount.accountName,
      });

      setAccountNumber("");
      setSelectedBankCode("");
      setVerifiedAccount(null);

      setBankMessage(
        "Verified bank account saved successfully."
      );
      setBankMessageType("success");

      await refreshDashboard();
    } catch (error) {
      console.error("SAVE BANK ACCOUNT ERROR:", error);

      setBankMessage(
        error instanceof Error
          ? error.message
          : "Unable to save bank account."
      );
      setBankMessageType("error");
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Banking
          </h1>

          <p className="text-gray-400 mt-1">
            Manage your bank accounts.
          </p>

          {error && (
            <p className="mt-3 text-sm text-red-300">
              {error}
            </p>
          )}
        </div>

        {/* Balance */}
        <section className="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                Available Covenant balance
              </p>

              <div className="flex items-center gap-3 mt-2">
                <h2 className="text-3xl font-bold text-white">
                  {loading
                    ? "Loading..."
                    : showBalance
                      ? `₦${formatMoney(balance)}`
                      : "••••••••"}
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setShowBalance((current) => !current)
                  }
                  className="text-gray-400 hover:text-white"
                  aria-label="Toggle balance visibility"
                >
                  {showBalance ? (
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

        {/* Verify bank account */}
        <section className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-indigo-500/10">
              <Search
                size={22}
                className="text-indigo-400"
              />
            </div>

            <h2 className="text-lg font-semibold text-white">
              Add bank account
            </h2>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            Select your bank and enter your account number.
            We&apos;ll verify the account name before saving it.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bank */}
            <div>
              <label
                htmlFor="bank"
                className="block text-sm text-gray-400 mb-2"
              >
                Bank
              </label>

              <select
                id="bank"
                value={selectedBankCode}
                onChange={(event) => {
                  setSelectedBankCode(event.target.value);
                  setVerifiedAccount(null);
                  setBankMessage("");
                  setBankMessageType("");
                }}
                disabled={banksLoading || verifying || saving}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 py-3 px-4 text-white outline-none focus:border-indigo-500 disabled:opacity-50"
              >
                <option value="">
                  {banksLoading
                    ? "Loading banks..."
                    : "Select your bank"}
                </option>

                {banks.map((bank) => (
                  <option
                    key={`${bank.code}-${bank.name}`}
                    value={bank.code}
                  >
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Account number */}
            <div>
              <label
                htmlFor="accountNumber"
                className="block text-sm text-gray-400 mb-2"
              >
                Account number
              </label>

              <input
                id="accountNumber"
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={accountNumber}
                onChange={(event) => {
                  setAccountNumber(
                    event.target.value.replace(/\D/g, "")
                  );
                  setVerifiedAccount(null);
                  setBankMessage("");
                  setBankMessageType("");
                }}
                placeholder="10-digit account number"
                disabled={verifying || saving}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 py-3 px-4 text-white outline-none focus:border-indigo-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Verify button */}
          <button
            type="button"
            onClick={handleVerifyAccount}
            disabled={
              verifying ||
              saving ||
              !selectedBankCode ||
              accountNumber.length !== 10
            }
            className="mt-5 w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {verifying ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Verifying...
              </>
            ) : (
              <>
                <Search size={18} />
                Verify account
              </>
            )}
          </button>

          {/* Verification result */}
          {verifiedAccount && (
            <div className="mt-5 rounded-xl border border-green-700/50 bg-green-900/20 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={22}
                  className="text-green-400 mt-0.5 shrink-0"
                />

                <div className="flex-1">
                  <p className="text-green-300 font-medium">
                    Account verified
                  </p>

                  <p className="text-white text-lg font-semibold mt-1">
                    {verifiedAccount.accountName}
                  </p>

                  <p className="text-gray-400 text-sm mt-1">
                    {banks.find(
                      (bank) =>
                        bank.code === selectedBankCode
                    )?.name}{" "}
                    • {verifiedAccount.accountNumber}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveBank}
                disabled={saving}
                className="mt-4 w-full rounded-xl bg-green-600 hover:bg-green-500 px-5 py-3 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving account..."
                  : "Save verified account"}
              </button>
            </div>
          )}

          {/* Bank message */}
          {bankMessage && (
            <div
              className={`mt-5 rounded-xl border p-4 ${
                bankMessageType === "success"
                  ? "border-green-700/50 bg-green-900/20"
                  : "border-red-700/50 bg-red-900/20"
              }`}
            >
              <p
                className={`text-sm ${
                  bankMessageType === "success"
                    ? "text-green-300"
                    : "text-red-300"
                }`}
              >
                {bankMessage}
              </p>
            </div>
          )}
        </section>

        {/* Saved accounts */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Saved bank accounts
          </h2>

          {loading ? (
            <div className="rounded-2xl bg-gray-800/60 border border-gray-700 p-8 text-gray-400">
              Loading saved accounts...
            </div>
          ) : data?.accounts?.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.accounts.map((account) => (
                <article
                  key={account.id}
                  className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between gap-4">
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

                        <p className="text-gray-400 text-sm mt-1">
                          {account.accountName}
                        </p>

                        <p className="text-gray-500 text-sm mt-1">
                          {account.accountNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  
                  <button
  type="button"
  onClick={() =>
    handleDeleteBankAccount(account.id)
  }
  className="mt-3 w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
>
  Remove account
</button>
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
                No saved bank accounts
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Verify and save a bank account above.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

