"use client";

import { motion } from "framer-motion";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesData = [
  { name: "Jul", sales: 4200 },
  { name: "Aug", sales: 3800 },
  { name: "Sep", sales: 5100 },
  { name: "Oct", sales: 4600 },
  { name: "Nov", sales: 5400 },
  { name: "Dec", sales: 7200 },
  { name: "Jan", sales: 6100 },
  { name: "Feb", sales: 5900 },
  { name: "Mar", sales: 6800 },
  { name: "Apr", sales: 6300 },
  { name: "May", sales: 7100 },
  { name: "Jun", sales: 7500 },
];

const SalesOverviewChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
          Performance
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
          Sales Overview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Monthly account activity over the past year.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={salesData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              stroke="#64748B"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              stroke="#64748B"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                `₦${(value / 1000).toFixed(0)}k`
              }
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
              }}
              labelStyle={{
                color: "#0F172A",
                fontWeight: 600,
                marginBottom: 4,
              }}
              itemStyle={{
                color: "#0F766E",
              }}
              formatter={(value) => [
                `₦${Number(value).toLocaleString()}`,
                "Sales",
              ]}
            />

            <Line
              type="monotone"
              dataKey="sales"
              name="Sales"
              stroke="#0F766E"
              strokeWidth={3}
              dot={{
                fill: "#0F766E",
                stroke: "#FFFFFF",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 7,
                stroke: "#0F766E",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesOverviewChart;