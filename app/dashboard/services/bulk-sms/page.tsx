"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

import { sendBulkSms } from "@/lib/actions/services.actions";
import { verifyTransactionPin } from "@/lib/actions/user.actions";

export default function BulkSmsPage() {
  const [sender, setSender] = useState("");
  const [numbers, setNumbers] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");

  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [processing, setProcessing] = useState(false);

  const recipientList = numbers
    .split(",")
    .map((number) => number.trim())
    .filter(Boolean);

  const validRecipients = recipientList.filter(
  (number) => /^0\d{10}$/.test(number)
);

const canContinue =
  sender.trim().length >= 2 &&
  sender.trim().length <= 11 &&
  validRecipients.length === recipientList.length &&
  recipientList.length > 0 &&
  message.trim().length > 0 &&
  message.trim().length <= 160 &&
  Number(amount) > 0 &&
  Number.isFinite(Number(amount));
  const handleSend = async () => {
  if (!canContinue || pin.length !== 4 || processing) return;

  try {
    setProcessing(true);

    await verifyTransactionPin(pin);

    const result = await sendBulkSms({
      sender: sender.trim(),
      numbers: recipientList.join(","),
      message: message.trim(),
      amount: Number(amount),
    });

    if (!result?.success) {
      throw new Error(
        String(
          result?.response?.api_response ||
            result?.response?.message ||
            "Bulk SMS failed."
        )
      );
    }

    if (result.status === "processing") {
      alert(
        "Your Bulk SMS is being processed. Check Transactions for the status."
      );
    } else {
      alert("Bulk SMS sent successfully.");
    }

    setSender("");
    setNumbers("");
    setMessage("");
    setAmount("");
    setPin("");
    setShowPin(false);
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "Bulk SMS failed."
    );
  } finally {
    setProcessing(false);
  }
};

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 text-slate-900">
      <div className="mx-auto max-w-xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-7">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <MessageSquare size={24} />
            </div>

            <h1 className="text-2xl font-bold">
              Bulk SMS
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Send SMS messages to multiple recipients.
            </p>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold">
              Sender name
            </label>

            <input
              type="text"
              maxLength={11}
              value={sender}
              onChange={(e) =>
                setSender(e.target.value)
              }
              placeholder="Covenant"
              className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none"
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold">
              Recipients
            </label>

            <textarea
              value={numbers}
              onChange={(e) =>
                setNumbers(e.target.value)
              }
              placeholder="08011111111, 08022222222"
              rows={3}
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-4 outline-none"
            />

            <p className="mt-2 text-xs text-slate-400">
              Separate multiple phone numbers with commas.
            </p>
          </div>

          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold">
                Message
              </label>

              <span className="text-xs text-slate-400">
                {message.length}/160
              </span>
            </div>

            <textarea
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= 160) {
                  setMessage(e.target.value);
                }
              }}
              placeholder="Enter your SMS message"
              rows={5}
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-4 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold">
              Amount
            </label>

            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              placeholder="Enter SMS cost"
              className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none"
            />

            <p className="mt-2 text-xs text-slate-400">
              Enter the amount shown by the VTU Naija service pricing.
            </p>
          </div>

          <button
            type="button"
            disabled={!canContinue}
            onClick={() => setShowPin(true)}
            className="w-full rounded-2xl bg-[#0F766E] py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      </div>

      {showPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6">
            <h2 className="text-xl font-bold">
              Confirm Bulk SMS
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter your 4-digit transaction PIN.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm">
              <div className="flex justify-between">
                <span>Recipients</span>
                <strong>
                  {recipientList.length}
                </strong>
              </div>

              <div className="mt-2 flex justify-between">
                <span>Message</span>
                <strong>
                  {message.length} chars
                </strong>
              </div>

              <div className="mt-2 flex justify-between">
                <span>Amount</span>
                <strong>
                  ₦{Number(amount).toLocaleString()}
                </strong>
              </div>
            </div>

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) =>
                setPin(
                  e.target.value.replace(/\D/g, "")
                )
              }
              placeholder="••••"
              className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-4 text-center text-2xl tracking-[0.5em] outline-none"
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                disabled={processing}
                onClick={() => setShowPin(false)}
                className="flex-1 rounded-2xl bg-slate-100 py-3 font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  processing || pin.length !== 4
                }
                onClick={handleSend}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0F766E] py-3 font-semibold text-white disabled:opacity-40"
              >
                {processing ? (
                  <>
                    <Loader2
                      className="animate-spin"
                      size={18}
                    />
                    Sending
                  </>
                ) : (
                  "Send SMS"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}