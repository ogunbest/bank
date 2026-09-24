"use client";

import {
  Bell,
  ChevronDown,
  Search,
  Settings,
  UserCircle,
} from "lucide-react";
import Link from "next/link";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 hidden h-[72px] border-b border-slate-200 bg-white/95 backdrop-blur lg:block">
      <div className="flex h-full items-center justify-between px-6 lg:px-8">
        {/* LEFT */}
        <div>
          <p className="text-sm font-medium text-slate-400">
            Digital Banking
          </p>
          <h1 className="text-lg font-semibold text-slate-900">
            Your financial overview
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-400 transition hover:border-slate-300 hover:bg-white"
          >
            <Search size={17} />
            <span className="hidden text-sm xl:block">
              Search
            </span>
          </button>

          {/* NOTIFICATIONS */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#0F766E]" />
          </button>

          {/* SETTINGS */}
          <Link
            href="/dashboard/settings"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            aria-label="Settings"
          >
            <Settings size={19} />
          </Link>

          {/* PROFILE */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0FDFA] text-[#0F766E]">
              <UserCircle size={20} />
            </div>

            <div className="hidden text-left xl:block">
              <p className="text-xs font-semibold text-slate-900">
                My Account
              </p>
              <p className="text-[10px] text-slate-400">
                Personal
              </p>
            </div>

            <ChevronDown
              size={15}
              className="hidden text-slate-400 xl:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
}