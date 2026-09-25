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

    if (!examName || !quantity || !amount || !pin) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const validPin = await verifyTransactionPin(pin);

      if (!validPin) {
        throw new Error("Invalid transaction PIN.");
      }

      const response = await buyExamPin({
        examName,
        quantity: Number(quantity),
        amount: Number(amount),
      });

      setResult({
  pin: response.response.pin,
  serial: response.response.serial,
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
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
            <GraduationCap className="h-6 w-6 text-teal-700" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Exam PIN
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Purchase examination PINs securely.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Examination
              </label>

              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600"
              >
                <option value="">Select examination</option>

                {exams.map((exam) => (
                  <option key={exam.value} value={exam.value}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
                placeholder="1"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Amount
              </label>

              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
                placeholder="Enter amount"
              />
            </div>

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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
                placeholder="••••"
              />
            </div>

            {message && (
              <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                {message}
              </div>
            )}

            {result && (
              <div className="rounded-2xl bg-teal-50 p-4">
                <p className="mb-2 text-sm font-semibold text-teal-900">
                  Your exam PIN
                </p>

                {result.pin && (
                  <p className="text-sm text-gray-800">
                    PIN:{" "}
                    <span className="font-bold">{result.pin}</span>
                  </p>
                )}

                {result.serial && (
                  <p className="mt-1 text-sm text-gray-800">
                    Serial:{" "}
                    <span className="font-bold">{result.serial}</span>
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
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