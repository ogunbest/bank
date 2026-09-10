"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  CreditCard,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const balanceData = [
  { month: "Apr", balance: 5200 },
  { month: "May", balance: 6100 },
  { month: "Jun", balance: 5800 },
  { month: "Jul", balance: 7200 },
  { month: "Aug", balance: 7900 },
  { month: "Sep", balance: 8420 },
];

const cashFlowData = [
  { month: "Apr", income: 4200, spending: 2100 },
  { month: "May", income: 4500, spending: 2600 },
  { month: "Jun", income: 4300, spending: 2300 },
  { month: "Jul", income: 4700, spending: 2800 },
  { month: "Aug", income: 4500, spending: 2400 },
  { month: "Sep", income: 4500, spending: 1850 },
];

const spendingData = [
  { name: "Shopping", value: 620 },
  { name: "Bills", value: 410 },
  { name: "Food", value: 360 },
  { name: "Transport", value: 260 },
  { name: "Entertainment", value: 200 },
];

const COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#10B981",
  "#F59E0B",
];

export default function AnalyticsPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Financial Analytics
          </h1>

          <p className="text-gray-400 mt-1">
            Understand your financial activity and spending habits
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-indigo-500/10">
                <Wallet className="text-indigo-400" size={22} />
              </div>

              <TrendingUp className="text-emerald-400" size={18} />
            </div>

            <p className="text-gray-500 text-sm mt-5">
              Current Balance
            </p>

            <p className="text-white text-2xl font-semibold mt-1">
              $8,420.50
            </p>

            <p className="text-emerald-400 text-xs mt-2">
              +6.5% this month
            </p>
          </div>

          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5">
            <div className="p-3 rounded-xl bg-emerald-500/10 w-fit">
              <ArrowDownLeft className="text-emerald-400" size={22} />
            </div>

            <p className="text-gray-500 text-sm mt-5">
              Total Income
            </p>

            <p className="text-white text-2xl font-semibold mt-1">
              $4,500.00
            </p>

            <p className="text-emerald-400 text-xs mt-2">
              +3.2% from last month
            </p>
          </div>

          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5">
            <div className="p-3 rounded-xl bg-red-500/10 w-fit">
              <ArrowUpRight className="text-red-400" size={22} />
            </div>

            <p className="text-gray-500 text-sm mt-5">
              Total Spending
            </p>

            <p className="text-white text-2xl font-semibold mt-1">
              $1,850.00
            </p>

            <p className="text-red-400 text-xs mt-2">
              -8.4% from last month
            </p>
          </div>

          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5">
            <div className="p-3 rounded-xl bg-purple-500/10 w-fit">
              <CreditCard className="text-purple-400" size={22} />
            </div>

            <p className="text-gray-500 text-sm mt-5">
              Savings Rate
            </p>

            <p className="text-white text-2xl font-semibold mt-1">
              58.9%
            </p>

            <p className="text-emerald-400 text-xs mt-2">
              Excellent
            </p>
          </div>
        </div>

        {/* BALANCE + CASH FLOW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* BALANCE */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                Balance History
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Your account balance over the last six months
              </p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceData}>
                  <defs>
                    <linearGradient
                      id="balanceGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#6366F1"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="95%"
                        stopColor="#6366F1"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="#6B7280"
                  />

                  <YAxis
                    stroke="#6B7280"
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#6366F1"
                    fill="url(#balanceGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CASH FLOW */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                Income vs Spending
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Compare money coming in and going out
              </p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="#6B7280"
                  />

                  <YAxis
                    stroke="#6B7280"
                  />

                  <Tooltip />

                  <Bar
                    dataKey="income"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="spending"
                    fill="#EF4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-gray-400">
                  Income
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="text-gray-400">
                  Spending
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SPENDING */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">
              Spending Categories
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Where your money is going
            </p>

            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                  >
                    {spendingData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">
              Financial Overview
            </h2>

           <p className="text-gray-500 text-sm mt-1 mb-6">
  This month&apos;s financial performance
</p>

            {spendingData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between py-4 border-b border-gray-700 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="text-gray-300">
                    {item.name}
                  </span>
                </div>

                <span className="text-white font-medium">
                  ${item.value.toFixed(2)}
                </span>
              </div>
            ))}

            <div className="flex items-center justify-between pt-5">
              <span className="text-gray-400">
                Total Spending
              </span>

              <span className="text-white text-xl font-semibold">
                $
                {spendingData
                  .reduce((sum, item) => sum + item.value, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
