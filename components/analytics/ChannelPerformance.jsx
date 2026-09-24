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

const channelData = [
  { name: "Organic Search", value: 4000 },
  { name: "Paid Search", value: 3000 },
  { name: "Direct", value: 2000 },
  { name: "Social Media", value: 2780 },
  { name: "Referral", value: 1890 },
  { name: "Email", value: 2390 },
];

const COLORS = [
  "#0F766E",
  "#14B8A6",
  "#2DD4BF",
  "#5EEAD4",
  "#99F6E4",
  "#115E59",
];

const ChannelPerformance = () => {
  return (
    <motion.section
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          Channel Performance
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Traffic and revenue contribution by channel.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={channelData}
              cx="50%"
              cy="45%"
              outerRadius={90}
              innerRadius={52}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {channelData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value: number) =>
                value.toLocaleString("en-NG")
              }
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
              height={45}
              iconType="circle"
              wrapperStyle={{
                fontSize: "12px",
                color: "#64748B",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
};

export default ChannelPerformance;