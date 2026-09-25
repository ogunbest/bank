"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Phone, Smartphone } from "lucide-react";
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
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <Smartphone size={24} />
            </div>

            <h1 className="text-2xl font-bold">Buy Airtime</h1>
            <p className="mt-1 text-sm text-slate-500">
              Recharge any Nigerian mobile network.
            </p>
          </div>

          <div className="mb-6">
  <p className="mb-3 text-sm font-semibold">
    Select network
  </p>

  <div className="grid grid-cols-2 gap-3">
    {networks.map((item) => (
      <button
        key={item.name}
        type="button"
        onClick={() => setNetwork(item.name)}
        className={`flex items-center gap-3 rounded-2xl border bg-white p-4 transition ${
          network === item.name
            ? "border-[#0F766E] bg-teal-50 ring-2 ring-[#0F766E]/20"
            : "border-slate-200"
        }`}
      >
        <Image
          src={item.logo}
          alt={item.name}
          width={42}
          height={42}
          className="rounded-xl object-contain"
        />

        <span className="font-semibold text-slate-800">
          {item.name}
        </span>
      </button>
    ))}
  </div>
</div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold">
              Phone number
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4">
              <Phone size={18} className="text-slate-400" />

              <input
                type="tel"
                inputMode="numeric"
                maxLength={11}
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
                placeholder="08012345678"
                className="w-full bg-transparent py-4 outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold">
              Amount
            </label>

            <div className="rounded-2xl border border-slate-200 px-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">₦</span>

                <input
                  type="number"
                  min="50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-transparent py-4 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mb-7 flex flex-wrap gap-2">
            {quickAmounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(String(value))}
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
              >
                ₦{value.toLocaleString()}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={!canContinue || processing}
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
            <h2 className="text-xl font-bold">Confirm Airtime Purchase</h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter your 4-digit transaction PIN to continue.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm">
              <div className="flex justify-between">
                <span>Network</span>
                <strong>{network}</strong>
              </div>

              <div className="mt-2 flex justify-between">
                <span>Phone</span>
                <strong>{phone}</strong>
              </div>

              <div className="mt-2 flex justify-between">
                <span>Amount</span>
                <strong>₦{Number(amount).toLocaleString()}</strong>
              </div>
            </div>

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, ""))
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
                disabled={processing || pin.length !== 4}
                onClick={handlePurchase}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0F766E] py-3 font-semibold text-white disabled:opacity-40"
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