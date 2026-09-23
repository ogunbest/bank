"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";

export default function FundAccount() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFundAccount() {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount < 100) {
      alert("Please enter an amount of at least ₦100");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: numericAmount,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      window.location.href = result.data.data.authorization_url;
    } catch (error: unknown) {
      console.error("FUND ACCOUNT ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to start payment"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* QUICK ACTION */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-800 transition hover:bg-gray-200 active:scale-95">
          <Plus size={21} />
        </span>

        <span className="mt-2 text-xs font-medium text-gray-700">
          Fund
        </span>
      </button>

      {/* FUND MODAL */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Fund Account
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add money to your Covenant account
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* AMOUNT */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Amount
              </label>

              <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 px-4">
                <span className="text-lg font-semibold text-gray-500">
                  ₦
                </span>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="100"
                  autoFocus
                  className="w-full bg-transparent px-3 py-4 text-lg font-semibold text-gray-900 outline-none"
                />
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Minimum amount: ₦100
              </p>
            </div>

            {/* CONTINUE */}
            <button
              type="button"
              onClick={handleFundAccount}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center rounded-2xl bg-gray-900 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Processing...
                </span>
              ) : (
                "Continue to Paystack"
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}