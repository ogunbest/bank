"use client";

import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const chartColors = [
  "#0F766E",
  "#14B8A6",
  "#2DD4BF",
  "#5EEAD4",
  "#99F6E4",
];

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
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
          : ["#E2E8F0"],
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
        <span className="text-xs font-medium text-slate-400">
          {accounts.length === 1 ? "Account" : "Accounts"}
        </span>

        <span className="mt-1 text-sm font-bold text-slate-900">
          {accounts.length}
        </span>
      </div>
    </div>
  );
};

export default DoughnutChart;