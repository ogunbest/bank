"use client";

import { CheckCircle2, Loader2, Power } from "lucide-react";
import { useState } from "react";

import { updateUserStatus } from "@/lib/actions/user.actions";

export default function UserStatusButton({
  userId,
  currentStatus,
}: {
  userId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(
    currentStatus?.trim().toLowerCase() === "disabled"
      ? "disabled"
      : "active",
  );

  const [loading, setLoading] = useState(false);

  const isActive = status === "active";

  const handleToggle = async () => {
    try {
      setLoading(true);

      const newStatus = isActive
        ? "disabled"
        : "active";

      await updateUserStatus({
        userId,
        status: newStatus,
      });

      setStatus(newStatus);
    } catch (error) {
      console.error("UPDATE USER STATUS ERROR:", error);
      alert("Failed to update user status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {/* Current status */}
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
          isActive
            ? "border-teal-100 bg-teal-50 text-[#0F766E]"
            : "border-red-100 bg-red-50 text-red-500"
        }`}
      >
        {isActive ? (
          <CheckCircle2 size={14} />
        ) : (
          <Power size={14} />
        )}

        {isActive ? "Active" : "Disabled"}
      </div>

      {/* Toggle */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
          isActive
            ? "border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
            : "bg-[#0F766E] text-white hover:bg-[#115E59]"
        }`}
      >
        {loading ? (
          <>
            <Loader2
              size={16}
              className="animate-spin"
            />
            Updating...
          </>
        ) : isActive ? (
          <>
            <Power size={16} />
            Disable User
          </>
        ) : (
          <>
            <CheckCircle2 size={16} />
            Enable User
          </>
        )}
      </button>
    </div>
  );
}