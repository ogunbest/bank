"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  buyDataPin,
  getDataPlans,
} from "@/lib/actions/services.actions";
import { verifyTransactionPin } from "@/lib/actions/user.actions";

const networks = [
  { name: "MTN", code: "1" },
  { name: "GLO", code: "2" },
  { name: "9mobile", code: "3" },
  { name: "Airtel", code: "4" },
];

type DataPlan = {
  data_plan_id: number;
  the_network_name: string;
  size: string;
  price_for_basicuser: string;
  duration: string;
  status: string;
};

export default function DataPinPage() {
  const [network, setNetwork] = useState("");
  const [plans, setPlans] = useState<DataPlan[]>([]);
  const [plan, setPlan] = useState("");
  const [amount, setAmount] = useState("");

  const [quantity, setQuantity] = useState("1");
  const [businessName, setBusinessName] = useState("");

  const [loadingPlans, setLoadingPlans] = useState(false);
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!network) {
      setPlans([]);
      setPlan("");
      setAmount("");
      return;
    }

    const loadPlans = async () => {
      try {
        setLoadingPlans(true);
        setPlan("");
        setAmount("");

        const result = await getDataPlans();

        const allPlans = Array.isArray(result.dataplans)
          ? (result.dataplans as DataPlan[])
          : [];

        const selectedNetwork = networks.find(
          (item) => item.name === network
        );

        const filtered = allPlans.filter(
          (item) =>
            item.status?.toLowerCase() === "on" &&
            item.the_network_name?.toUpperCase() ===
              selectedNetwork?.name.toUpperCase()
        );

        setPlans(filtered);
      } catch (error) {
        console.error("DATA PIN PLANS ERROR:", error);
        setPlans([]);
      } finally {
        setLoadingPlans(false);
      }
    };

    loadPlans();
  }, [network]);

  const canContinue =
    Boolean(network) &&
    Boolean(plan) &&
    Number(quantity) > 0 &&
    Boolean(businessName.trim()) &&
    Number(amount) > 0;

  const handlePurchase = async () => {
    if (!canContinue || pin.length !== 4) return;

    try {
      setProcessing(true);

      await verifyTransactionPin(pin);

      const selectedNetwork = networks.find(
        (item) => item.name === network
      );

      if (!selectedNetwork) {
        throw new Error("Please select a network.");
      }

      const result = await buyDataPin({
        network: selectedNetwork.code,
        quantity: Number(quantity),
        dataPlan: plan,
        businessName: businessName.trim(),
        amount: Number(amount),
      });

      if (result.status === "processing") {
        alert(
          "Your Data PIN purchase is being processed. Check Transactions for the status."
        );
      } else {
        alert("Data PIN purchased successfully.");
      }

      setNetwork("");
      setPlans([]);
      setPlan("");
      setAmount("");
      setQuantity("1");
      setBusinessName("");
      setPin("");
      setShowPin(false);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Data PIN purchase failed."
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
              <Wifi size={24} />
            </div>

            <h1 className="text-2xl font-bold">
              Data PIN
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Purchase data PINs for your business.
            </p>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold">
              Network
            </label>

            <div className="grid grid-cols-2 gap-3">
              {networks.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setNetwork(item.name)}
                  className={`rounded-2xl border p-4 font-semibold ${
                    network === item.name
                      ? "border-[#0F766E] bg-teal-50 text-[#0F766E]"
                      : "border-slate-200"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold">
              Data plan
            </label>

            <select
              value={plan}
              disabled={!network || loadingPlans}
              onChange={(e) => {
                const selected = plans.find(
                  (item) =>
                    String(item.data_plan_id) ===
                    e.target.value
                );

                setPlan(e.target.value);
                setAmount(
                  selected
                    ? selected.price_for_basicuser
                    : ""
                );
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none disabled:bg-slate-50"
            >
              <option value="">
                {!network
                  ? "Select network first"
                  : loadingPlans
                  ? "Loading plans..."
                  : plans.length === 0
                  ? "No plans available"
                  : "Select data plan"}
              </option>

              {plans.map((item) => (
                <option
                  key={item.data_plan_id}
                  value={item.data_plan_id}
                >
                  {item.size} — ₦
                  {Number(
                    item.price_for_basicuser
                  ).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none"
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold">
              Business name
            </label>

            <input
              type="text"
              value={businessName}
              onChange={(e) =>
                setBusinessName(e.target.value)
              }
              placeholder="Enter business name"
              className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none"
            />
          </div>

          {amount && (
            <div className="mb-6 rounded-2xl bg-teal-50 p-4">
              <p className="text-xs text-teal-700">
                Price per PIN
              </p>

              <p className="mt-1 text-2xl font-bold text-teal-800">
                ₦{Number(amount).toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-teal-700">
                Total: ₦
                {(
                  Number(amount) *
                  Number(quantity || 0)
                ).toLocaleString()}
              </p>
            </div>
          )}

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
              Confirm Data PIN
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter your 4-digit transaction PIN.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm">
              <div className="flex justify-between">
                <span>Network</span>
                <strong>{network}</strong>
              </div>

              <div className="mt-2 flex justify-between">
                <span>Quantity</span>
                <strong>{quantity}</strong>
              </div>

              <div className="mt-2 flex justify-between">
                <span>Total</span>
                <strong>
                  ₦
                  {(
                    Number(amount) *
                    Number(quantity)
                  ).toLocaleString()}
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
                onClick={handlePurchase}
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