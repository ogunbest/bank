"use client";

import { useEffect, useState } from "react";
import { Globe, Loader2 } from "lucide-react";

import {
  buyInternetBundle,
  getInternetBundlePlans,
} from "@/lib/actions/services.actions";
import { verifyTransactionPin } from "@/lib/actions/user.actions";

type InternetPlan = {
  internetBundles_plan_id: number;
  the_internetBundles_name: string;
  size: string;
  price_for_basicuser: string;
  duration: string;
  status: string;
};

const providers = [
  {
    name: "SMILE",
    code: "5",
    placeholder: "08011111111",
  },
  {
    name: "Spectranet",
    code: "6",
    placeholder: "1212121212",
  },
];

export default function InternetPage() {
  const [network, setNetwork] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [accountId, setAccountId] = useState("");
  const [plan, setPlan] = useState("");

  const [plans, setPlans] = useState<InternetPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const selectedPlan = plans.find(
    (item) =>
      String(item.internetBundles_plan_id) === plan
  );

  useEffect(() => {
    if (!network) {
      setPlans([]);
      setPlan("");
      return;
    }

    const loadPlans = async () => {
      try {
        setLoadingPlans(true);
        setMessage("");

        const response = await getInternetBundlePlans();

        const rawPlans = Array.isArray(
          response.internetbundles
        )
          ? response.internetbundles
          : [];

        const filtered = rawPlans.filter(
          (item: InternetPlan) =>
            String(item.status).toLowerCase() === "on"
        );

        setPlans(filtered);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to load internet plans."
        );
      } finally {
        setLoadingPlans(false);
      }
    };

    loadPlans();
  }, [network]);

  const handleSubmit = async () => {
    setMessage("");

    if (
      !network ||
      !mobileNumber ||
      !plan ||
      pin.length !== 4
    ) {
      setMessage(
        "Please complete all required fields."
      );
      return;
    }

    if (!selectedPlan) {
      setMessage(
        "Please select a valid internet plan."
      );
      return;
    }

    try {
      setLoading(true);

      await verifyTransactionPin(pin);

      const response = await buyInternetBundle({
        network,
        dataPlan: plan,
        mobileNumber,
        accountId:
          network === "5" ? accountId : undefined,
        amount: Number(
          selectedPlan.price_for_basicuser
        ),
      });

      if (!response?.success) {
        throw new Error(
          String(
            response?.response?.api_response ||
              response?.response?.message ||
              "Internet bundle purchase failed."
          )
        );
      }

      if (response.status === "processing") {
        setMessage(
          "Your internet bundle is being processed. Check Transactions for the status."
        );
      } else {
        setMessage(
          "Internet bundle purchased successfully."
        );
      }

      setMobileNumber("");
      setAccountId("");
      setPlan("");
      setPin("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Internet bundle purchase failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedProvider = providers.find(
    (item) => item.code === network
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white md:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
            <Globe className="h-6 w-6" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Internet Bundle
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Purchase internet bundles for Smile or
            Spectranet.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Provider
              </label>

              <select
                value={network}
                onChange={(e) => {
                  setNetwork(e.target.value);
                  setPlan("");
                  setMobileNumber("");
                  setAccountId("");
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">
                  Select provider
                </option>

                {providers.map((provider) => (
                  <option
                    key={provider.code}
                    value={provider.code}
                  >
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProvider && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {selectedProvider.name} Number
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  value={mobileNumber}
                  onChange={(e) =>
                    setMobileNumber(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  placeholder={
                    selectedProvider.placeholder
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            )}

            {network === "5" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Smile Account ID
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  value={accountId}
                  onChange={(e) =>
                    setAccountId(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  placeholder="08011111111"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Data Plan
              </label>

              {loadingPlans ? (
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading plans...
                </div>
              ) : (
                <select
                  value={plan}
                  onChange={(e) =>
                    setPlan(e.target.value)
                  }
                  disabled={
                    !network || plans.length === 0
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/60 dark:disabled:text-slate-500"
                >
                  <option value="">
                    {plans.length
                      ? "Select data plan"
                      : "No plans available"}
                  </option>

                  {plans.map((item) => (
                    <option
                      key={item.internetBundles_plan_id}
                      value={item.internetBundles_plan_id}
                    >
                      {item.size} - ₦
                      {Number(
                        item.price_for_basicuser
                      ).toLocaleString()}{" "}
                      ({item.duration})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedPlan && (
              <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 dark:border-teal-900/60 dark:bg-teal-950/40">
                <p className="text-sm text-teal-700 dark:text-teal-400">
                  Amount
                </p>

                <p className="mt-1 text-lg font-bold text-teal-900 dark:text-teal-300">
                  ₦
                  {Number(
                    selectedPlan.price_for_basicuser
                  ).toLocaleString()}
                </p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Transaction PIN
              </label>

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
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-lg tracking-[0.4em] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            {message && (
              <div
                className={`rounded-2xl p-4 text-sm ${
                  message.toLowerCase().includes("success")
                    ? "border border-emerald-100 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || loadingPlans}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F766E] px-4 py-4 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-teal-600 dark:hover:bg-teal-500"
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {loading
                ? "Processing..."
                : "Buy Internet Bundle"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}