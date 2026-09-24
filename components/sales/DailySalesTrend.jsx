"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const dailySalesData = [
  { name: "Mon", sales: 1000 },
  { name: "Tue", sales: 1200 },
  { name: "Wed", sales: 900 },
  { name: "Thu", sales: 1100 },
  { name: "Fri", sales: 1300 },
  { name: "Sat", sales: 1600 },
  { name: "Sun", sales: 1400 },
];

const DailySalesTrend = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
          Activity
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
          Daily Sales Trend
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Sales activity recorded throughout the week.
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dailySalesData}
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
                `₦${(value / 1000).toFixed(1)}k`
              }
            />

            <Tooltip
              cursor={{ fill: "#F0FDFA" }}
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

            <Bar
              dataKey="sales"
              name="Sales"
              fill="#0F766E"
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DailySalesTrend;