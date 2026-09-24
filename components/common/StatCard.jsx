"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  name: string;
  icon: LucideIcon;
  value: string | number;
  color?: string;
}

const StatCard = ({
  name,
  icon: Icon,
  value,
  color = "#0F766E",
}: StatCardProps) => {
  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 20px 40px -18px rgba(15, 118, 110, 0.25)",
      }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${color}12`,
            }}
          >
            <Icon size={20} style={{ color }} />
          </div>

          <span className="text-sm font-medium text-slate-500">
            {name}
          </span>
        </div>

        <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {value}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;