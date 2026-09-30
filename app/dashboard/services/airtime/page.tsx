"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Loader2,
  Phone,
  Smartphone,
} from "lucide-react";
import { useState } from "react";

import { buyAirtime } from "@/lib/actions/services.actions";
import { verifyTransactionPin } from "@/lib/actions/user.actions";

const networks = [
  {
    name: "MTN",
    code: "1",
    logo: "/mtn.png",
  },
  {
    name: "Airtel",
    code: "4",
    logo: "/airtel.png",
  },
  {
    name: "Glo",
    code: "2",
    logo: "/glo.png",
  },
  {
    name: "9mobile",
    code: "3",
    logo: "/9mobile.png",
  },
];

const quickAmounts = [100, 200, 500, 1000, 2000];

export default function AirtimePage() {
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [processing, setProcessing] = useState(false);

  const canContinue =
    network &&
    /^0\d{10}$/.test(phone) &&
    Number(amount) >= 50;

  const handlePurchase = async () => {
    if (!canContinue) return;

    if (pin.length !== 4) {
      alert("Enter your 4-digit transaction PIN.");
      return;
    }

    try {
      setProcessing(true);

      await verifyTransactionPin(pin);

      const selectedNetwork = networks.find(
        (item) => item.name === network
      );

      if (!selectedNetwork) {
        throw new Error("Please select a network.");
      }

      const result = await buyAirtime({
        network: selectedNetwork.code,
        phone,
        amount: Number(amount),
      });

      if (result.status === "processing") {
        alert(
          "Your airtime purchase is being processed. Check Transactions for the status."
        );
      } else {
        alert(
          `₦${Number(amount).toLocaleString()} airtime purchased successfully.`
        );
      }

      setPhone("");
      setAmount("");
      setPin("");
      setShowPin(false);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Airtime purchase failed."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-xl">
        {/* BACK */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-[#0F766E] dark:text-slate-400 dark:hover:text-teal-400"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* MAIN CARD */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="mb-7">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
              <Smartphone size={24} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Buy Airtime
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Recharge any Nigerian mobile network.
            </p>
          </div>

          {/* NETWORK */}
          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Select network
            </p>

            <div className="grid grid-cols-2 gap-3">
              {networks.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setNetwork(item.name)}
                  className={`flex items-center gap-3 rounded-2xl border p-4 transition ${
                    network === item.name
                      ? "border-[#0F766E] bg-teal-50 ring-2 ring-[#0F766E]/20 dark:border-teal-500 dark:bg-teal-950/40 dark:ring-teal-500/20"
                      : "border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/40 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-800 dark:hover:bg-teal-950/30"
                  }`}
                >
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={42}
                    height={42}
                    className="rounded-xl object-contain"
                  />

                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* PHONE */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">
              Phone number
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-teal-500 dark:border-slate-700 dark:bg-slate-800">
              <Phone
                size={18}
                className="text-slate-400 dark:text-slate-500"
              />

              <input
                type="tel"
                inputMode="numeric"
                maxLength={11}
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
                placeholder="08012345678"
                className="w-full bg-transparent py-4 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* AMOUNT */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">
              Amount
            </label>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-teal-500 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                  ₦
                </span>

                <input
                  type="number"
                  min="50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-transparent py-4 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* QUICK AMOUNTS */}
          <div className="mb-7 flex flex-wrap gap-2">
            {quickAmounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(String(value))}
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-teal-50 hover:text-[#0F766E] dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-teal-950/50 dark:hover:text-teal-400"
              >
                ₦{value.toLocaleString()}
              </button>
            ))}
          </div>

          {/* CONTINUE */}
          <button
            type="button"
            disabled={!canContinue || processing}
            onClick={() => setShowPin(true)}
            className="w-full rounded-2xl bg-[#0F766E] py-4 font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-teal-600"
          >
            Continue
          </button>
        </div>
      </div>

      {/* PIN MODAL */}
      {showPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Confirm Airtime Purchase
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Enter your 4-digit transaction PIN to continue.
            </p>

            {/* SUMMARY */}
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Network
                </span>

                <strong className="text-slate-900 dark:text-white">
                  {network}
                </strong>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Phone
                </span>

                <strong className="text-slate-900 dark:text-white">
                  {phone}
                </strong>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Amount
                </span>

                <strong className="text-slate-900 dark:text-white">
                  ₦{Number(amount).toLocaleString()}
                </strong>
              </div>
            </div>

            {/* PIN */}
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, ""))
              }
              placeholder="••••"
              className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-2xl tracking-[0.5em] text-slate-900 outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-600"
            />

            {/* ACTIONS */}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                disabled={processing}
                onClick={() => setShowPin(false)}
                className="flex-1 rounded-2xl bg-slate-100 py-3 font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={processing || pin.length !== 4}
                onClick={handlePurchase}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0F766E] py-3 font-semibold text-white transition hover:bg-[#115E59] disabled:opacity-40 dark:hover:bg-teal-600"
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing
                  </>
                ) : (
                  "Pay Now"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}