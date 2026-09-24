"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SettingSectionProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

const SettingSection = ({
  icon: Icon,
  title,
  children,
}: SettingSectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
          <Icon size={20} />
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            {title}
          </h2>

          <div className="mt-0.5 h-0.5 w-6 rounded-full bg-[#0F766E]" />
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        {children}
      </div>
    </motion.section>
  );
};

export default SettingSection;