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
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4500 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 5500 },
];

const SalesTrendChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
          Trend
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
          Sales Trend
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Monthly sales performance for the current period.
        </p>
      </div>

      <div className="h-[300px] w-full">
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
              dataKey="month"
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
                r: 4,
                fill: "#0F766E",
                stroke: "#FFFFFF",
                strokeWidth: 2,
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

export default SalesTrendChart;