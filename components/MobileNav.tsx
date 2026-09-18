"use client";

import {
  ArrowLeftRight,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Landmark,
  LogOut,
  Menu,
  Receipt,
  Settings,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAccount } from "@/lib/actions/user.actions";

type MobileNavItem = {
  name: string;
  icon: LucideIcon;
  color: string;
  href: string;
};

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    color: "#6366F1",
    href: "/dashboard",
  },
  {
    name: "Banking",
    icon: Landmark,
    color: "#6366F1",
    href: "/dashboard/banking",
  },
  {
    name: "Transactions",
    icon: Receipt,
    color: "#10B981",
    href: "/dashboard/transactions",
  },
  {
    name: "Transfers",
    icon: ArrowLeftRight,
    color: "#F59E0B",
    href: "/dashboard/transfers",
  },
  {
    name: "Cards",
    icon: CreditCard,
    color: "#EC4899",
    href: "/dashboard/cards",
  },
  {
    name: "Beneficiaries",
    icon: Users,
    color: "#06B6D4",
    href: "/dashboard/beneficiaries",
  },
  {
    name: "Analytics",
    icon: BarChart3,
    color: "#3B82F6",
    href: "/dashboard/analytics",
  },
  {
    name: "Settings",
    icon: Settings,
    color: "#A78BFA",
    href: "/dashboard/settings",
  },
  {
    name: "Admin",
    icon: ShieldCheck,
    color: "#F97316",
    href: "/admin",
  },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutAccount();
      router.replace("/sign-in");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="flex h-16 w-full items-center justify-between">
        {/* Menu */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-200 transition hover:bg-gray-800 active:scale-95"
          aria-label="Open navigation"
        >
          <Menu size={25} />
        </button>

        {/* Brand */}
        <Link
          href="/dashboard"
          className="absolute left-1/2 -translate-x-1/2 text-lg font-bold tracking-tight text-white"
        >
          Banking
        </Link>

        {/* Profile */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white"
          aria-label="Profile"
        >
          J
        </button>
      </header>

      {/* Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px]"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] flex w-[285px] max-w-[85vw] flex-col bg-gray-900 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-5">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="text-lg font-bold text-white"
          >
            Banking
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 hover:bg-gray-800"
            aria-label="Close navigation"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Menu
          </p>

          {MOBILE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`mb-1.5 flex items-center rounded-xl px-3 py-3 transition-all ${
                  isActive
                    ? "bg-indigo-600/15 text-white ring-1 ring-indigo-500/20"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    isActive ? "bg-gray-800" : ""
                  }`}
                >
                  <Icon
                    size={19}
                    style={{ color: item.color }}
                  />
                </span>

                <span className="ml-3 text-sm font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-700 p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg">
              <LogOut size={19} />
            </span>

            <span className="ml-3">
              {isLoggingOut ? "Signing out..." : "Logout"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}