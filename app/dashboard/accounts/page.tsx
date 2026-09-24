"use client";

import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Landmark,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useDashboardData } from "@/components/dashboard/useDashboardData";
import {
  createBankAccountForCurrentUser,
  deleteBankAccountForCurrentUser,
} from "@/lib/actions/user.actions";
import {
  getPaystackBanks,
  resolvePaystackAccount,
} from "@/lib/actions/paystack.actions";

type Bank = {
  name: string;
  code: string;
};

const formatMoney = (amount: number) =>
  amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function AccountsPage() {
  const { data, error, loading, refreshDashboard } =
    useDashboardData();

  const [showBalance, setShowBalance] = useState(true);
  const [showAddBank, setShowAddBank] = useState(false);

  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksLoading, setBanksLoading] = useState(false);

  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");

  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  useEffect(() => {
    if (!showAddBank || banks.length > 0) return;

    const loadBanks = async () => {
      try {
        setBanksLoading(true);

        const result = await getPaystackBanks();
        setBanks(result);
      } catch (error) {
        console.error("LOAD BANKS ERROR:", error);

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to load Nigerian banks.",
        );

        setMessageType("error");
      } finally {
        setBanksLoading(false);
      }
    };

    loadBanks();
  }, [showAddBank, banks.length]);

  const resetForm = () => {
    setBankCode("");
    setBankName("");
    setAccountNumber("");
    setAccountName("");
    setMessage("");
    setMessageType("");
  };

  const handleVerifyAccount = async () => {
    if (!bankCode) {
      setMessage("Select the bank for this account.");
      setMessageType("error");
      return;
    }

    if (!/^\d{10}$/.test(accountNumber)) {
      setMessage("Enter a valid 10-digit account number.");
      setMessageType("error");
      return;
    }

    try {
      setVerifying(true);
      setMessage("");
      setMessageType("");
      setAccountName("");

      const result = await resolvePaystackAccount({
        accountNumber,
        bankCode,
      });

      if (result.needsBankSelection) {
        throw new Error("Please select a bank.");
      }

      const selectedBank = banks.find(
        (bank) => bank.code === result.bankCode,
      );

      setAccountName(result.accountName);
      setBankName(
        selectedBank?.name || result.bankName || "Bank",
      );

      setMessage(`Account verified: ${result.accountName}`);
      setMessageType("success");
    } catch (error) {
      console.error("VERIFY ACCOUNT ERROR:", error);

      setAccountName("");

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not verify this bank account.",
      );

      setMessageType("error");
    } finally {
      setVerifying(false);
    }
  };

  const handleSaveBank = async () => {
    if (!accountName || !bankCode || !bankName) {
      setMessage("Verify the bank account before saving it.");
      setMessageType("error");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setMessageType("");

      await createBankAccountForCurrentUser({
        bankName,
        bankCode,
        accountNumber,
        accountName,
      });

      resetForm();
      setShowAddBank(false);

      await refreshDashboard();

      setMessage("Bank account added successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("SAVE BANK ERROR:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save bank account.",
      );

      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this bank account?",
    );

    if (!confirmed) return;

    try {
      await deleteBankAccountForCurrentUser(bankId);
      await refreshDashboard();
    } catch (error) {
      console.error("DELETE BANK ERROR:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not remove bank account.",
      );

      setMessageType("error");
    }
  };

  return (
    <div className="space-y-7">
      {/* HEADER */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#0F766E]">
            Banking
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Accounts
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your account and linked bank accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddBank((current) => !current);

            if (showAddBank) {
              resetForm();
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59]"
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
      </section>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* MAIN ACCOUNT */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F766E] to-[#115E59] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 right-20 h-56 w-56 rounded-full bg-white/5" />

        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Landmark size={20} />
                </div>

                <div>
                  <p className="text-xs font-medium text-white/60">
                    Primary account
                  </p>

                  <p className="text-sm font-semibold">
                    Covenant Account
                  </p>
                </div>
              </div>

              <p className="mt-8 text-sm text-white/60">
                Available balance
              </p>

              <div className="mt-1 flex items-center gap-3">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {loading
                    ? "Loading..."
                    : showBalance
                      ? `₦${formatMoney(data?.balance ?? 0)}`
                      : "••••••••"}
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setShowBalance((current) => !current)
                  }
                  className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
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

            <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-white/10 sm:flex">
              <ShieldCheck size={26} />
            </div>
          </div>

          <div className="relative mt-8 flex items-center gap-2 text-xs text-white/60">
            <CheckCircle2 size={15} />
            Account active and available
          </div>
        </div>
      </section>

      {/* ADD ACCOUNT */}
      {showAddBank && (
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                <Plus size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Add bank account
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Verify your Nigerian bank account before saving it.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              {/* BANK */}
              <div>
                <label
                  htmlFor="bank"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  Bank
                </label>

                <select
                  id="bank"
                  value={bankCode}
                  onChange={(event) => {
                    const code = event.target.value;

                    setBankCode(code);

                    setBankName(
                      banks.find((bank) => bank.code === code)
                        ?.name || "",
                    );

                    setAccountName("");
                    setMessage("");
                    setMessageType("");
                  }}
                  disabled={banksLoading || verifying || saving}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0F766E] focus:bg-white disabled:opacity-50"
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

              {/* ACCOUNT NUMBER */}
              <div>
                <label
                  htmlFor="accountNumber"
                  className="mb-2 block text-sm font-medium text-slate-600"
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
                      event.target.value.replace(/\D/g, ""),
                    );

                    setAccountName("");
                    setMessage("");
                    setMessageType("");
                  }}
                  placeholder="Enter 10-digit account number"
                  disabled={verifying || saving}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:bg-white disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleVerifyAccount}
              disabled={
                verifying ||
                saving ||
                !bankCode ||
                accountNumber.length !== 10
              }
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[180px]"
            >
              {verifying ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Verify account
                </>
              )}
            </button>

            {/* VERIFIED ACCOUNT */}
            {accountName && (
              <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E]">
                    <CheckCircle2 size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                      Account verified
                    </p>

                    <p className="mt-1 text-base font-bold text-slate-900">
                      {accountName}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {bankName} • {accountNumber}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveBank}
                  disabled={saving}
                  className="mt-5 h-11 w-full rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save bank account"}
                </button>
              </div>
            )}

            {message && (
              <div
                className={`mt-5 rounded-xl px-4 py-3 ${
                  messageType === "success"
                    ? "bg-teal-50 text-teal-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* LINKED ACCOUNTS */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Linked bank accounts
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Verified accounts available for your banking operations.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Loader2
              size={22}
              className="mx-auto animate-spin text-[#0F766E]"
            />

            <p className="mt-3 text-sm text-slate-500">
              Loading linked accounts...
            </p>
          </div>
        ) : data?.accounts?.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {data.accounts.map((account) => (
              <article
                key={account.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                      <Building2 size={21} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-slate-900">
                        {account.bankName}
                      </h3>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {account.accountName}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-semibold text-teal-600">
                    <CheckCircle2 size={12} />
                    Verified
                  </span>
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Account number
                  </p>

                  <p className="mt-1 font-semibold tracking-wide text-slate-800">
                    {account.accountNumber}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteBank(account.id)}
                  className="mt-4 w-full rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-100"
                >
                  Remove account
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
              <Building2 size={28} />
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
              No linked bank accounts
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              Add and verify a bank account to use it for withdrawals
              and other banking services.
            </p>

            <button
              type="button"
              onClick={() => setShowAddBank(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59]"
            >
              <Plus size={17} />
              Add bank account
            </button>
          </div>
        )}
      </section>
    </div>
  );
}