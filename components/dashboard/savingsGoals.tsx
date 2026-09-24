"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  PiggyBank,
  Plus,
  Target,
} from "lucide-react";

import {
  addToSavingsGoal,
  createSavingsGoal,
  getSavingsGoals,
} from "@/lib/actions/savings-goals.actions";

interface SavingsGoal {
  $id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
}

interface SavingsGoalsProps {
  onBalanceChange?: () => Promise<void>;
}

const money = (amount: number) =>
  Number(amount || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function SavingsGoals({
  onBalanceChange,
}: SavingsGoalsProps) {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [goal, setGoal] = useState("");
  const [target, setTarget] = useState("");

  const [addingGoalId, setAddingGoalId] = useState<string | null>(
    null,
  );
  const [addAmount, setAddAmount] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  async function loadGoals() {
    try {
      setLoading(true);

      const data = await getSavingsGoals();

      setGoals(data as unknown as SavingsGoal[]);
    } catch (error) {
      console.error("LOAD SAVINGS GOALS ERROR:", error);
      setError("Unable to load your savings goals.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGoals();
  }, []);

  async function handleCreateGoal() {
    const amount = Number(target);

    setError("");

    if (!goal.trim()) {
      setError("Enter a name for your savings goal.");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Enter a valid target amount.");
      return;
    }

    try {
      setCreating(true);

      const newGoal = await createSavingsGoal(
        goal.trim(),
        amount,
      );

      setGoals((current) => [
        ...current,
        newGoal as unknown as SavingsGoal,
      ]);

      setGoal("");
      setTarget("");
    } catch (error) {
      console.error("CREATE SAVINGS GOAL ERROR:", error);
      setError("Unable to create savings goal.");
    } finally {
      setCreating(false);
    }
  }

  async function handleAddMoney(goalId: string) {
    const amount = Number(addAmount);

    setError("");

    if (!amount || amount <= 0) {
      setError("Enter a valid amount to save.");
      return;
    }

    try {
      setAdding(true);

      const updated = await addToSavingsGoal(
        goalId,
        amount,
      );

      setGoals((current) =>
        current.map((item) =>
          item.$id === goalId
            ? {
                ...item,
                savedAmount: Number(updated.savedAmount),
              }
            : item,
        ),
      );

      setAddAmount("");
      setAddingGoalId(null);

      await onBalanceChange?.();
    } catch (error) {
      console.error("ADD SAVINGS ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to add money.",
      );
    } finally {
      setAdding(false);
    }
  }

  const totalSaved = goals.reduce(
    (total, item) =>
      total + Number(item.savedAmount || 0),
    0,
  );

  const totalTarget = goals.reduce(
    (total, item) =>
      total + Number(item.targetAmount || 0),
    0,
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
            <PiggyBank size={22} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Savings Goals
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Save towards something important.
            </p>
          </div>
        </div>

        <div className="hidden rounded-xl bg-slate-50 p-2.5 text-slate-300 sm:block">
          <Target size={20} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Create goal */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Plus size={17} className="text-[#0F766E]" />

          <p className="text-sm font-bold text-slate-900">
            Create a savings goal
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            value={goal}
            onChange={(event) => {
              setGoal(event.target.value);
              setError("");
            }}
            placeholder="Goal name"
            disabled={creating}
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100 disabled:opacity-60"
          />

          <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-white px-4 focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-teal-100">
            <span className="font-semibold text-[#0F766E]">
              ₦
            </span>

            <input
              type="number"
              min="1"
              value={target}
              onChange={(event) => {
                setTarget(event.target.value);
                setError("");
              }}
              placeholder="Target amount"
              disabled={creating}
              className="w-full bg-transparent px-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-60"
            />
          </div>

          <button
            type="button"
            onClick={handleCreateGoal}
            disabled={creating}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Creating...
              </>
            ) : (
              <>
                <Plus size={17} />
                Create goal
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-teal-50 p-4">
          <p className="text-xs font-medium text-[#0F766E]">
            Total saved
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            ₦{money(totalSaved)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">
            Total target
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            ₦{money(totalTarget)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">
            Active goals
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {goals.length}
          </p>
        </div>
      </div>

      {/* Goals */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
            <Loader2
              size={18}
              className="animate-spin text-[#0F766E]"
            />
            Loading savings goals...
          </div>
        ) : goals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-300 shadow-sm">
              <PiggyBank size={25} />
            </div>

            <p className="mt-3 font-semibold text-slate-900">
              No savings goals yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first goal above.
            </p>
          </div>
        ) : (
          goals.map((item) => {
            const targetAmount = Number(
              item.targetAmount || 0,
            );

            const savedAmount = Number(
              item.savedAmount || 0,
            );

            const progress =
              targetAmount > 0
                ? Math.min(
                    (savedAmount / targetAmount) * 100,
                    100,
                  )
                : 0;

            const completed = progress >= 100;

            return (
              <article
                key={item.$id}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-teal-100 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-bold text-slate-900">
                        {item.name}
                      </h3>

                      {completed && (
                        <CheckCircle2
                          size={18}
                          className="shrink-0 text-[#0F766E]"
                        />
                      )}
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      ₦{money(savedAmount)} of ₦
                      {money(targetAmount)}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-bold text-[#0F766E]">
                    {Math.round(progress)}%
                  </span>
                </div>

                {/* Progress */}
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#0F766E] transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                {/* Add money */}
                {addingGoalId === item.$id ? (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <div className="flex flex-1 items-center rounded-xl border border-slate-200 bg-white px-4 focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-teal-100">
                      <span className="font-semibold text-[#0F766E]">
                        ₦
                      </span>

                      <input
                        type="number"
                        min="1"
                        value={addAmount}
                        onChange={(event) => {
                          setAddAmount(event.target.value);
                          setError("");
                        }}
                        placeholder="Amount to save"
                        disabled={adding}
                        className="w-full bg-transparent px-2 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleAddMoney(item.$id)
                      }
                      disabled={adding}
                      className="rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:opacity-50"
                    >
                      {adding ? (
                        <span className="flex items-center gap-2">
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                          Adding...
                        </span>
                      ) : (
                        "Add money"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAddingGoalId(null);
                        setAddAmount("");
                        setError("");
                      }}
                      disabled={adding}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : !completed ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAddingGoalId(item.$id);
                      setError("");
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] py-3 text-sm font-semibold text-white transition hover:bg-[#115E59]"
                  >
                    <Plus size={17} />
                    Add money
                  </button>
                ) : (
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-teal-50 px-4 py-3 text-sm font-semibold text-[#0F766E]">
                    <CheckCircle2 size={17} />
                    Goal completed
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}