"use client";

import {
  ArrowDownToLine,
  ArrowLeftRight,
  BarChart3,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  Landmark,
  LogOut,
  Menu,
  MoreHorizontal,
  PiggyBank,
  Receipt,
  Settings,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { logoutAccount } from "@/lib/actions/user.actions";

type SidebarItem = {
  name: string;
  icon: LucideIcon;
  href: string;
};

const MAIN_ITEMS: SidebarItem[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    name: "Accounts",
    icon: Wallet,
    href: "/dashboard/accounts",
  },
  {
    name: "Transfers",
    icon: ArrowLeftRight,
    href: "/dashboard/transfers",
  },
  {
    name: "Cards",
    icon: CreditCard,
    href: "/dashboard/cards",
  },
  {
    name: "Savings",
    icon: PiggyBank,
    href: "/dashboard/savings",
  },
  {
    name: "Beneficiaries",
    icon: Users,
    href: "/dashboard/beneficiaries",
  },
];

const MORE_ITEMS: SidebarItem[] = [
  {
    name: "Withdrawals",
    icon: ArrowDownToLine,
    href: "/dashboard/withdrawals",
  },
  {
    name: "Banking",
    icon: Landmark,
    href: "/dashboard/banking",
  },
  {
    name: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
  },
  {
    name: "Transactions",
    icon: Receipt,
    href: "/dashboard/transactions",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logoutAccount();
      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 transition-colors dark:border-slate-800 dark:bg-slate-950 lg:hidden">
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E] text-white">
            <Wallet size={19} />
          </div>

          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Covenant
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 z-40 bg-slate-950/30 dark:bg-black/60 lg:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25 }}
              className="fixed left-0 top-0 z-50 h-screen w-[280px] bg-white shadow-2xl transition-colors dark:bg-slate-950 lg:hidden"
            >
              <SidebarContent
                pathname={pathname}
                isSidebarOpen
                moreOpen={moreOpen}
                setMoreOpen={setMoreOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                onClose={closeMobile}
                handleLogout={handleLogout}
                isLoggingOut={isLoggingOut}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <motion.aside
        animate={{
          width: isSidebarOpen ? 256 : 80,
        }}
        transition={{ duration: 0.2 }}
        className="fixed left-0 top-0 z-40 hidden h-screen lg:block"
      >
        <SidebarContent
          pathname={pathname}
          isSidebarOpen={isSidebarOpen}
          moreOpen={moreOpen}
          setMoreOpen={setMoreOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          handleLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      </motion.aside>
    </>
  );
}

function SidebarContent({
  pathname,
  isSidebarOpen,
  moreOpen,
  setMoreOpen,
  setIsSidebarOpen,
  onClose,
  handleLogout,
  isLoggingOut,
}: {
  pathname: string | null;
  isSidebarOpen: boolean;
  moreOpen: boolean;
  setMoreOpen: (value: boolean) => void;
  setIsSidebarOpen: (value: boolean) => void;
  onClose?: () => void;
  handleLogout: () => void;
  isLoggingOut: boolean;
}) {
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname?.startsWith(href) ?? false;
  };

  return (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white px-4 py-5 transition-colors dark:border-slate-800 dark:bg-slate-950">
      {/* BRAND */}
      <div className="mb-8 flex items-center justify-between">
        {isSidebarOpen ? (
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] text-white">
              <Wallet size={20} />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Covenant
              </p>

              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Digital Banking
              </p>
            </div>
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] text-white"
          >
            <Wallet size={20} />
          </Link>
        )}

        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:flex"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto">
        {isSidebarOpen && (
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
            Main menu
          </p>
        )}

        <div className="space-y-1">
          {MAIN_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={!isSidebarOpen ? item.name : undefined}
                className={`flex h-11 items-center rounded-xl px-3 text-sm font-medium transition ${
                  active
                    ? "bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                } ${
                  !isSidebarOpen ? "justify-center" : ""
                }`}
              >
                <Icon
                  size={19}
                  className={
                    active
                      ? "text-[#0F766E] dark:text-teal-400"
                      : "text-slate-400 dark:text-slate-500"
                  }
                />

                {isSidebarOpen && (
                  <span className="ml-3">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* MORE */}
        <div className="mt-7">
          {isSidebarOpen && (
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
              More
            </p>
          )}

          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            title={!isSidebarOpen ? "More" : undefined}
            className={`flex h-11 w-full items-center rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white ${
              !isSidebarOpen ? "justify-center" : ""
            }`}
          >
            <MoreHorizontal
              size={19}
              className="text-slate-400 dark:text-slate-500"
            />

            {isSidebarOpen && (
              <>
                <span className="ml-3 flex-1 text-left">
                  More
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    moreOpen ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          <AnimatePresence>
            {moreOpen && isSidebarOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                className="mt-1 space-y-1 overflow-hidden"
              >
                {MORE_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex h-10 items-center rounded-lg px-3 pl-11 text-sm transition ${
                        active
                          ? "bg-teal-50 font-medium text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`}
                    >
                      <Icon
                        size={17}
                        className={
                          active
                            ? "text-[#0F766E] dark:text-teal-400"
                            : "text-slate-400 dark:text-slate-500"
                        }
                      />

                      <span className="ml-3">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* LOGOUT */}
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`mt-4 flex h-11 items-center rounded-xl px-3 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50 ${
          !isSidebarOpen ? "justify-center" : ""
        }`}
      >
        <LogOut size={19} />

        {isSidebarOpen && (
          <span className="ml-3">
            {isLoggingOut ? "Signing out..." : "Logout"}
          </span>
        )}
      </button>
    </div>
  );
}