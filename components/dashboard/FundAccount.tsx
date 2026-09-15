"use client";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

export default function FundAccount() {
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

      const response = await fetch(
        "/api/paystack/initialize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: numericAmount,
          }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      window.location.href =
        result.data.data.authorization_url;
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
    <div className="rounded-2xl bg-gray-800/70 border border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <Plus className="text-indigo-400" size={20} />
        </div>

        <div>
          <h3 className="text-white font-semibold">
            Fund Account
          </h3>

          <p className="text-gray-400 text-sm">
            Add money to your account
          </p>
        </div>
      </div>

      <label className="block text-sm text-gray-400 mb-2">
        Amount
      </label>

      <div className="flex items-center rounded-xl bg-gray-900 border border-gray-700 px-4">
        <span className="text-gray-400 mr-2">₦</span>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          min="100"
          className="w-full bg-transparent py-3 text-white outline-none"
        />
      </div>

      <button
        onClick={handleFundAccount}
        disabled={loading}
        className="mt-4 w-full rounded-xl bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-500 transition disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
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
  );
}
