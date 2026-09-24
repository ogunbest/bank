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

const COLORS = [
  "#CCFBF1",
  "#99F6E4",
  "#5EEAD4",
  "#2DD4BF",
  "#0F766E",
];

const userDemographicsData = [
  { name: "18-24", value: 20 },
  { name: "25-34", value: 30 },
  { name: "35-44", value: 25 },
  { name: "45-54", value: 15 },
  { name: "55+", value: 10 },
];

const UserDemographicsChart = () => {
  return (
    <motion.div
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
          Users
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
          User Demographics
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          User distribution by age group.
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={userDemographicsData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={55}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {userDemographicsData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
              }}
              labelStyle={{
                color: "#0F172A",
                fontWeight: 600,
              }}
              itemStyle={{
                color: "#0F766E",
                fontSize: 12,
              }}
              formatter={(value) => [`${value}%`, "Users"]}
            />

            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                fontSize: 12,
                color: "#64748B",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default UserDemographicsChart;