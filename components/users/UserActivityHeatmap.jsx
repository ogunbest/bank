"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

const userActivityData = [
  { name: "Mon", "0-4": 20, "4-8": 40, "8-12": 60, "12-16": 80, "16-20": 100, "20-24": 30 },
  { name: "Tue", "0-4": 30, "4-8": 50, "8-12": 70, "12-16": 90, "16-20": 110, "20-24": 40 },
  { name: "Wed", "0-4": 40, "4-8": 60, "8-12": 80, "12-16": 100, "16-20": 120, "20-24": 50 },
  { name: "Thu", "0-4": 50, "4-8": 70, "8-12": 90, "12-16": 110, "16-20": 130, "20-24": 60 },
  { name: "Fri", "0-4": 60, "4-8": 80, "8-12": 100, "12-16": 120, "16-20": 140, "20-24": 70 },
  { name: "Sat", "0-4": 70, "4-8": 90, "8-12": 110, "12-16": 130, "16-20": 150, "20-24": 80 },
  { name: "Sun", "0-4": 80, "4-8": 100, "8-12": 120, "12-16": 140, "16-20": 160, "20-24": 90 },
];

const UserActivityHeatmap = () => {
  return (
    <motion.div
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
          Activity
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
          User Activity
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          User activity across different time periods.
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={userActivityData}
            margin={{
              top: 10,
              right: 10,
              left: -15,
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
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
            />

            <Tooltip
              cursor={{ fill: "#F0FDFA" }}
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
              }}
              labelStyle={{
                color: "#0F172A",
                fontWeight: 600,
                marginBottom: 4,
              }}
              itemStyle={{
                color: "#0F766E",
                fontSize: 12,
              }}
            />

            <Legend
              wrapperStyle={{
                paddingTop: 12,
                fontSize: 12,
                color: "#64748B",
              }}
            />

            <Bar
              dataKey="0-4"
              stackId="a"
              fill="#CCFBF1"
              name="12 AM - 4 AM"
            />

            <Bar
              dataKey="4-8"
              stackId="a"
              fill="#99F6E4"
              name="4 AM - 8 AM"
            />

            <Bar
              dataKey="8-12"
              stackId="a"
              fill="#5EEAD4"
              name="8 AM - 12 PM"
            />

            <Bar
              dataKey="12-16"
              stackId="a"
              fill="#2DD4BF"
              name="12 PM - 4 PM"
            />

            <Bar
              dataKey="16-20"
              stackId="a"
              fill="#0F766E"
              name="4 PM - 8 PM"
            />

            <Bar
              dataKey="20-24"
              stackId="a"
              fill="#115E59"
              name="8 PM - 12 AM"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default UserActivityHeatmap;