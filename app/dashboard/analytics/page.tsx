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

const COLORS = [
  "#0F766E",
  "#14B8A6",
  "#64748B",
  "#F59E0B",
  "#EF4444",
];

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

    const monthLookup = new Map<
      string,
      {
        month: string;
        income: number;
        spending: number;
      }
    >();

    for (let offset = 5; offset >= 0; offset -= 1) {
      const month = new Date(
        now.getFullYear(),
        now.getMonth() - offset,
        1,
      );

      monthLookup.set(monthKey(month), {
        month: month.toLocaleDateString("en-NG", {
          month: "short",
        }),
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
        month.income += Number(transaction.amount ?? 0);
      } else {
        const amount = Number(transaction.amount ?? 0);

        month.spending += amount;

        const category =
          transaction.category || "Uncategorised";

        categories.set(
          category,
          (categories.get(category) ?? 0) + amount,
        );
      }
    }

    const cashFlow = Array.from(monthLookup.values());

    const movement = cashFlow.map((month) => ({
      month: month.month,
      net: month.income - month.spending,
    }));

    const spending = Array.from(categories.entries())
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((first, second) => second.value - first.value);

    const income = cashFlow.reduce(
      (total, month) => total + month.income,
      0,
    );

    const outgoings = cashFlow.reduce(
      (total, month) => total + month.spending,
      0,
    );

    return {
      cashFlow,
      movement,
      spending,
      income,
      outgoings,
    };
  }, [data?.transactions]);

  const savingsRate = analytics.income
    ? ((analytics.income - analytics.outgoings) /
        analytics.income) *
      100
    : 0;

  return (
    <div className="space-y-7">
      {/* HEADER */}
      <section>
        <p className="text-sm font-medium text-[#0F766E]">
          Financial overview
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Analytics
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Understand your income, spending and account activity.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </section>

      {/* SUMMARY */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={<Wallet size={20} />}
          label="Current balance"
          value={
            loading
              ? "Loading..."
              : `₦${formatMoney(data?.balance ?? 0)}`
          }
          iconClass="bg-teal-50 text-[#0F766E]"
        />

        <SummaryCard
          icon={<ArrowDownLeft size={20} />}
          label="Recorded money in"
          value={`₦${formatMoney(analytics.income)}`}
          iconClass="bg-teal-50 text-teal-600"
        />

        <SummaryCard
          icon={<ArrowUpRight size={20} />}
          label="Recorded money out"
          value={`₦${formatMoney(analytics.outgoings)}`}
          iconClass="bg-red-50 text-red-500"
        />

        <SummaryCard
          icon={<TrendingUp size={20} />}
          label="Net savings rate"
          value={`${savingsRate.toFixed(1)}%`}
          iconClass="bg-slate-100 text-slate-600"
        />
      </section>

      {/* CHARTS */}
      <section className="grid gap-5 lg:grid-cols-2">
        <ChartCard
          title="Net account movement"
          subtitle="Income less spending over the last six months"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.movement}>
              <defs>
                <linearGradient
                  id="movementGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#0F766E"
                    stopOpacity={0.25}
                  />

                  <stop
                    offset="95%"
                    stopColor="#0F766E"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                stroke="#94A3B8"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#94A3B8"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `₦${Number(value).toLocaleString("en-NG")}`
                }
              />

              <Tooltip
                formatter={formatTooltip}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  boxShadow:
                    "0 8px 24px rgba(15, 23, 42, 0.08)",
                }}
              />

              <Area
                type="monotone"
                dataKey="net"
                name="Net movement"
                stroke="#0F766E"
                fill="url(#movementGradient)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Income vs spending"
          subtitle="Recorded activity over the last six months"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.cashFlow}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                stroke="#94A3B8"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#94A3B8"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `₦${Number(value).toLocaleString("en-NG")}`
                }
              />

              <Tooltip
                formatter={formatTooltip}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  boxShadow:
                    "0 8px 24px rgba(15, 23, 42, 0.08)",
                }}
              />

              <Bar
                dataKey="income"
                name="Money in"
                fill="#0F766E"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="spending"
                name="Money out"
                fill="#EF4444"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* SPENDING */}
      <section className="grid gap-5 lg:grid-cols-2">
        {/* PIE */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Spending categories
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Where your recorded money out is going.
            </p>
          </div>

          <div className="mt-4 h-72">
            {analytics.spending.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.spending}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {analytics.spending.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={formatTooltip}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #E2E8F0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center text-center">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    No spending data yet
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Spending categories will appear here once you
                    have outgoing transactions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BREAKDOWN */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Spending breakdown
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Recorded outgoing activity by category.
            </p>
          </div>

          {analytics.spending.length ? (
            <div className="mt-5">
              {analytics.spending.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          COLORS[index % COLORS.length],
                      }}
                    />

                    <span className="truncate text-sm font-medium text-slate-700">
                      {item.name}
                    </span>
                  </div>

                  <span className="ml-4 text-sm font-semibold text-slate-900">
                    ₦{formatMoney(item.value)}
                  </span>
                </div>
              ))}

              <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-5">
                <span className="text-sm font-medium text-slate-500">
                  Total spending
                </span>

                <span className="text-xl font-bold text-slate-900">
                  ₦{formatMoney(analytics.outgoings)}
                </span>
              </div>
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-slate-400">
              No recorded spending is available yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  iconClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xl font-bold text-slate-900 sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>
      </div>

      <div className="h-72 w-full">{children}</div>
    </div>
  );
}