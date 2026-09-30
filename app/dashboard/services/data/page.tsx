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
          (item) => item.name === network,
        );

        const allPlans = Array.isArray(result.dataplans)
          ? (result.dataplans as DataPlan[])
          : [];

        const filteredPlans = allPlans.filter(
          (item) =>
            item.status?.toLowerCase() === "on" &&
            item.the_network_name?.toUpperCase() ===
              selectedNetwork?.name.toUpperCase(),
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
    Number(amount) > 0 &&
    !loadingPlans;

  const handlePurchase = async () => {
    if (!canContinue || pin.length !== 4 || processing) return;

    try {
      setProcessing(true);

      const selectedNetwork = networks.find(
        (item) => item.name === network,
      );

      if (!selectedNetwork) {
        throw new Error("Please select a network.");
      }

      await verifyTransactionPin(pin);

      const result = await buyData({
        network: selectedNetwork.code,
        phone,
        plan,
        amount: Number(amount),
      });

      if (!result?.success) {
        throw new Error("Data purchase failed.");
      }

      if (result.status === "processing") {
        alert(
          "Your data purchase is being processed. Check Transactions for the status.",
        );
      } else {
        alert(
          `₦${Number(amount).toLocaleString()} data purchased successfully.`,
        );
      }

      setNetwork("");
      setPhone("");
      setPlan("");
      setAmount("");
      setPlans([]);
      setPin("");
      setShowPin(false);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Data purchase failed.",
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
          {/* HEADER */}
          <div className="mb-7">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
              <Wifi size={24} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Buy Data
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Purchase a data bundle for any Nigerian network.
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
                  onClick={() => {
                    setNetwork(item.name);
                    setPlan("");
                    setAmount("");
                  }}
                  className={`flex items-center gap-3 rounded-2xl border p-4 transition ${
                    network === item.name
                      ? "border-[#0F766E] bg-teal-50 text-[#0F766E] ring-2 ring-[#0F766E]/20 dark:border-teal-500 dark:bg-teal-950/40 dark:text-teal-400 dark:ring-teal-500/20"
                      : "border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-teal-50/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-800 dark:hover:bg-teal-950/30"
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
                  setPhone(
                    e.target.value.replace(/\D/g, ""),
                  )
                }
                placeholder="08012345678"
                className="w-full bg-transparent py-4 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* DATA PLAN */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">
              Data plan
            </label>

            <select
              value={plan}
              onChange={(e) => {
                const selected = plans.find(
                  (item) =>
                    String(item.data_plan_id) ===
                    e.target.value,
                );

                setPlan(e.target.value);
                setAmount(
                  selected
                    ? selected.price_for_basicuser
                    : "",
                );
              }}
              disabled={!network || loadingPlans}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-teal-500 disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/60"
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
                    item.price_for_basicuser,
                  ).toLocaleString()}{" "}
                  ({item.duration} days)
                </option>
              ))}
            </select>
          </div>

          {/* AMOUNT */}
          {amount && (
            <div className="mb-5 rounded-2xl border border-teal-100 bg-teal-50 p-4 dark:border-teal-900/60 dark:bg-teal-950/40">
              <p className="text-xs text-teal-700 dark:text-teal-400">
                Amount to pay
              </p>

              <p className="mt-1 text-2xl font-bold text-teal-800 dark:text-teal-300">
                ₦{Number(amount).toLocaleString()}
              </p>
            </div>
          )}

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
              Confirm Data Purchase
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Enter your 4-digit transaction PIN.
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
                  Data
                </span>

                <strong className="text-slate-900 dark:text-white">
                  {
                    plans.find(
                      (item) =>
                        String(item.data_plan_id) === plan,
                    )?.size
                  }
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
                setPin(
                  e.target.value.replace(/\D/g, ""),
                )
              }
              placeholder="••••"
              className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-2xl tracking-[0.5em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-600"
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
                disabled={
                  processing || pin.length !== 4
                }
                onClick={handlePurchase}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0F766E] py-3 font-semibold text-white transition hover:bg-[#115E59] disabled:opacity-40 dark:hover:bg-teal-600"
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