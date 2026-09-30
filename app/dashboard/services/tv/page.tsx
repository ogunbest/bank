"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Tv,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  buyCable,
  getCablePlans,
  verifyCable,
} from "@/lib/actions/services.actions";
import { verifyTransactionPin } from "@/lib/actions/user.actions";

const cableProviders = [
  { name: "DStv", value: "dstv" },
  { name: "GOtv", value: "gotv" },
  { name: "Startimes", value: "startimes" },
];

type CablePlan = {
  cableplan_id?: string | number;
  cableplan?: string;
  name?: string;
  price?: string | number;
  amount?: string | number;
  duration?: string;
  [key: string]: unknown;
};

export default function TVPage() {
  const [provider, setProvider] = useState("");
  const [smartCardNumber, setSmartCardNumber] = useState("");

  const [verified, setVerified] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [plans, setPlans] = useState<CablePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [amount, setAmount] = useState("");
  const [loadingPlans, setLoadingPlans] = useState(false);

  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!provider) {
      setPlans([]);
      setSelectedPlan("");
      setAmount("");
      return;
    }

    const loadPlans = async () => {
      try {
        setLoadingPlans(true);

        const result = await getCablePlans();

        const allPlans = Array.isArray(result.cabletvplans)
          ? (result.cabletvplans as CablePlan[])
          : [];

        setPlans(allPlans);
      } catch (error) {
        console.error("CABLE PLANS ERROR:", error);
        setPlans([]);
      } finally {
        setLoadingPlans(false);
      }
    };

    loadPlans();
  }, [provider]);

  const handleVerify = async () => {
    if (!provider || !smartCardNumber) {
      alert("Select a TV provider and enter your Smart Card number.");
      return;
    }

    try {
      setVerifying(true);
      setVerified(false);
      setCustomerName("");

      const result = await verifyCable({
        cableName: provider,
        smartCardNumber,
      });

      const name = String(
        result.name ||
          result.customer_name ||
          result.customerName ||
          ""
      );

      setCustomerName(name || "Smart Card verified");
      setVerified(true);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to verify Smart Card."
      );
    } finally {
      setVerifying(false);
    }
  };

  const canContinue =
    verified &&
    Boolean(selectedPlan) &&
    Number(amount) > 0;

  const handlePayment = async () => {
    if (!canContinue || pin.length !== 4 || processing) return;

    try {
      setProcessing(true);

      await verifyTransactionPin(pin);

      const result = await buyCable({
        cableName: provider,
        smartCardNumber,
        cablePlan: selectedPlan,
        amount: Number(amount),
      });

      if (!result?.success) {
        throw new Error("TV subscription could not be completed.");
      }

      if (result.status === "processing") {
        alert(
          "Your TV subscription is being processed. Check Transactions for the status."
        );
      } else {
        alert("TV subscription successful.");
      }

      setProvider("");
      setSmartCardNumber("");
      setVerified(false);
      setCustomerName("");
      setPlans([]);
      setSelectedPlan("");
      setAmount("");
      setPin("");
      setShowPin(false);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "TV subscription failed."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-[#0F766E] dark:text-slate-400 dark:hover:text-teal-400"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="mb-7">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
              <Tv size={24} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              TV Subscription
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Pay your TV subscription securely.
            </p>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              TV provider
            </label>

            <select
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                setVerified(false);
                setCustomerName("");
                setSelectedPlan("");
                setAmount("");
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Select provider</option>

              {cableProviders.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Smart Card / IUC number
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={smartCardNumber}
                onChange={(e) => {
                  setSmartCardNumber(
                    e.target.value.replace(/\D/g, "")
                  );
                  setVerified(false);
                  setCustomerName("");
                }}
                placeholder="Enter Smart Card number"
                className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />

              <button
                type="button"
                onClick={handleVerify}
                disabled={
                  verifying ||
                  !provider ||
                  !smartCardNumber
                }
                className="rounded-2xl bg-slate-900 px-5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-700 dark:hover:bg-slate-600"
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
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <CheckCircle2
                size={20}
                className="shrink-0 text-emerald-600 dark:text-emerald-400"
              />

              <div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Account verified
                </p>

                <p className="font-semibold text-emerald-900 dark:text-emerald-300">
                  {customerName}
                </p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Subscription plan
            </label>

            <select
              value={selectedPlan}
              disabled={!provider || loadingPlans}
              onChange={(e) => {
                const value = e.target.value;

                const selected = plans.find(
                  (item) =>
                    String(
                      item.cableplan_id ??
                        item.cableplan ??
                        item.name ??
                        ""
                    ) === value
                );

                setSelectedPlan(value);

                const selectedAmount =
                  selected?.price ?? selected?.amount ?? "";

                setAmount(String(selectedAmount));
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-teal-500 disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/60"
            >
              <option value="">
                {!provider
                  ? "Select provider first"
                  : loadingPlans
                  ? "Loading plans..."
                  : plans.length === 0
                  ? "No plans available"
                  : "Select subscription plan"}
              </option>

              {plans.map((item, index) => {
                const planId = String(
                  item.cableplan_id ??
                    item.cableplan ??
                    item.name ??
                    index
                );

                const planName =
                  item.name ??
                  item.cableplan ??
                  `Plan ${index + 1}`;

                const planPrice =
                  item.price ?? item.amount ?? "";

                return (
                  <option key={planId} value={planId}>
                    {planName} — ₦
                    {Number(planPrice).toLocaleString()}
                  </option>
                );
              })}
            </select>
          </div>

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

          <button
            type="button"
            disabled={!canContinue || processing}
            onClick={() => setShowPin(true)}
            className="w-full rounded-2xl bg-[#0F766E] py-4 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-teal-600 dark:hover:bg-teal-500"
          >
            Continue
          </button>
        </div>
      </div>

      {showPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Confirm TV Subscription
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Enter your 4-digit transaction PIN.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">
                  Provider
                </span>

                <strong className="text-slate-900 dark:text-white">
                  {provider}
                </strong>
              </div>

              <div className="mt-2 flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">
                  Smart Card
                </span>

                <strong className="text-right text-slate-900 dark:text-white">
                  {smartCardNumber}
                </strong>
              </div>

              <div className="mt-2 flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">
                  Amount
                </span>

                <strong className="text-slate-900 dark:text-white">
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
              className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-2xl tracking-[0.5em] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                disabled={processing}
                onClick={() => setShowPin(false)}
                className="flex-1 rounded-2xl bg-slate-100 py-3 font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  processing || pin.length !== 4
                }
                onClick={handlePayment}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0F766E] py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-teal-600 dark:hover:bg-teal-500"
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