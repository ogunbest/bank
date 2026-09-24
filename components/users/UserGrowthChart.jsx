"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

const userGrowthData = [
  { month: "Jan", users: 1000 },
  { month: "Feb", users: 1500 },
  { month: "Mar", users: 2000 },
  { month: "Apr", users: 3000 },
  { month: "May", users: 4000 },
  { month: "Jun", users: 5000 },
];

const UserGrowthChart = () => {
  return (
    <motion.div
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
          Growth
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
          User Growth
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          User growth over the selected period.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={userGrowthData}
            margin={{
              top: 10,
              right: 10,
              left: -10,
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
              tickFormatter={(value) =>
                value >= 1000 ? `${value / 1000}k` : value
              }
            />

            <Tooltip
              cursor={{
                stroke: "#99F6E4",
                strokeWidth: 1,
              }}
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
              formatter={(value) => [
                Number(value).toLocaleString(),
                "Users",
              ]}
            />

            <Line
              type="monotone"
              dataKey="users"
              stroke="#0F766E"
              strokeWidth={3}
              dot={{
                fill: "#FFFFFF",
                stroke: "#0F766E",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                fill: "#FFFFFF",
                stroke: "#0F766E",
                strokeWidth: 3,
                r: 7,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default UserGrowthChart;