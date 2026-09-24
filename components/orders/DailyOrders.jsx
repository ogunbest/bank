"use client";

import { motion } from "framer-motion";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const dailyOrdersData = [
  { date: "07/01", orders: 45 },
  { date: "07/02", orders: 52 },
  { date: "07/03", orders: 49 },
  { date: "07/04", orders: 60 },
  { date: "07/05", orders: 55 },
  { date: "07/06", orders: 58 },
  { date: "07/07", orders: 62 },
];

const DailyOrders = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
          Activity
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
          Daily Orders
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Orders recorded over the last seven days.
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dailyOrdersData}
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
              dataKey="date"
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
              formatter={(value) => [`${value}`, "Orders"]}
            />

            <Legend
              wrapperStyle={{
                paddingTop: "12px",
                color: "#64748B",
              }}
            />

            <Line
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#0F766E"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#0F766E",
                strokeWidth: 2,
                stroke: "#FFFFFF",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DailyOrders;