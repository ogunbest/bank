"use client";

import { Bell, Search, Settings } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#0F766E]">
            Covenant Admin
          </p>

          <h1 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-100 hover:bg-teal-50 hover:text-[#0F766E]"
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-100 hover:bg-teal-50 hover:text-[#0F766E]"
          >
            <Bell size={18} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <Link
            href="/admin/settings"
            aria-label="Settings"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-100 hover:bg-teal-50 hover:text-[#0F766E]"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;