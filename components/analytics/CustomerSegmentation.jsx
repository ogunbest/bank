"use client";

import { motion } from "framer-motion";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const customerSegmentationData = [
  { subject: "Engagement", A: 120, B: 110, fullMark: 150 },
  { subject: "Loyalty", A: 98, B: 130, fullMark: 150 },
  { subject: "Satisfaction", A: 86, B: 130, fullMark: 150 },
  { subject: "Spend", A: 99, B: 100, fullMark: 150 },
  { subject: "Frequency", A: 85, B: 90, fullMark: 150 },
  { subject: "Recency", A: 65, B: 85, fullMark: 150 },
];

const CustomerSegmentation = () => {
  return (
    <motion.section
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          Customer Segmentation
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Compare customer segments across key engagement metrics.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="48%"
            outerRadius="72%"
            data={customerSegmentationData}
          >
            <PolarGrid stroke="#E2E8F0" />

            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
            />

            <PolarRadiusAxis
              angle={30}
              domain={[0, 150]}
              tick={{
                fill: "#94A3B8",
                fontSize: 10,
              }}
              axisLine={{
                stroke: "#E2E8F0",
              }}
            />

            <Radar
              name="Segment A"
              dataKey="A"
              stroke="#0F766E"
              fill="#0F766E"
              fillOpacity={0.25}
            />

            <Radar
              name="Segment B"
              dataKey="B"
              stroke="#14B8A6"
              fill="#14B8A6"
              fillOpacity={0.18}
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
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
};

export default CustomerSegmentation;