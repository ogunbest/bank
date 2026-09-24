"use client";

import {
  ArrowLeftRight,
  BarChart3,
  ChevronDown,
  CreditCard,
  Landmark,
  LayoutDashboard,
  LogOut,
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
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAccount } from "@/lib/actions/user.actions";

type NavItem = {
  name: string;
  icon: LucideIcon;
  href: string;
};

const MAIN_ITEMS: NavItem[] = [
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

const MORE_ITEMS: NavItem[] = [
 
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

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
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

  const closeMenu = () => {
    setIsOpen(false);
    setMoreOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutAccount();
      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      closeMenu();
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="flex h-16 w-full items-center justify-between bg-white">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 active:scale-95"
          aria-label="Open navigation"
        >
          <MoreHorizontal size={24} />
        </button>

        <Link
          href="/dashboard"
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00a86b] text-white">
            <Wallet size={17} />
          </span>

          <span className="text-lg font-bold text-gray-900">
            Covenant
          </span>
        </Link>

        <Link
          href="/dashboard/settings"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a86b] text-sm font-bold text-white"
          aria-label="Profile"
        >
          J
        </Link>
      </header>

      {/* Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMenu}
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] flex w-[290px] max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
          <Link
            href="/dashboard"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00a86b] text-white">
              <Wallet size={19} />
            </span>

            <span className="text-lg font-bold text-gray-900">
              Covenant
            </span>
          </Link>

          <button
            type="button"
            onClick={closeMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close navigation"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Menu
          </p>

          <div className="space-y-1">
            {MAIN_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex h-11 items-center rounded-xl px-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#00a86b]/10 text-[#00a86b]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      active ? "text-[#00a86b]" : "text-gray-500"
                    }
                  />

                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* More */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex h-11 w-full items-center rounded-xl px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              <MoreHorizontal size={20} className="text-gray-500" />

              <span className="ml-3 flex-1 text-left">
                More
              </span>

              <ChevronDown
                size={17}
                className={`transition-transform ${
                  moreOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {moreOpen && (
              <div className="mt-1 space-y-1 pl-2">
                {MORE_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={`flex h-10 items-center rounded-lg px-3 text-sm transition ${
                        active
                          ? "bg-[#00a86b]/10 text-[#00a86b]"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon size={17} />

                      <span className="ml-3">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex h-11 w-full items-center rounded-xl px-3 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
          >
            <LogOut size={20} />

            <span className="ml-3">
              {isLoggingOut ? "Signing out..." : "Logout"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
