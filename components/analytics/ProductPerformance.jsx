"use client";

import { motion } from "framer-motion";
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

const productPerformanceData = [
  { name: "Product A", sales: 4000, revenue: 2400, profit: 2400 },
  { name: "Product B", sales: 3000, revenue: 1398, profit: 2210 },
  { name: "Product C", sales: 2000, revenue: 9800, profit: 2290 },
  { name: "Product D", sales: 2780, revenue: 3908, profit: 2000 },
  { name: "Product E", sales: 1890, revenue: 4800, profit: 2181 },
];

const ProductPerformance = () => {
  return (
    <motion.section
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          Product Performance
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Compare sales, revenue, and profit across products.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={productPerformanceData}
            margin={{
              top: 5,
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
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{
                fill: "#F0FDFA",
              }}
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
              height={35}
              iconType="circle"
              wrapperStyle={{
                fontSize: "12px",
                color: "#64748B",
              }}
            />

            <Bar
              dataKey="sales"
              name="Sales"
              fill="#0F766E"
              radius={[5, 5, 0, 0]}
            />

            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="#14B8A6"
              radius={[5, 5, 0, 0]}
            />

            <Bar
              dataKey="profit"
              name="Profit"
              fill="#2DD4BF"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
};

export default ProductPerformance;