"use client";

import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const chartColors = [
  "#0F766E",
  "#14B8A6",
  "#2DD4BF",
  "#5EEAD4",
  "#99F6E4",
];

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(
        document.documentElement.classList.contains("dark"),
      );
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const accountNames = accounts.map((account) => account.name);

  const balances = accounts.map((account) =>
    Number(account.currentBalance ?? 0),
  );

  const hasBalance = balances.some((balance) => balance > 0);

  const data = {
    labels: accountNames,
    datasets: [
      {
        label: "Accounts",
        data: hasBalance ? balances : [1],
        backgroundColor: hasBalance
          ? balances.map(
              (_, index) =>
                chartColors[index % chartColors.length],
            )
          : [isDark ? "#334155" : "#E2E8F0"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="relative mx-auto h-[220px] w-[220px]">
      <Doughnut
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: "68%",
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: hasBalance,
              backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
              titleColor: isDark ? "#FFFFFF" : "#0F172A",
              bodyColor: isDark ? "#CBD5E1" : "#475569",
              borderColor: isDark ? "#334155" : "#E2E8F0",
              borderWidth: 1,
              callbacks: {
                label: (context) => {
                  const value = Number(context.raw ?? 0);

                  return ` ₦${value.toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`;
                },
              },
            },
          },
        }}
      />

      {/* Center label */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          {accounts.length === 1 ? "Account" : "Accounts"}
        </span>

        <span className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
          {accounts.length}
        </span>
      </div>
    </div>
  );
};

export default DoughnutChart;