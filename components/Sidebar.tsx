"use client";

import {
CreditCard,
LayoutDashboard,
LogOut,
Menu,
Settings,
ArrowLeftRight,
Receipt,
Wallet,
Users,
type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarItem = {
name: string;
icon: LucideIcon;
color: string;
href: string;
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    color: "#6366F1",
    href: "/dashboard",
  },
{
name: "Accounts",
icon: Wallet,
color: "#8B5CF6",
href: "/dashboard/accounts",
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
name: "Settings",
icon: Settings,
color: "#6EE7B7",
href: "/dashboard/settings",
},
];

export default function Sidebar() {
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
const pathname = usePathname();

return (
<motion.aside
className={`relative z-20 flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
animate={{ width: isSidebarOpen ? 256 : 80 }}
transition={{ duration: 0.3 }}
> <div className="h-full bg-gray-800/50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
{/* MENU BUTTON */}
<motion.button
type="button"
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.9 }}
onClick={() => setIsSidebarOpen(!isSidebarOpen)}
className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
aria-label="Toggle sidebar"
> <Menu size={24} />
</motion.button>


    {/* NAVIGATION */}
    <nav className="mt-8 flex-grow">
      {SIDEBAR_ITEMS.map((item) => {
        const Icon = item.icon;

        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link key={item.href} href={item.href}>
            <motion.div
              whileHover={{ x: 4 }}
              className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Icon
                size={20}
                style={{
                  color: item.color,
                  minWidth: "20px",
                }}
              />

              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    className="ml-4 whitespace-nowrap"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{
                      opacity: 1,
                      width: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      width: 0,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        );
      })}
    </nav>

    {/* LOGOUT */}
    <button
      type="button"
      className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-red-500/10 text-gray-300 hover:text-red-400 transition-colors"
    >
      <LogOut size={20} />

      {isSidebarOpen && (
        <span className="ml-4 whitespace-nowrap">
          Logout
        </span>
      )}
    </button>
  </div>
</motion.aside>


);
}
