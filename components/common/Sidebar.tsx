"use client";

import {
  ArrowLeftRight,
  BarChart3,
  ChevronDown,
  CreditCard,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  PiggyBank,
  Receipt,
  Settings,
  Users,
  Wallet,
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
    name: "Home",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    name: "Accounts",
    icon: Wallet,
    href: "/dashboard/accounts",
  },
  {
    name: "Transfer",
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
    icon: ArrowLeftRight,
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
  const [moreOpen, setMoreOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname?.startsWith(href) ?? false;
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await logoutAccount();

      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.aside
      animate={{
        width: isSidebarOpen ? 256 : 80,
      }}
      transition={{
        duration: 0.25,
      }}
      className="fixed left-0 top-0 z-40 hidden h-screen flex-shrink-0 lg:block"
    >
      <div className="flex h-full flex-col border-r border-slate-200 bg-white p-4 shadow-sm">
        {/* BRAND */}
        <div
          className={`mb-8 flex items-center ${
            isSidebarOpen ? "justify-between" : "justify-center"
          }`}
        >
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E] text-white">
                <Wallet size={20} />
              </div>

              <span className="text-lg font-bold text-slate-900">
                Covenant
              </span>
            </motion.div>
          )}

          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Toggle sidebar"
          >
            <Menu size={21} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto">
          {isSidebarOpen && (
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Main menu
            </p>
          )}

          <div className="space-y-1">
            {MAIN_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    className={`flex h-11 items-center rounded-xl px-3 text-sm font-medium transition ${
                      active
                        ? "bg-[#F0FDFA] text-[#0F766E]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    } ${!isSidebarOpen ? "justify-center" : ""}`}
                  >
                    <Icon
                      size={20}
                      className={
                        active ? "text-[#0F766E]" : "text-slate-500"
                      }
                    />

                    {isSidebarOpen && (
                      <span className="ml-3">{item.name}</span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* MORE */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              className={`flex h-11 w-full items-center rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 ${
                !isSidebarOpen ? "justify-center" : ""
              }`}
            >
              <MoreHorizontal size={20} className="text-slate-500" />

              {isSidebarOpen && (
                <>
                  <span className="ml-3 flex-1 text-left">More</span>

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
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="mt-1 space-y-1 overflow-hidden pl-2"
                >
                  {MORE_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link key={item.href} href={item.href}>
                        <motion.div
                          whileHover={{ x: 2 }}
                          className={`flex h-10 items-center rounded-lg px-3 text-sm transition ${
                            active
                              ? "bg-[#F0FDFA] font-medium text-[#0F766E]"
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <Icon
                            size={17}
                            className={
                              active
                                ? "text-[#0F766E]"
                                : "text-slate-500"
                            }
                          />

                          <span className="ml-3">{item.name}</span>
                        </motion.div>
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
          className={`mt-4 flex h-11 items-center rounded-xl px-3 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 ${
            !isSidebarOpen ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />

          {isSidebarOpen && (
            <span className="ml-3">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}