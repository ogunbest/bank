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
    (item) => String(item.internetBundles_plan_id) === plan
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

        const rawPlans = Array.isArray(response.internetbundles)
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

    if (!network || !mobileNumber || !plan || !pin) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (!selectedPlan) {
      setMessage("Please select a valid internet plan.");
      return;
    }

    try {
      setLoading(true);

      const validPin = await verifyTransactionPin(pin);

      if (!validPin) {
        throw new Error("Invalid transaction PIN.");
      }

      const response = await buyInternetBundle({
        network,
        dataPlan: plan,
        mobileNumber,
        accountId: network === "5" ? accountId : undefined,
        amount: Number(selectedPlan.price_for_basicuser),
      });

      const status = String(response.status || "").toLowerCase();

      if (status === "successful" || status === "success") {
        setMessage("Internet bundle purchased successfully.");

        setMobileNumber("");
        setAccountId("");
        setPlan("");
        setPin("");
      } else {
        setMessage(
          String(
  response.response.api_response ||
    response.response.message ||
    "Internet bundle purchase failed."
)
        );
      }
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
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
            <Globe className="h-6 w-6 text-teal-700" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Internet Bundle
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Purchase internet bundles for Smile or Spectranet.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Provider
              </label>

              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600"
              >
                <option value="">Select provider</option>

                {providers.map((provider) => (
                  <option key={provider.code} value={provider.code}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProvider && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {selectedProvider.name} Number
                </label>

                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) =>
                    setMobileNumber(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  placeholder={selectedProvider.placeholder}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
                />
              </div>
            )}

            {network === "5" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Smile Account ID
                </label>

                <input
                  type="text"
                  value={accountId}
                  onChange={(e) =>
                    setAccountId(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  placeholder="08011111111"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Data Plan
              </label>

              {loadingPlans ? (
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading plans...
                </div>
              ) : (
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  disabled={!network || plans.length === 0}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600 disabled:bg-gray-50"
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
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Amount
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                  ₦
                  {Number(
                    selectedPlan.price_for_basicuser
                  ).toLocaleString()}
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

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || loadingPlans}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {loading ? "Processing..." : "Buy Internet Bundle"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}