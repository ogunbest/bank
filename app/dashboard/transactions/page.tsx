
"use client";

import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";
import { motion } from "framer-motion";

const transactions = [
  {
    id: 1,
    name: "Netflix",
    type: "Payment",
    date: "Sep 8, 2026",
    amount: "-$15.99",
    status: "Completed",
    incoming: false,
  },
  {
    id: 2,
    name: "Salary",
    type: "Deposit",
    date: "Sep 7, 2026",
    amount: "+$4,500.00",
    status: "Completed",
    incoming: true,
  },
  {
    id: 3,
    name: "Amazon",
    type: "Payment",
    date: "Sep 6, 2026",
    amount: "-$128.40",
    status: "Completed",
    incoming: false,
  },
  {
    id: 4,
    name: "John Smith",
    type: "Transfer",
    date: "Sep 5, 2026",
    amount: "+$350.00",
    status: "Completed",
    incoming: true,
  },
  {
    id: 5,
    name: "Electricity Bill",
    type: "Bill Payment",
    date: "Sep 4, 2026",
    amount: "-$82.15",
    status: "Completed",
    incoming: false,
  },
];

export default function TransactionsPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Transactions
          </h1>

          <p className="text-gray-400 mt-1">
            View and manage your recent transactions
          </p>
        </div>

        {/* SEARCH */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full bg-gray-800/60 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
            />
          </div>

          <select className="bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 outline-none">
            <option>All Transactions</option>
            <option>Payments</option>
            <option>Transfers</option>
            <option>Deposits</option>
            <option>Withdrawals</option>
          </select>
        </div>

        {/* TRANSACTIONS */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden">

          {/* TABLE HEADER */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-700 text-xs uppercase text-gray-500">
            <div className="col-span-4">
              Transaction
            </div>

            <div className="col-span-2">
              Type
            </div>

            <div className="col-span-2">
              Date
            </div>

            <div className="col-span-2">
              Status
            </div>

            <div className="col-span-2 text-right">
              Amount
            </div>
          </div>

          {/* ROWS */}
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/30 transition-colors"
            >
              {/* NAME */}
              <div className="md:col-span-4 flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    transaction.incoming
                      ? "bg-emerald-500/10"
                      : "bg-red-500/10"
                  }`}
                >
                  {transaction.incoming ? (
                    <ArrowDownLeft
                      size={18}
                      className="text-emerald-400"
                    />
                  ) : (
                    <ArrowUpRight
                      size={18}
                      className="text-red-400"
                    />
                  )}
                </div>

                <div>
                  <p className="text-white font-medium">
                    {transaction.name}
                  </p>

                  <p className="text-gray-500 text-sm">
                    Transaction #{transaction.id}
                  </p>
                </div>
              </div>

              {/* TYPE */}
              <div className="md:col-span-2 flex items-center text-gray-400">
                {transaction.type}
              </div>

              {/* DATE */}
              <div className="md:col-span-2 flex items-center text-gray-400">
                {transaction.date}
              </div>

              {/* STATUS */}
              <div className="md:col-span-2 flex items-center">
                <span className="px-2.5 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400">
                  {transaction.status}
                </span>
              </div>

              {/* AMOUNT */}
              <div
                className={`md:col-span-2 flex items-center md:justify-end font-semibold ${
                  transaction.incoming
                    ? "text-emerald-400"
                    : "text-white"
                }`}
              >
                {transaction.amount}
              </div>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  );
}

