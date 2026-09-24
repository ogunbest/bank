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

const categoryData = [
  { name: "Electronics", value: 4500 },
  { name: "Clothing", value: 3200 },
  { name: "Home & Garden", value: 2800 },
  { name: "Books", value: 2100 },
  { name: "Sports & Outdoors", value: 1900 },
];

const COLORS = [
  "#0F766E",
  "#14B8A6",
  "#2DD4BF",
  "#5EEAD4",
  "#115E59",
];

const CategoryDistributionChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
          Categories
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
          Category Distribution
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribution across your product categories.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
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
              {categoryData.map((entry, index) => (
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
              formatter={(value) => [`${value}`, "Value"]}
            />

            <Legend
              verticalAlign="bottom"
              wrapperStyle={{
                paddingTop: "12px",
                color: "#64748B",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryDistributionChart;