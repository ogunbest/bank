"use client";

import { useState } from "react";
import { Loader2, Smartphone } from "lucide-react";

import { buyRechargeCard } from "@/lib/actions/services.actions";
import { verifyTransactionPin } from "@/lib/actions/user.actions";

const networks = [
  { name: "MTN", value: "1" },
  { name: "GLO", value: "2" },
  { name: "9mobile", value: "3" },
  { name: "Airtel", value: "4" },
];

const denominations = [100, 200, 500];

export default function RechargePage() {
  const [network, setNetwork] = useState("");
  const [networkAmount, setNetworkAmount] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [nameOnCard, setNameOnCard] = useState("");
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<{
    pin?: string;
    serial?: string;
  } | null>(null);

  const total =
    Number(networkAmount || 0) * Number(quantity || 0);

  const handleSubmit = async () => {
    setMessage("");
    setResult(null);

    const amount = Number(networkAmount);
    const qty = Number(quantity);

    if (!network || !networkAmount || !quantity || !nameOnCard.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage("Please select a valid recharge amount.");
      return;
    }

    if (!Number.isFinite(qty) || qty < 10) {
      setMessage("Minimum quantity is 10 cards.");
      return;
    }

    if (pin.length !== 4) {
      setMessage("Enter your 4-digit transaction PIN.");
      return;
    }

    try {
      setLoading(true);

      await verifyTransactionPin(pin);

      const response = await buyRechargeCard({
        network,
        networkAmount: amount,
        quantity: qty,
        nameOnCard: nameOnCard.trim(),
      });

      if (!response?.success) {
        throw new Error(
          String(
            response?.response?.api_response ||
              response?.response?.message ||
              "Recharge PIN generation failed."
          )
        );
      }

      if (response.status === "processing") {
        setMessage(
          "Your recharge PIN request is being processed. Check Transactions for the status."
        );
        return;
      }

      const providerResponse = response.response as
        | {
            pin?: string;
            serial?: string;
          }
        | undefined;

      setResult({
        pin: providerResponse?.pin,
        serial: providerResponse?.serial,
      });

      setMessage("Recharge PINs generated successfully.");

      setNetwork("");
      setNetworkAmount("");
      setQuantity("10");
      setNameOnCard("");
      setPin("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Recharge PIN purchase failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white md:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
            <Smartphone className="h-6 w-6" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Recharge Card
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Generate physical recharge PINs.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Network
              </label>

              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">Select network</option>

                {networks.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Recharge Amount
              </label>

              <div className="grid grid-cols-3 gap-2">
                {denominations.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() =>
                      setNetworkAmount(String(amount))
                    }
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      networkAmount === String(amount)
                        ? "border-[#0F766E] bg-teal-50 text-[#0F766E] ring-2 ring-[#0F766E]/20 dark:border-teal-500 dark:bg-teal-950/40 dark:text-teal-400 dark:ring-teal-500/20"
                        : "border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-teal-50/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-800 dark:hover:bg-teal-950/30"
                    }`}
                  >
                    ₦{amount}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Quantity
              </label>

              <input
                type="number"
                min="10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                placeholder="Minimum 10"
              />

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Minimum quantity: 10 cards
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Name on Card
              </label>

              <input
                type="text"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                placeholder="Enter name"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            {total > 0 && (
              <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 dark:border-teal-900/60 dark:bg-teal-950/40">
                <p className="text-sm text-teal-700 dark:text-teal-400">
                  Total Amount
                </p>

                <p className="mt-1 text-xl font-bold text-teal-800 dark:text-teal-300">
                  ₦{total.toLocaleString()}
                </p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Transaction PIN
              </label>

              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, ""))
                }
                placeholder="••••"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            {message && (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {message}
              </div>
            )}

            {result && (
              <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 dark:border-teal-900/60 dark:bg-teal-950/40">
                <p className="mb-2 text-sm font-semibold text-teal-800 dark:text-teal-300">
                  Recharge PIN generated
                </p>

                {result.pin && (
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    PIN:{" "}
                    <span className="font-bold text-slate-900 dark:text-white">
                      {result.pin}
                    </span>
                  </p>
                )}

                {result.serial && (
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    Serial:{" "}
                    <span className="font-bold text-slate-900 dark:text-white">
                      {result.serial}
                    </span>
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F766E] px-4 py-4 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-teal-600 dark:hover:bg-teal-500"
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {loading
                ? "Processing..."
                : "Generate Recharge PIN"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}