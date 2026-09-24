"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  Lightbulb,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

const INSIGHTS = [
  {
    icon: TrendingUp,
    insight:
      "Revenue is up 15% compared to last month, driven primarily by a successful email campaign.",
  },
  {
    icon: Users,
    insight:
      "Customer retention has improved by 8% following the launch of the new loyalty program.",
  },
  {
    icon: ShoppingBag,
    insight:
      'Product category "Electronics" shows the highest growth potential based on recent market trends.',
  },
  {
    icon: DollarSign,
    insight:
      "Optimizing pricing strategy could potentially increase overall profit margins by 5-7%.",
  },
];

const AIPoweredInsights = () => {
  return (
    <motion.section
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
          <Lightbulb size={21} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            AI-Powered Insights
          </h2>

          <p className="mt-0.5 text-sm text-slate-500">
            Key observations from your analytics data.
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="grid gap-3 md:grid-cols-2">
        {INSIGHTS.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3 + index * 0.08,
                duration: 0.35,
              }}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-100 hover:bg-teal-50/40"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm">
                  <Icon size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm leading-6 text-slate-600">
                    {item.insight}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default AIPoweredInsights;