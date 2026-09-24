"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Eye,
  ShoppingBag,
  Users,
} from "lucide-react";

const overviewData = [
  {
    name: "Revenue",
    value: "$1,234,567",
    change: 12.5,
    icon: DollarSign,
  },
  {
    name: "Users",
    value: "45,678",
    change: 8.3,
    icon: Users,
  },
  {
    name: "Orders",
    value: "9,876",
    change: -3.2,
    icon: ShoppingBag,
  },
  {
    name: "Page Views",
    value: "1,234,567",
    change: 15.7,
    icon: Eye,
  },
];

const OverviewCards = () => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {overviewData.map((item, index) => {
        const Icon = item.icon;
        const isPositive = item.change >= 0;

        return (
          <motion.div
            key={item.name}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-100 hover:shadow-md sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.4,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  {item.name}
                </p>

                <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-900">
                  {item.value}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
                <Icon size={21} />
              </div>
            </div>

            <div
              className={`mt-5 flex items-center ${
                isPositive ? "text-[#0F766E]" : "text-red-500"
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                  isPositive ? "bg-teal-50" : "bg-red-50"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
              </div>

              <span className="ml-2 text-sm font-bold">
                {Math.abs(item.change)}%
              </span>

              <span className="ml-2 text-xs text-slate-400">
                vs last period
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default OverviewCards;