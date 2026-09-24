"use client";

import { logoutAccount } from "@/lib/actions/user.actions";
import { LogOut, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Footer = ({ user, type = "desktop" }: FooterProps) => {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const firstName = user?.firstName || "User";
  const email = user?.email || "";

  const handleLogOut = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const loggedOut = await logoutAccount();

      if (loggedOut) {
        router.push("/sign-in");
      }
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <footer
      className={`border-t border-slate-200 bg-white ${
        type === "mobile" ? "px-4 py-4" : "px-4 py-5"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
          {firstName ? (
            <span className="text-sm font-bold">
              {firstName.charAt(0).toUpperCase()}
            </span>
          ) : (
            <UserCircle size={21} />
          )}
        </div>

        {/* User details */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {firstName}
          </p>

          <p className="truncate text-xs text-slate-500">
            {email}
          </p>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogOut}
          disabled={loggingOut}
          aria-label="Log out"
          title="Log out"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut
            size={18}
            className={loggingOut ? "animate-pulse" : ""}
          />
        </button>
      </div>
    </footer>
  );
};

export default Footer;