
"use client";

import {
  ArrowLeftRight,
  BarChart3,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  PiggyBank,
  Settings,
  Users,
  Wallet,
  Landmark,
  Receipt,
  ArrowDownToLine,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
    href: "/dashboard/banking",
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
  const [moreOpen, setMoreOpen] = useState(false);

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
      // Keep your existing authentication/logout implementation here
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
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
      className="relative z-40 h-screen flex-shrink-0"
    >
      <div className="flex h-full flex-col border-r border-gray-200 bg-white p-4 shadow-sm">
        {/* BRAND */}
        <div
          className={`mb-8 flex items-center ${
            isSidebarOpen ? "justify-between" : "justify-center"
          }`}
        >
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00a86b] text-white">
                  <Wallet size={20} />
                </div>

                <span className="text-lg font-bold text-gray-900">
                  Covenant
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Toggle sidebar"
          >
            <Menu size={21} />
          </button>
        </div>

        {/* MAIN NAVIGATION */}
        <nav className="flex-1">
          <p
            className={`mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 ${
              !isSidebarOpen ? "text-center" : ""
            }`}
          >
            {isSidebarOpen ? "Menu" : "•••"}
          </p>

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
                        ? "bg-[#00a86b]/10 text-[#00a86b]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } ${!isSidebarOpen ? "justify-center" : ""}`}
                  >
                    <Icon
                      size={20}
                      className={active ? "text-[#00a86b]" : "text-gray-500"}
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
              className={`flex h-11 w-full items-center rounded-xl px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 ${
                !isSidebarOpen ? "justify-center" : ""
              }`}
            >
              <MoreHorizontal size={20} className="text-gray-500" />

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
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-1 space-y-1 overflow-hidden pl-2"
                >
                  {MORE_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link key={item.href} href={item.href}>
                        <div
                          className={`flex h-10 items-center rounded-lg px-3 text-sm transition ${
                            active
                              ? "bg-[#00a86b]/10 text-[#00a86b]"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <Icon size={17} />

                          <span className="ml-3">{item.name}</span>
                        </div>
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
          className={`flex h-11 items-center rounded-xl px-3 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-500 ${
            !isSidebarOpen ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />

          {isSidebarOpen && (
            <span className="ml-3">
              Logout
            </span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}


