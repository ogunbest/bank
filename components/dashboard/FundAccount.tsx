"use client";

import { useState } from "react";
import { Check, Loader2, Plus, X } from "lucide-react";

const presetAmounts = [1000, 5000, 10000, 20000];

export default function FundAccount() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const numericAmount = Number(amount);

  async function handleFundAccount() {
    setError("");

    if (!numericAmount || numericAmount < 100) {
      setError("Enter an amount of at least ₦100.");
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

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to start payment",
        );
      }

      window.location.href =
        result.data.data.authorization_url;
    } catch (error: unknown) {
      console.error("FUND ACCOUNT ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to start payment",
      );
    } finally {
      setLoading(false);
    }
  }

  const closeModal = () => {
    if (loading) return;

    setOpen(false);
    setError("");
    setAmount("");
  };

  return (
    <>
      {/* QUICK ACTION */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex flex-col items-center justify-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] transition group-hover:bg-[#0F766E] group-hover:text-white group-active:scale-95">
          <Plus size={21} />
        </span>

        <span className="mt-2 text-xs font-semibold text-slate-700">
          Fund
        </span>
      </button>

      {/* FUND MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                    <Plus size={19} />
                  </div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Fund Account
                  </h2>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Add money securely to your Covenant account
                  using Paystack.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* AMOUNT */}
            <div className="mt-7">
              <label
                htmlFor="fund-amount"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Amount
              </label>

              <div
                className={`flex items-center rounded-2xl border bg-slate-50 px-4 transition ${
                  error
                    ? "border-red-300 ring-2 ring-red-100"
                    : "border-slate-200 focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-teal-100"
                }`}
              >
                <span className="text-xl font-bold text-[#0F766E]">
                  ₦
                </span>

                <input
                  id="fund-amount"
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    setError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleFundAccount();
                    }
                  }}
                  placeholder="0.00"
                  min="100"
                  autoFocus
                  disabled={loading}
                  className="w-full bg-transparent px-3 py-4 text-xl font-bold text-slate-900 outline-none placeholder:text-slate-300 disabled:cursor-not-allowed"
                />
              </div>

              {error ? (
                <p className="mt-2 text-xs font-medium text-red-500">
                  {error}
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-400">
                  Minimum amount: ₦100
                </p>
              )}
            </div>

            {/* PRESETS */}
            <div className="mt-5">
              <p className="mb-2 text-xs font-medium text-slate-500">
                Quick amount
              </p>

              <div className="grid grid-cols-4 gap-2">
                {presetAmounts.map((preset) => {
                  const selected =
                    Number(amount) === preset;

                  return (
                    <button
                      key={preset}
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setAmount(String(preset));
                        setError("");
                      }}
                      className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${
                        selected
                          ? "border-[#0F766E] bg-teal-50 text-[#0F766E]"
                          : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {selected && (
                        <Check
                          size={12}
                          className="mr-1 inline"
                        />
                      )}
                      ₦{preset.toLocaleString("en-NG")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CONTINUE */}
            <button
              type="button"
              onClick={handleFundAccount}
              disabled={loading || numericAmount < 100}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F766E] py-4 font-semibold text-white shadow-sm transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Processing...
                </>
              ) : (
                "Continue to Paystack"
              )}
            </button>

            <p className="mt-3 text-center text-[11px] text-slate-400">
              You’ll be redirected to Paystack to complete
              your payment securely.
            </p>
          </div>
        </div>
      )}
    </>
  );
}