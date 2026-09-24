"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 4000, target: 3800 },
  { month: "Feb", revenue: 3000, target: 3200 },
  { month: "Mar", revenue: 5000, target: 4500 },
  { month: "Apr", revenue: 4500, target: 4200 },
  { month: "May", revenue: 6000, target: 5500 },
  { month: "Jun", revenue: 5500, target: 5800 },
  { month: "Jul", revenue: 7000, target: 6500 },
];

const RevenueChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] =
    useState("This Month");

  return (
    <motion.section
      className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Revenue vs Target
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Compare actual revenue against your target.
          </p>
        </div>

        <select
          value={selectedTimeRange}
          onChange={(event) =>
            setSelectedTimeRange(event.target.value)
          }
          className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-teal-100"
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={revenueData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient
                id="revenueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#0F766E"
                  stopOpacity={0.25}
                />
                <stop
                  offset="100%"
                  stopColor="#0F766E"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient
                id="targetGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#14B8A6"
                  stopOpacity={0.18}
                />
                <stop
                  offset="100%"
                  stopColor="#14B8A6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              axisLine={{
                stroke: "#E2E8F0",
              }}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
                boxShadow:
                  "0 10px 30px rgba(15, 23, 42, 0.08)",
              }}
              labelStyle={{
                color: "#0F172A",
                fontWeight: 600,
              }}
              itemStyle={{
                color: "#475569",
              }}
            />

            <Legend
              verticalAlign="bottom"
              height={35}
              iconType="circle"
              wrapperStyle={{
                fontSize: "12px",
                color: "#64748B",
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#0F766E"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
            />

            <Area
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#14B8A6"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#targetGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
};

export default RevenueChart;