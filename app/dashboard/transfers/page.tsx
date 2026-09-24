"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Search,
  Send,
  ShieldCheck,
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




export default function TransfersPage() {
  const router = useRouter();
  const { data, error, loading } = useDashboardData();
const [bankCode, setBankCode] = useState("");
const [bankName, setBankName] = useState("");
const [accountNumber, setAccountNumber] = useState("");
const [accountName, setAccountName] = useState("");

const [banks, setBanks] = useState<
  { name: string; code: string }[]
>([]);

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

    // No bank selected yet.
    // Load the bank list once instead of trying every bank.
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

    // Bank is known, so resolve the account directly.
    const result = await resolvePaystackAccount({
      accountNumber: value,
      bankCode: code,
    });

    if (result.needsBankSelection) {
      setResolveError("Please select the recipient's bank.");
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

 const openPinModal = () => {
  if (accountNumber.length !== 10) {
    alert("Enter a valid 10-digit account number.");
    return;
  }

  if (!accountName || !bankCode) {
    alert("Please wait for the account to be verified.");
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
        `₦${result.amount.toLocaleString("en-NG")} transferred successfully to ${accountName}.`,
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
    <div className="min-h-full bg-[#F8FAFC]">
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Transfers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Send money securely to a Nigerian bank account.
          </p>

          {error && (
            <p className="mt-3 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        {/* Send Money */}
        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50">
                <Send className="text-teal-600" size={21} />
              </div>

              <div>
                <h2 className="font-semibold text-[#0F172A]">
                  Send Money
                </h2>
                <p className="text-sm text-slate-500">
                  Enter the recipient&apos;s bank details.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
    

            {/* Account Number */}
<div className="md:col-span-2">
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Account Number
  </label>

  <div className="relative">
    <input
      value={accountNumber}
      onChange={(event) => {
        const value = event.target.value
          .replace(/\D/g, "")
          .slice(0, 10);

        setAccountNumber(value);
        setAccountName("");
        setBankName("");
        setBankCode("");
        setShowBankSelector(false);
        setResolveError("");
      }}
      inputMode="numeric"
      maxLength={10}
      placeholder="Enter 10-digit account number"
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
    />
  </div>

  <button
    type="button"
    disabled={accountNumber.length !== 10 || resolving}
    onClick={() => verifyAccount(accountNumber)}
    className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {resolving ? (
      <>
        <Loader2 size={16} className="animate-spin" />
        Verifying...
      </>
    ) : (
      <>
        <Search size={16} />
        Verify Account
      </>
    )}
  </button>

  {resolveError && (
    <p className="mt-2 text-sm text-red-500">
      {resolveError}
    </p>
  )}

  {/* Bank fallback */}
  {showBankSelector && (
    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-slate-800">
        Select the recipient&apos;s bank
      </p>

      <p className="mt-1 text-xs text-slate-500">
        We need the bank to securely verify the account name.
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
      await verifyAccount(accountNumber, code);
    }
  }}
  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
>
  <option value="">
    {loadingBanks ? "Loading banks..." : "Select bank"}
  </option>

  {banks.map((bank) => (
    <option key={bank.code} value={bank.code}>
      {bank.name}
    </option>
  ))}
</select>
    </div>
  )}

  <p className="mt-2 text-xs text-slate-400">
  Enter the 10-digit account number, then select the recipient&apos;s
  bank to verify the account name.
</p>
</div>

           {/* Verified Recipient */}
{accountName && bankName && (
  <div className="md:col-span-2">
    <div className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100">
        <CheckCircle2
          size={20}
          className="text-teal-600"
        />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
          Account verified
        </p>

        <p className="font-semibold text-[#0F172A]">
          {accountName}
        </p>

        <p className="mt-0.5 text-sm text-slate-500">
          {bankName}
        </p>
      </div>
    </div>
  </div>
)}

            {/* Amount */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Note
                <span className="ml-1 font-normal text-slate-400">
                  (optional)
                </span>
              </label>

              <input
                value={note}
                onChange={(event) =>
                  setNote(event.target.value)
                }
                placeholder="What's this transfer for?"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
              />
            </div>

            {/* Send Button */}
            <div className="md:col-span-2 flex justify-end pt-2">
              <button
                type="button"
                onClick={openPinModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={17} />
                Send Money
              </button>
            </div>
          </div>
        </section>

        {/* Transfer History */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-semibold text-[#0F172A]">
              Transfer History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your recent outgoing transfers.
            </p>
          </div>

          <div className="border-b border-slate-100 p-4">
            <label className="relative block max-w-xl">
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500"
              />
            </label>
          </div>

          <div className="hidden border-b border-slate-100 px-6 py-4 text-xs uppercase tracking-wide text-slate-400 md:grid md:grid-cols-12 md:gap-4">
            <div className="col-span-4">Transfer</div>
            <div className="col-span-3">Reference</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-center text-slate-500">
              Loading transfers...
            </div>
          ) : transfers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <ArrowUpRight
                  size={21}
                  className="text-slate-400"
                />
              </div>

              <p className="mt-4 font-medium text-slate-700">
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
                className="grid grid-cols-1 gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0 md:grid-cols-12"
              >
                <div className="flex items-center gap-3 md:col-span-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                    <ArrowUpRight
                      size={18}
                      className="text-red-500"
                    />
                  </span>

                  <p className="font-medium text-slate-900">
                    {transfer.title}
                  </p>
                </div>

                <p className="break-all text-sm text-slate-500 md:col-span-3 md:flex md:items-center">
                  {transfer.reference}
                </p>

                <p className="text-sm text-slate-500 md:col-span-2 md:flex md:items-center">
                  {formatDate(transfer.date)}
                </p>

                <p className="text-sm capitalize text-slate-600 md:col-span-1 md:flex md:items-center">
                  {transfer.status}
                </p>

                <p className="font-semibold text-red-500 md:col-span-2 md:flex md:items-center md:justify-end">
                  -₦{formatMoney(transfer.amount)}
                </p>
              </article>
            ))
          )}
        </section>
      </main>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={closePinModal}
              disabled={sending}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >
              <X size={20} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
              <ShieldCheck
                size={24}
                className="text-teal-600"
              />
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#0F172A]">
              Confirm transfer
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your transaction PIN to authorize this transfer.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Sending
              </p>

              <p className="mt-1 text-2xl font-bold text-[#0F172A]">
                ₦{Number(amount || 0).toLocaleString("en-NG")}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                To {accountName}
              </p>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl tracking-[0.6em] text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closePinModal}
                disabled={sending}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmTransfer}
                disabled={sending || pin.length !== 4}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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