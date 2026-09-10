"use client";

import {
  ArrowUpRight,
  Search,
  Send,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

const transfers = [
  {
    id: 1,
    recipient: "John Smith",
    account: "**** 4821",
    date: "Sep 8, 2026",
    amount: "$350.00",
    status: "Completed",
    outgoing: true,
  },
  {
    id: 2,
    recipient: "Sarah Johnson",
    account: "**** 7392",
    date: "Sep 6, 2026",
    amount: "$125.00",
    status: "Completed",
    outgoing: true,
  },
  {
    id: 3,
    recipient: "Michael Brown",
    account: "**** 1938",
    date: "Sep 4, 2026",
    amount: "$500.00",
    status: "Pending",
    outgoing: true,
  },
];

export default function TransfersPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Transfers
            </h1>

            <p className="text-gray-400 mt-1">
              Send money and manage your transfers
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-lg transition-colors">
            <Plus size={18} />
            New Transfer
          </button>
        </div>

        {/* QUICK TRANSFER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-indigo-500/10">
              <Send className="text-indigo-400" size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Quick Transfer
              </h2>

              <p className="text-sm text-gray-500">
                Send money to an account
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Recipient"
              className="bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
            />

            <input
              type="text"
              placeholder="Account number"
              className="bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
            />

            <input
              type="number"
              placeholder="Amount"
              className="bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
            />
          </div>

          <button className="mt-4 w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg transition-colors">
            Continue
          </button>
        </motion.div>

        {/* SEARCH */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search transfers..."
              className="w-full bg-gray-800/60 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
            />
          </div>

          <select className="bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 outline-none">
            <option>All Transfers</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>

        {/* TRANSFERS */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden">

          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-700 text-xs uppercase text-gray-500">
            <div className="col-span-4">Recipient</div>
            <div className="col-span-2">Account</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>

          {transfers.map((transfer, index) => (
            <motion.div
              key={transfer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/30 transition-colors"
            >
              <div className="md:col-span-4 flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-500/10">
                  <ArrowUpRight
                    size={18}
                    className="text-red-400"
                  />
                </div>

                <div>
                  <p className="text-white font-medium">
                    {transfer.recipient}
                  </p>

                  <p className="text-gray-500 text-sm">
                    Transfer #{transfer.id}
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center text-gray-400">
                {transfer.account}
              </div>

              <div className="md:col-span-2 flex items-center text-gray-400">
                {transfer.date}
              </div>

              <div className="md:col-span-2 flex items-center">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs ${
                    transfer.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {transfer.status}
                </span>
              </div>

              <div className="md:col-span-2 flex items-center md:justify-end font-semibold text-white">
                {transfer.amount}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}