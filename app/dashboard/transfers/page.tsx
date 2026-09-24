"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Search,
  Send,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useDashboardData } from "@/components/dashboard/useDashboardData";
import {
  getPaystackBanks,
  resolvePaystackAccount,
} from "@/lib/actions/paystack.actions";
import { transferMoney } from "@/lib/actions/transfer.actions";
import { verifyTransactionPin } from "@/lib/actions/user.actions";

const formatMoney = (amount: number) =>
  amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

type Bank = {
  name: string;
  code: string;
};

export default function TransfersPage() {
  const router = useRouter();

  const { data, error, loading } = useDashboardData();

  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const [banks, setBanks] = useState<Bank[]>([]);
  const [showBankSelector, setShowBankSelector] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState("");

  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [sending, setSending] = useState(false);

  const [search, setSearch] = useState("");

  const transfers = useMemo(
    () =>
      (data?.transactions ?? []).filter(
        (transaction) =>
          transaction.direction === "out" &&
          `${transaction.title} ${transaction.reference}`
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
      ),
    [data?.transactions, search],
  );

  const verifyAccount = async (
    value: string,
    selectedBankCode?: string,
  ) => {
    if (value.length !== 10) {
      return;
    }

    try {
      setResolving(true);
      setResolveError("");

      const code = selectedBankCode || bankCode;

      if (!code) {
        if (banks.length === 0) {
          setLoadingBanks(true);

          try {
            const bankList = await getPaystackBanks();
            setBanks(bankList);
          } catch (error) {
            console.error("BANK LIST ERROR:", error);
            setResolveError("Could not load Nigerian banks.");
            return;
          } finally {
            setLoadingBanks(false);
          }
        }

        setShowBankSelector(true);
        return;
      }

      const result = await resolvePaystackAccount({
        accountNumber: value,
        bankCode: code,
      });

      if (result.needsBankSelection) {
        setResolveError(
          "Please select the recipient's bank.",
        );
        setShowBankSelector(true);
        return;
      }

      const selectedBank = banks.find(
        (bank) => bank.code === result.bankCode,
      );

      setAccountName(result.accountName);
      setBankCode(result.bankCode);
      setBankName(
        selectedBank?.name || result.bankName || "Bank",
      );
      setShowBankSelector(false);
    } catch (error) {
      console.error("ACCOUNT RESOLVE ERROR:", error);

      setAccountName("");
      setBankName("");

      setResolveError(
        error instanceof Error
          ? error.message
          : "Could not verify this bank account.",
      );
    } finally {
      setResolving(false);
    }
  };

  const handleAccountChange = (
    value: string,
  ) => {
    const cleaned = value
      .replace(/\D/g, "")
      .slice(0, 10);

    setAccountNumber(cleaned);
    setAccountName("");
    setBankName("");
    setBankCode("");
    setShowBankSelector(false);
    setResolveError("");
  };

  const openPinModal = () => {
    if (accountNumber.length !== 10) {
      alert("Enter a valid 10-digit account number.");
      return;
    }

    if (!accountName || !bankCode) {
      alert("Please verify the recipient account first.");
      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      alert("Enter a valid transfer amount.");
      return;
    }

    setPin("");
    setShowPinModal(true);
  };

  const closePinModal = () => {
    if (sending) return;

    setPin("");
    setShowPinModal(false);
  };

  const confirmTransfer = async () => {
    if (pin.length !== 4) {
      alert("Enter your 4-digit transaction PIN.");
      return;
    }

    setSending(true);

    try {
      await verifyTransactionPin(pin);

      const result = await transferMoney({
        recipientAccountNumber: accountNumber,
        amount: Number(amount),
        note,
      });

      if (!result.success) {
        throw new Error("Transfer could not be completed.");
      }

      alert(
        `₦${result.amount.toLocaleString(
          "en-NG",
        )} transferred successfully to ${accountName}.`,
      );

      setBankCode("");
      setBankName("");
      setAccountNumber("");
      setAccountName("");
      setAmount("");
      setNote("");
      setPin("");
      setShowPinModal(false);

      router.refresh();
    } catch (error) {
      console.error("TRANSFER ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to complete transfer.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <section>
        <p className="text-sm font-medium text-[#0F766E]">
          Payments
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Transfers
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Send money securely to a Nigerian bank account.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </section>

      {/* Transfer form */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
              <Send size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Send money
              </h2>

        <p className="text-sm font-semibold text-slate-800">
  Select recipient&apos;s bank
</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          {/* Account number */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Recipient account number
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={accountNumber}
                onChange={(event) =>
                  handleAccountChange(event.target.value)
                }
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter 10-digit account number"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#14B8A6] focus:bg-white focus:ring-2 focus:ring-[#14B8A6]/10"
              />

              <button
                type="button"
                disabled={
                  accountNumber.length !== 10 || resolving
                }
                onClick={() => verifyAccount(accountNumber)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resolving ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Verifying
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Verify account
                  </>
                )}
              </button>
            </div>

            {resolveError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">
                  {resolveError}
                </p>
              </div>
            )}

            {/* Bank selection fallback */}
            {showBankSelector && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Select recipient&apos;s bank
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  The bank is required to securely verify the
                  account name.
                </p>

                <select
                  value={bankCode}
                  disabled={loadingBanks || resolving}
                  onChange={async (event) => {
                    const code = event.target.value;

                    setBankCode(code);
                    setAccountName("");
                    setResolveError("");

                    const selectedBank = banks.find(
                      (bank) => bank.code === code,
                    );

                    setBankName(selectedBank?.name || "");

                    if (code) {
                      await verifyAccount(
                        accountNumber,
                        code,
                      );
                    }
                  }}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10"
                >
                  <option value="">
                    {loadingBanks
                      ? "Loading banks..."
                      : "Select bank"}
                  </option>

                  {banks.map((bank) => (
                    <option
                      key={bank.code}
                      value={bank.code}
                    >
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <p className="mt-2 text-xs text-slate-400">
              Enter all 10 digits, then verify the recipient.
            </p>
          </div>

          {/* Verified recipient */}
          {accountName && bankName && (
            <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0F766E] shadow-sm">
                  <CheckCircle2 size={21} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
                    Account verified
                  </p>

                  <p className="mt-1 truncate font-bold text-slate-900">
                    {accountName}
                  </p>

                  <p className="mt-0.5 text-sm text-slate-500">
                    {bankName} · {accountNumber}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Amount + note */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-slate-500">
                  ₦
                </span>

                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value)
                  }
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#14B8A6] focus:bg-white focus:ring-2 focus:ring-[#14B8A6]/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Note{" "}
                <span className="font-normal text-slate-400">
                  (optional)
                </span>
              </label>

              <input
                value={note}
                onChange={(event) =>
                  setNote(event.target.value)
                }
                placeholder="What's this transfer for?"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#14B8A6] focus:bg-white focus:ring-2 focus:ring-[#14B8A6]/10"
              />
            </div>
          </div>

          {/* Summary */}
          {accountName && amount && (
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Transfer amount
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    ₦{formatMoney(Number(amount) || 0)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    Recipient
                  </p>

                  <p className="mt-1 max-w-[180px] truncate text-sm font-semibold text-slate-700">
                    {accountName}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Send */}
          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={openPinModal}
              disabled={
                !accountName ||
                !bankCode ||
                !amount
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              <Send size={17} />
              Continue to PIN
            </button>
          </div>
        </div>
      </section>

      {/* Transfer history */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <h2 className="font-bold text-slate-900">
            Transfer history
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your recent outgoing transfers.
          </p>
        </div>

        <div className="border-b border-slate-100 p-4">
          <div className="relative max-w-xl">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search transfers..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#14B8A6] focus:bg-white"
            />
          </div>
        </div>

        <div className="hidden border-b border-slate-100 px-6 py-4 text-xs uppercase tracking-wide text-slate-400 md:grid md:grid-cols-12 md:gap-4">
          <div className="col-span-4">Transfer</div>
          <div className="col-span-3">Reference</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <Loader2
              size={25}
              className="mx-auto animate-spin text-[#0F766E]"
            />

            <p className="mt-3 text-sm text-slate-500">
              Loading transfers...
            </p>
          </div>
        ) : transfers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <ArrowUpRight
                size={21}
                className="text-slate-400"
              />
            </div>

            <p className="mt-4 font-semibold text-slate-700">
              No transfers yet
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Your outgoing transfers will appear here.
            </p>
          </div>
        ) : (
          transfers.map((transfer) => (
            <article
              key={transfer.id}
              className="grid grid-cols-1 gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0 md:grid-cols-12 md:px-6"
            >
              <div className="flex items-center gap-3 md:col-span-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <ArrowUpRight size={18} />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {transfer.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-400 md:hidden">
                    {formatDate(transfer.date)}
                  </p>
                </div>
              </div>

              <p className="break-all text-sm text-slate-500 md:col-span-3 md:flex md:items-center">
                {transfer.reference}
              </p>

              <p className="hidden text-sm text-slate-500 md:col-span-2 md:flex md:items-center">
                {formatDate(transfer.date)}
              </p>

              <p className="text-sm capitalize text-slate-600 md:col-span-1 md:flex md:items-center">
                {transfer.status}
              </p>

              <p className="font-semibold text-red-500 md:col-span-2 md:flex md:items-center md:justify-end">
                -₦{formatMoney(Number(transfer.amount ?? 0))}
              </p>
            </article>
          ))
        )}
      </section>

      {/* PIN modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={closePinModal}
              disabled={sending}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >
              <X size={20} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
              <ShieldCheck size={24} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Confirm transfer
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your 4-digit transaction PIN to authorize this
              transfer.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Sending
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                ₦{Number(amount || 0).toLocaleString("en-NG")}
              </p>

              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <UserRound size={15} />
                <span className="truncate">
                  {accountName}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                {bankName} · {accountNumber}
              </p>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Transaction PIN
              </label>

              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                autoFocus
                value={pin}
                onChange={(event) =>
                  setPin(
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 4),
                  )
                }
                placeholder="••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl tracking-[0.6em] text-slate-900 outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closePinModal}
                disabled={sending}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmTransfer}
                disabled={sending || pin.length !== 4}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    Confirm & Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}