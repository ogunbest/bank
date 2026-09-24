"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#0F766E",
  "#14B8A6",
  "#2DD4BF",
  "#115E59",
];

const SALES_CHANNEL_DATA = [
  { name: "Website", value: 45600 },
  { name: "Mobile App", value: 38200 },
  { name: "Marketplace", value: 29800 },
  { name: "Social Media", value: 18700 },
];

const SalesChannelChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
          Channels
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
          Sales by Channel
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Revenue generated across different sales channels.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={SALES_CHANNEL_DATA}
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

            <Legend
              wrapperStyle={{
                paddingTop: "12px",
                color: "#64748B",
                fontSize: "13px",
              }}
            />

            <Bar
              dataKey="value"
              name="Sales"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            >
              {SALES_CHANNEL_DATA.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesChannelChart;