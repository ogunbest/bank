"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Zap,
} from "lucide-react";
import { useState } from "react";

import {
  payElectricity,
  verifyElectricityMeter,
} from "@/lib/actions/services.actions";
import { verifyTransactionPin } from "@/lib/actions/user.actions";

const discos = [
  { name: "IKEDC", value: "1" },
  { name: "EKO", value: "2" },
  { name: "AEDC", value: "3" },
  { name: "IBEDC", value: "4" },
  { name: "KAEDCO", value: "5" },
  { name: "KEDCO", value: "6" },
  { name: "JED", value: "7" },
  { name: "PHED", value: "8" },
  { name: "YEDC", value: "9" },
  { name: "BEDC", value: "10" },
  { name: "ABEDC", value: "11" },
];

export default function ElectricityPage() {
  const [disco, setDisco] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [meterType, setMeterType] = useState("Prepaid");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleVerify = async () => {
    if (!disco || !meterNumber) {
      alert("Select your electricity provider and enter your meter number.");
      return;
    }

    try {
      setVerifying(true);
      setVerified(false);
      setCustomerName("");

      const result = await verifyElectricityMeter({
        discoName: disco,
        meterNumber,
      });

      const name =
        String(
          result.name ||
            result.customer_name ||
            result.customerName ||
            ""
        );

      setCustomerName(name || "Meter verified");
      setVerified(true);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to verify meter."
      );
    } finally {
      setVerifying(false);
    }
  };

  const canContinue =
    verified &&
    Number(amount) >= 100 &&
    meterNumber.length > 0;

  const handlePayment = async () => {
    if (!canContinue || pin.length !== 4) return;

    try {
      setProcessing(true);

      await verifyTransactionPin(pin);

      const result = await payElectricity({
        discoName: disco,
        meterNumber,
        meterType,
        amount: Number(amount),
        phone,
      });

      if (result.status === "processing") {
        alert(
          "Your electricity payment is being processed. Check Transactions for the status."
        );
      } else {
        alert("Electricity payment successful.");
      }

      setMeterNumber("");
      setAmount("");
      setPhone("");
      setCustomerName("");
      setVerified(false);
      setPin("");
      setShowPin(false);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Electricity payment failed."
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
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Zap size={24} />
            </div>

            <h1 className="text-2xl font-bold">
              Electricity
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Pay your electricity bill securely.
            </p>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold">
              Electricity provider
            </label>

            <select
              value={disco}
              onChange={(e) => {
                setDisco(e.target.value);
                setVerified(false);
                setCustomerName("");
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none"
            >
              <option value="">
                Select provider
              </option>

              {discos.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold">
              Meter number
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={meterNumber}
                onChange={(e) => {
                  setMeterNumber(
                    e.target.value.replace(/\D/g, "")
                  );
                  setVerified(false);
                  setCustomerName("");
                }}
                placeholder="Enter meter number"
                className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-4 outline-none"
              />

              <button
                type="button"
                onClick={handleVerify}
                disabled={
                  verifying ||
                  !disco ||
                  !meterNumber
                }
                className="rounded-2xl bg-slate-900 px-5 font-semibold text-white disabled:opacity-40"
              >
                {verifying ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </div>

          {verified && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4">
              <CheckCircle2
                size={20}
                className="text-emerald-600"
              />

              <div>
                <p className="text-xs text-emerald-700">
                  Meter verified
                </p>

                <p className="font-semibold text-emerald-900">
                  {customerName}
                </p>
              </div>
            </div>
          )}

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold">
              Meter type
            </label>

            <div className="grid grid-cols-2 gap-3">
              {["Prepaid", "Postpaid"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMeterType(type)}
                  className={`rounded-2xl border py-4 font-semibold ${
                    meterType === type
                      ? "border-[#0F766E] bg-teal-50 text-[#0F766E]"
                      : "border-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold">
              Amount
            </label>

            <input
              type="number"
              min="100"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              placeholder="Enter amount"
              className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold">
              Phone number
              <span className="ml-1 font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <input
              type="tel"
              inputMode="numeric"
              maxLength={11}
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value.replace(/\D/g, "")
                )
              }
              placeholder="08012345678"
              className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none"
            />
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
            <h2 className="text-xl font-bold">
              Confirm Electricity Payment
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter your 4-digit transaction PIN.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm">
              <div className="flex justify-between">
                <span>Provider</span>
                <strong>{disco}</strong>
              </div>

              <div className="mt-2 flex justify-between">
                <span>Meter</span>
                <strong>{meterNumber}</strong>
              </div>

              <div className="mt-2 flex justify-between">
                <span>Type</span>
                <strong>{meterType}</strong>
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
                onClick={handlePayment}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0F766E] py-3 font-semibold text-white disabled:opacity-40"
              >
                {processing ? (
                  <>
                    <Loader2
                      className="animate-spin"
                      size={18}
                    />
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