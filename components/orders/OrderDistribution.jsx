"use client";

import { motion } from "framer-motion";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const orderStatusData = [
  { name: "Pending", value: 30 },
  { name: "Processing", value: 45 },
  { name: "Shipped", value: 60 },
  { name: "Delivered", value: 120 },
];

const COLORS = [
  "#F59E0B",
  "#0F766E",
  "#14B8A6",
  "#115E59",
];

const OrderDistribution = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
          Orders
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
          Order Status Distribution
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Current distribution of orders by status.
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={orderStatusData}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
              stroke="#FFFFFF"
              strokeWidth={2}
            >
              {orderStatusData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

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
              }}
              itemStyle={{
                color: "#0F766E",
              }}
              formatter={(value) => [`${value}`, "Orders"]}
            />

            <Legend
              verticalAlign="bottom"
              wrapperStyle={{
                paddingTop: "10px",
                color: "#64748B",
                fontSize: "13px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default OrderDistribution;