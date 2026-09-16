"use client";

import { useEffect, useState } from "react";
import { PiggyBank, Plus, Loader2 } from "lucide-react";

import {
  createSavingsGoal,
  getSavingsGoals,
  addToSavingsGoal,
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

export default function SavingsGoals({
  onBalanceChange,
}: SavingsGoalsProps) {
    const [addingGoalId, setAddingGoalId] = useState<string | null>(null);
const [addAmount, setAddAmount] = useState("");
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [goal, setGoal] = useState("");
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function loadGoals() {
    try {
      const data = await getSavingsGoals();
      setGoals(data as SavingsGoal[]);
    } catch (error) {
      console.error("LOAD SAVINGS GOALS ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGoals();
  }, []);

  async function handleCreateGoal() {
    const amount = Number(target);

    if (!goal.trim() || !amount || amount <= 0) {
      alert("Enter a goal name and target amount.");
      return;
    }

    try {
      setCreating(true);

      const newGoal = await createSavingsGoal(
        goal.trim(),
        amount
      );

      setGoals((current) => [
        ...current,
        newGoal as SavingsGoal,
      ]);

      setGoal("");
      setTarget("");
    } catch (error) {
      console.error("CREATE SAVINGS GOAL ERROR:", error);
      alert("Unable to create savings goal.");
    } finally {
      setCreating(false);
    }
  }
  async function handleAddMoney(goalId: string) {
  const amount = Number(addAmount);

  if (!amount || amount <= 0) {
    alert("Enter a valid amount.");
    return;
  }

  try {
    const updated = await addToSavingsGoal(goalId, amount);

await onBalanceChange?.();

setGoals((current) =>
  current.map((item) =>
    item.$id === goalId
      ? {
          ...item,
          savedAmount: Number(updated.savedAmount),
        }
      : item
  )
);

    setAddAmount("");
    setAddingGoalId(null);
  } catch (error) {
    console.error("ADD SAVINGS ERROR:", error);
    alert("Unable to add money.");
  }
}

  return (
    <div className="rounded-2xl bg-gray-800/70 border border-gray-700 p-6">

      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
          <PiggyBank className="text-green-400" size={20} />
        </div>

        <div>
          <h3 className="text-white font-semibold">
            Savings Goals
          </h3>

          <p className="text-gray-400 text-sm">
            Save towards something important
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Goal name"
          className="rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-white outline-none"
        />

        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target amount"
          className="rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-white outline-none"
        />

        <button
          onClick={handleCreateGoal}
          disabled={creating}
          className="rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {creating ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus size={18} />
              Create Goal
            </>
          )}
        </button>

      </div>

      <div className="mt-6 space-y-4">

        {loading ? (
          <p className="text-gray-400 text-sm">
            Loading goals...
          </p>
        ) : goals.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No savings goals yet.
          </p>
        ) : (
          goals.map((item) => {
            const progress =
              item.targetAmount > 0
                ? Math.min(
                    (item.savedAmount /
                      item.targetAmount) *
                      100,
                    100
                  )
                : 0;

            return (
              <div
                key={item.$id}
                className="rounded-xl bg-gray-900/70 border border-gray-700 p-4"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-white font-medium">
                    {item.name}
                  </span>

                  <span className="text-gray-400 text-sm">
                    ₦{item.savedAmount.toLocaleString()} / ₦
                    {item.targetAmount.toLocaleString()}
                  </span>
                </div>

                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <p className="text-gray-500 text-xs mt-2">
                  {Math.round(progress)}% saved
                </p>
                {addingGoalId === item.$id ? (
  <div className="mt-3 flex gap-2">
    <input
      type="number"
      value={addAmount}
      onChange={(e) => setAddAmount(e.target.value)}
      placeholder="Amount"
      className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white outline-none"
    />

    <button
      onClick={() => handleAddMoney(item.$id)}
      className="rounded-lg bg-green-600 hover:bg-green-500 px-4 py-2 text-sm font-medium text-white"
    >
      Add
    </button>

    <button
      onClick={() => {
        setAddingGoalId(null);
        setAddAmount("");
      }}
      className="rounded-lg bg-gray-700 hover:bg-gray-600 px-3 py-2 text-sm text-gray-300"
    >
      Cancel
    </button>
  </div>
) : (
  <button
    onClick={() => setAddingGoalId(item.$id)}
    className="mt-3 w-full rounded-lg bg-green-600 hover:bg-green-500 py-2 text-sm font-medium text-white transition"
  >
    + Add Money
  </button>
)}
              </div>
            );
          })
        )}

      </div>
    </div>
  );
}