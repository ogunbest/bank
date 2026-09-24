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

const userRetentionData = [
  { name: "Week 1", retention: 100 },
  { name: "Week 2", retention: 75 },
  { name: "Week 3", retention: 60 },
  { name: "Week 4", retention: 50 },
  { name: "Week 5", retention: 45 },
  { name: "Week 6", retention: 40 },
  { name: "Week 7", retention: 38 },
  { name: "Week 8", retention: 35 },
];

const UserRetention = () => {
  return (
    <motion.section
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          User Retention
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Customer retention across the first eight weeks.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={userRetentionData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="name"
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
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={(value: number) => [`${value}%`, "Retention"]}
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
                color: "#0F766E",
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

            <Line
              type="monotone"
              dataKey="retention"
              name="Retention"
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
    </motion.section>
  );
};

export default UserRetention;