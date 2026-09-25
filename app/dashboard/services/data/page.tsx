"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Phone,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  buyData,
  getDataPlans,
} from "@/lib/actions/services.actions";
import { verifyTransactionPin } from "@/lib/actions/user.actions";

const networks = [
  { name: "MTN", code: "1", logo: "/mtn.png" },
  { name: "Airtel", code: "4", logo: "/airtel.png" },
  { name: "Glo", code: "2", logo: "/glo.png" },
  { name: "9mobile", code: "3", logo: "/9mobile.png" },
];

type DataPlan = {
  data_plan_id: number;
  the_network_name: string;
  size: string;
  price_for_basicuser: string;
  duration: string;
  status: string;
};

export default function DataPage() {
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("");
  const [amount, setAmount] = useState("");
  const [plans, setPlans] = useState<DataPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!network) {
      setPlans([]);
      return;
    }

    const loadPlans = async () => {
      try {
        setLoadingPlans(true);
        setPlan("");
        setAmount("");

        const result = await getDataPlans();

        const selectedNetwork = networks.find(
          (item) => item.name === network
        );

        const allPlans = Array.isArray(result.dataplans)
          ? (result.dataplans as DataPlan[])
          : [];

        const filteredPlans = allPlans.filter(
          (item) =>
            item.status?.toLowerCase() === "on" &&
            item.the_network_name?.toUpperCase() ===
              selectedNetwork?.name.toUpperCase()
        );

        setPlans(filteredPlans);
      } catch (error) {
        console.error("DATA PLANS ERROR:", error);
        setPlans([]);
      } finally {
        setLoadingPlans(false);
      }
    };

    loadPlans();
  }, [network]);

  const canContinue =
    Boolean(network) &&
    /^0\d{10}$/.test(phone) &&
    Boolean(plan) &&
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

      const result = await buyData({
        network: selectedNetwork.code,
        phone,
        plan,
        amount: Number(amount),
      });

      if (result.status === "processing") {
        alert(
          "Your data purchase is being processed. Check Transactions for the status."
        );
      } else {
        alert(
          `₦${Number(amount).toLocaleString()} data purchased successfully.`
        );
      }

      setPhone("");
      setPlan("");
      setAmount("");
      setPin("");
      setShowPin(false);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Data purchase failed."
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
              Buy Data
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Purchase a data bundle for any Nigerian network.
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

                  <span className="font-semibold">
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
                  setPhone(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="08012345678"
                className="w-full bg-transparent py-4 outline-none"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold">
              Data plan
            </label>

            <select
              value={plan}
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
              disabled={!network || loadingPlans}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none disabled:bg-slate-50"
            >
              <option value="">
                {!network
                  ? "Select network first"
                  : loadingPlans
                  ? "Loading data plans..."
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
                  ).toLocaleString()}{" "}
                  ({item.duration} days)
                </option>
              ))}
            </select>
          </div>

          {amount && (
            <div className="mb-5 rounded-2xl bg-teal-50 p-4">
              <p className="text-xs text-teal-700">
                Amount to pay
              </p>

              <p className="mt-1 text-2xl font-bold text-teal-800">
                ₦{Number(amount).toLocaleString()}
              </p>
            </div>
          )}

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
              Confirm Data Purchase
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
                <span>Phone</span>
                <strong>{phone}</strong>
              </div>

              <div className="mt-2 flex justify-between">
                <span>Data</span>
                <strong>
                  {
                    plans.find(
                      (item) =>
                        String(item.data_plan_id) === plan
                    )?.size
                  }
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