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

    if (
      !network ||
      !networkAmount ||
      !quantity ||
      !nameOnCard ||
      !pin
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (Number(quantity) < 10) {
      setMessage("Minimum quantity is 10 cards.");
      return;
    }

    try {
      setLoading(true);

      const validPin = await verifyTransactionPin(pin);

      if (!validPin) {
        throw new Error("Invalid transaction PIN.");
      }

      const response = await buyRechargeCard({
        network,
        networkAmount: Number(networkAmount),
        quantity: Number(quantity),
        nameOnCard,
      });

      setResult({
  pin: response.response.pin,
  serial: response.response.serial,
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
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
            <Smartphone className="h-6 w-6 text-teal-700" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Recharge Card
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Generate physical recharge PINs.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Network
              </label>

              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600"
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
              <label className="mb-2 block text-sm font-medium text-gray-700">
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
                    className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                      networkAmount === String(amount)
                        ? "border-teal-700 bg-teal-50 text-teal-700"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    ₦{amount}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Quantity
              </label>

              <input
                type="number"
                min="10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
                placeholder="Minimum 10"
              />

              <p className="mt-1 text-xs text-gray-500">
                Minimum quantity: 10 cards
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name on Card
              </label>

              <input
                type="text"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                placeholder="Enter name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
              />
            </div>

            {total > 0 && (
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Total Amount
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  ₦{total.toLocaleString()}
                </p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
              />
            </div>

            {message && (
              <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                {message}
              </div>
            )}

            {result && (
              <div className="rounded-2xl bg-teal-50 p-4">
                <p className="mb-2 text-sm font-semibold text-teal-900">
                  Recharge PIN generated
                </p>

                {result.pin && (
                  <p className="text-sm text-gray-800">
                    PIN:{" "}
                    <span className="font-bold">{result.pin}</span>
                  </p>
                )}

                {result.serial && (
                  <p className="mt-1 text-sm text-gray-800">
                    Serial:{" "}
                    <span className="font-bold">
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
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