
"use client";

import {
  Bell,
  ChevronDown,
  Moon,
  Search,
  Settings,
  Sun,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Topbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  function toggleTheme() {
    const nextTheme = !darkMode;

    setDarkMode(nextTheme);

    if (nextTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <header className="sticky top-0 z-30 hidden h-[72px] border-b border-slate-200 bg-white/95 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/95 lg:block">
      <div className="flex h-full items-center justify-between px-6 lg:px-8">

        {/* LEFT */}
        <div>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
            Digital Banking
          </p>

          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            Your financial overview
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* SEARCH */}
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-400 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 dark:hover:border-slate-700 dark:hover:bg-slate-800"
          >
            <Search size={17} />

            <span className="hidden text-sm xl:block">
              Search
            </span>
          </button>

          {/* THEME */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* NOTIFICATIONS */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#0F766E] dark:bg-teal-400" />
          </button>

          {/* SETTINGS */}
          <Link
            href="/dashboard/settings"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Settings"
          >
            <Settings size={19} />
          </Link>

          {/* PROFILE */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
              <UserCircle size={20} />
            </div>

            <div className="hidden text-left xl:block">
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                My Account
              </p>

              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Personal
              </p>
            </div>

            <ChevronDown
              size={15}
              className="hidden text-slate-400 dark:text-slate-500 xl:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

