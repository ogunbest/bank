"use client";

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
      : "active"
  );

  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setLoading(true);

      const newStatus =
        status === "active" ? "disabled" : "active";

      await updateUserStatus({
        userId,
        status: newStatus,
      });

      setStatus(newStatus);
    } catch (error) {
      console.error(error);
      alert("Failed to update user status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="mt-4 rounded-lg bg-gray-700 px-5 py-3 font-medium hover:bg-gray-600 disabled:opacity-50"
    >
      {loading
        ? "Updating..."
        : status === "active"
        ? "Disable User"
        : "Enable User"}
    </button>
  );
}