"use client";

import { useState } from "react";
import { Loader2, GraduationCap } from "lucide-react";

import { buyExamPin } from "@/lib/actions/services.actions";
import { verifyTransactionPin } from "@/lib/actions/user.actions";

const exams = [
  { name: "WAEC", value: "1" },
  { name: "NECO", value: "2" },
  { name: "NABTEB", value: "3" },
  { name: "JAMB", value: "4" },
  { name: "WAEC Registration", value: "5" },
  { name: "NBAIS", value: "6" },
];

export default function ExamPage() {
  const [examName, setExamName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<{
    pin?: string;
    serial?: string;
  } | null>(null);

  const handleSubmit = async () => {
    setMessage("");
    setResult(null);

    const qty = Number(quantity);
    const price = Number(amount);

    if (
      !examName ||
      !Number.isFinite(qty) ||
      qty < 1 ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setMessage(
        "Please enter valid examination, quantity, and amount."
      );
      return;
    }

    if (pin.length !== 4) {
      setMessage("Enter your 4-digit transaction PIN.");
      return;
    }

    try {
      setLoading(true);

      await verifyTransactionPin(pin);

      const response = await buyExamPin({
        examName,
        quantity: qty,
        amount: price,
      });

      if (!response?.success) {
        throw new Error(
          String(
            response?.response?.api_response ||
              response?.response?.message ||
              "Exam PIN purchase failed."
          )
        );
      }

      if (response.status === "processing") {
        setMessage(
          "Your exam PIN purchase is being processed. Check Transactions for the status."
        );
        return;
      }

      const providerResponse = response.response as
        | {
            pin?: string;
            serial?: string;
          }
        | undefined;

      setResult({
        pin: providerResponse?.pin,
        serial: providerResponse?.serial,
      });

      setMessage("Exam PIN purchased successfully.");

      setExamName("");
      setQuantity("1");
      setAmount("");
      setPin("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Exam PIN purchase failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white md:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
            <GraduationCap className="h-6 w-6" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Exam PIN
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Purchase examination PINs securely.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Examination
              </label>

              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">
                  Select examination
                </option>

                {exams.map((exam) => (
                  <option key={exam.value} value={exam.value}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                placeholder="1"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Amount
              </label>

              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                placeholder="Enter amount"
              />
            </div>

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
                  setPin(e.target.value.replace(/\D/g, ""))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                placeholder="••••"
              />
            </div>

            {message && (
              <div
                className={`rounded-2xl p-4 text-sm ${
                  result
                    ? "border border-emerald-100 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {message}
              </div>
            )}

            {result && (
              <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 dark:border-teal-900/60 dark:bg-teal-950/40">
                <p className="mb-3 text-sm font-semibold text-teal-800 dark:text-teal-300">
                  Your exam PIN
                </p>

                {result.pin && (
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    PIN:{" "}
                    <span className="font-bold text-slate-900 dark:text-white">
                      {result.pin}
                    </span>
                  </p>
                )}

                {result.serial && (
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                    Serial:{" "}
                    <span className="font-bold text-slate-900 dark:text-white">
                      {result.serial}
                    </span>
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F766E] px-4 py-4 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-teal-600 dark:hover:bg-teal-500"
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {loading ? "Processing..." : "Buy Exam PIN"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}