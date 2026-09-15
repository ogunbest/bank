"use client";

import { useMemo } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardData } from "@/components/dashboard/useDashboardData";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const formatMoney = (amount: number) =>
  amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const formatTooltip = (value: unknown) =>
  `₦${formatMoney(Number(value) || 0)}`;

export default function AnalyticsPage() {
  const { data, error, loading } = useDashboardData();

  const analytics = useMemo(() => {
    const now = new Date();
    const monthLookup = new Map<string, { month: string; income: number; spending: number }>();

    for (let offset = 5; offset >= 0; offset -= 1) {
      const month = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      monthLookup.set(monthKey(month), {
        month: month.toLocaleDateString("en-NG", { month: "short" }),
        income: 0,
        spending: 0,
      });
    }

    const categories = new Map<string, number>();

    for (const transaction of data?.transactions ?? []) {
      const date = new Date(transaction.date);
      const month = monthLookup.get(monthKey(date));

      if (!month) continue;

      if (transaction.direction === "in") {
        month.income += transaction.amount;
      } else {
        month.spending += transaction.amount;
        const category = transaction.category || "Uncategorised";
        categories.set(category, (categories.get(category) ?? 0) + transaction.amount);
      }
    }

    const cashFlow = Array.from(monthLookup.values());
    const movement = cashFlow.map((month) => ({
      month: month.month,
      net: month.income - month.spending,
    }));
    const spending = Array.from(categories.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((first, second) => second.value - first.value);
    const income = cashFlow.reduce((total, month) => total + month.income, 0);
    const outgoings = cashFlow.reduce((total, month) => total + month.spending, 0);

    return { cashFlow, movement, spending, income, outgoings };
  }, [data?.transactions]);

  const savingsRate = analytics.income
    ? ((analytics.income - analytics.outgoings) / analytics.income) * 100
    : 0;

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Financial Analytics</h1>
          <p className="text-gray-400 mt-1">Insights based on your recorded account activity.</p>
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <SummaryCard icon={<Wallet className="text-indigo-400" size={22} />} label="Current balance" value={loading ? "Loading..." : `₦${formatMoney(data?.balance ?? 0)}`} />
          <SummaryCard icon={<ArrowDownLeft className="text-emerald-400" size={22} />} label="Recorded money in" value={`₦${formatMoney(analytics.income)}`} />
          <SummaryCard icon={<ArrowUpRight className="text-red-400" size={22} />} label="Recorded money out" value={`₦${formatMoney(analytics.outgoings)}`} />
          <SummaryCard icon={<TrendingUp className="text-purple-400" size={22} />} label="Net rate" value={`${savingsRate.toFixed(1)}%`} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Net account movement" subtitle="Income less spending, by month">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.movement}>
                <defs>
                  <linearGradient id="movementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip formatter={formatTooltip} />
                <Area type="monotone" dataKey="net" name="Net movement" stroke="#6366F1" fill="url(#movementGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Income vs spending" subtitle="Recorded activity over the last six months">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.cashFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip formatter={formatTooltip} />
                <Bar dataKey="income" name="Money in" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spending" name="Money out" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">Spending categories</h2>
            <p className="text-gray-500 text-sm mt-1">Where recorded money out is going.</p>
            <div className="h-72 mt-4">
              {analytics.spending.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.spending} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95}>
                      {analytics.spending.map((item, index) => (
                        <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={formatTooltip} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full grid place-items-center text-center text-sm text-gray-500">
                  No recorded spending is available yet.
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">Spending breakdown</h2>
            <p className="text-gray-500 text-sm mt-1 mb-6">Recorded outgoing activity by category.</p>
            {analytics.spending.length ? (
              <>
                {analytics.spending.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between py-4 border-b border-gray-700 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-gray-300">{item.name}</span>
                    </div>
                    <span className="text-white font-medium">₦{formatMoney(item.value)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-5">
                  <span className="text-gray-400">Total spending</span>
                  <span className="text-white text-xl font-semibold">₦{formatMoney(analytics.outgoings)}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 py-6">No recorded spending is available yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5">
      <span className="p-3 rounded-xl bg-gray-700/50 inline-flex">{icon}</span>
      <p className="text-gray-500 text-sm mt-5">{label}</p>
      <p className="text-white text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
      </div>
      <div className="h-72">{children}</div>
    </div>
  );
}
