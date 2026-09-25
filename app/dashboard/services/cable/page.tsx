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

const providers = [
  { name: "GOTV", code: "1" },
  { name: "DSTV", code: "2" },
  { name: "STARTIMES", code: "3" },
  { name: "SHOWMAX", code: "4" },
];

type CablePlan = {
  cabletv_plan_id: number;
  the_cabletv_name: string;
  size: string;
  price_for_basicuser: string;
  duration: number;
  status: string;
};

export default function CablePage() {
  const [provider, setProvider] = useState("");
  const [smartCard, setSmartCard] = useState("");
  const [customerName, setCustomerName] = useState("");

  const [plans, setPlans] = useState<CablePlan[]>([]);
  const [plan, setPlan] = useState("");
  const [amount, setAmount] = useState("");

  const [loadingPlans, setLoadingPlans] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!provider) {
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

        const result = await getCablePlans();

        const allPlans = Array.isArray(result.cabletvplans)
          ? (result.cabletvplans as CablePlan[])
          : [];

        const selected = providers.find(
          (item) => item.name === provider
        );

        const filtered = allPlans.filter(
          (item) =>
            item.status?.toLowerCase() === "on" &&
            item.the_cabletv_name?.toUpperCase() ===
              selected?.name.toUpperCase()
        );

        setPlans(filtered);
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
    if (!provider || !smartCard) {
      alert("Select a provider and enter your smart card number.");
      return;
    }

    try {
      setVerifying(true);
      setVerified(false);
      setCustomerName("");

      const result = await verifyCable({
        cableName: provider,
        smartCardNumber: smartCard,
      });

      const name = String(
        result.name ||
          result.Customer_Name ||
          result.customer_name ||
          ""
      );

      setCustomerName(name || "Customer verified");
      setVerified(true);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to verify account."
      );
    } finally {
      setVerifying(false);
    }
  };

  const canContinue =
    verified &&
    Boolean(plan) &&
    Number(amount) > 0;

  const handlePurchase = async () => {
    if (!canContinue || pin.length !== 4) return;

    try {
      setProcessing(true);

      await verifyTransactionPin(pin);

      const selectedProvider = providers.find(
        (item) => item.name === provider
      );

      if (!selectedProvider) {
        throw new Error("Please select a cable provider.");
      }

      const result = await buyCable({
        cableName: selectedProvider.code,
        smartCardNumber: smartCard,
        cablePlan: plan,
        amount: Number(amount),
      });

      if (result.status === "processing") {
        alert(
          "Your cable subscription is being processed. Check Transactions for the status."
        );
      } else {
        alert("Cable subscription successful.");
      }

      setSmartCard("");
      setCustomerName("");
      setVerified(false);
      setPlan("");
      setAmount("");
      setPin("");
      setShowPin(false);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Cable subscription failed."
      );
    } finally {
      setProcessing(false);
    }
  };

  const isShowmax = provider === "SHOWMAX";

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
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Tv size={24} />
            </div>

            <h1 className="text-2xl font-bold">
              Cable TV
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Renew your TV subscription.
            </p>
          </div>

          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold">
              Select provider
            </p>

            <div className="grid grid-cols-2 gap-3">
              {providers.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setProvider(item.name);
                    setVerified(false);
                    setCustomerName("");
                    setSmartCard("");
                  }}
                  className={`rounded-2xl border p-4 font-semibold transition ${
                    provider === item.name
                      ? "border-[#0F766E] bg-teal-50 text-[#0F766E] ring-2 ring-[#0F766E]/20"
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
              {isShowmax
                ? "Showmax phone number"
                : "Smart card / IUC number"}
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={smartCard}
                onChange={(e) => {
                  setSmartCard(
                    e.target.value.replace(/\D/g, "")
                  );
                  setVerified(false);
                  setCustomerName("");
                }}
                placeholder={
                  isShowmax
                    ? "08011111111"
                    : "Enter smart card number"
                }
                className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-4 outline-none"
              />

              <button
                type="button"
                onClick={handleVerify}
                disabled={
                  verifying ||
                  !provider ||
                  !smartCard
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
                  Account verified
                </p>

                <p className="font-semibold text-emerald-900">
                  {customerName}
                </p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold">
              Subscription plan
            </label>

            <select
              value={plan}
              disabled={!provider || !verified || loadingPlans}
              onChange={(e) => {
                const selected = plans.find(
                  (item) =>
                    String(item.cabletv_plan_id) ===
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
                {!provider
                  ? "Select provider first"
                  : !verified
                  ? "Verify account first"
                  : loadingPlans
                  ? "Loading plans..."
                  : plans.length === 0
                  ? "No plans available"
                  : "Select subscription plan"}
              </option>

              {plans.map((item) => (
                <option
                  key={item.cabletv_plan_id}
                  value={item.cabletv_plan_id}
                >
                  {item.size} — ₦
                  {Number(
                    item.price_for_basicuser
                  ).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {amount && (
            <div className="mb-6 rounded-2xl bg-teal-50 p-4">
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
              Confirm Subscription
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter your 4-digit transaction PIN.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm">
              <div className="flex justify-between">
                <span>Provider</span>
                <strong>{provider}</strong>
              </div>

              <div className="mt-2 flex justify-between">
                <span>Customer</span>
                <strong>{customerName}</strong>
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