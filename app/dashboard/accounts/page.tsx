"use client";

import {
  Building2,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  Plus,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const accounts = [
  {
    id: 1,
    name: "Main Checking Account",
    type: "Checking Account",
    number: "•••• 4821",
    balance: "$12,450.80",
    available: "$12,450.80",
    icon: Building2,
  },
  {
    id: 2,
    name: "Savings Account",
    type: "Savings Account",
    number: "•••• 7392",
    balance: "$28,920.45",
    available: "$28,920.45",
    icon: Wallet,
  },
];

export default function AccountsPage() {
  const [showBalances, setShowBalances] = useState(true);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Accounts
            </h1>

            <p className="text-gray-400 mt-1">
              Manage your bank accounts and balances
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
            <Plus size={18} />
            Add Account
          </button>
        </div>

        {/* BALANCE SUMMARY */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                Total Balance
              </p>

              <div className="flex items-center gap-3 mt-2">
                <h2 className="text-3xl font-bold text-white">
                  {showBalances ? "$41,371.25" : "••••••••"}
                </h2>

                <button
                  onClick={() => setShowBalances(!showBalances)}
                  className="text-gray-400 hover:text-white"
                  aria-label="Toggle balance visibility"
                >
                  {showBalances ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10">
              <Wallet
                size={28}
                className="text-indigo-400"
              />
            </div>
          </div>
        </motion.div>

        {/* ACCOUNTS */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">
            Your Accounts
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {accounts.map((account, index) => {
            const Icon = account.icon;

            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-colors"
              >
                {/* ACCOUNT HEADER */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-indigo-500/10">
                      <Icon
                        size={24}
                        className="text-indigo-400"
                      />
                    </div>

                    <div>
                      <h3 className="text-white font-semibold">
                        {account.name}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        {account.type}
                      </p>
                    </div>
                  </div>

                  <button className="text-gray-500 hover:text-white">
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* ACCOUNT NUMBER */}
                <div className="mt-8">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">
                    Account Number
                  </p>

                  <p className="text-gray-300 mt-1">
                    {account.number}
                  </p>
                </div>

                {/* BALANCE */}
                <div className="mt-6 pt-5 border-t border-gray-700">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">
                        Current Balance
                      </p>

                      <p className="text-2xl font-bold text-white mt-1">
                        {showBalances
                          ? account.balance
                          : "••••••••"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">
                        Available
                      </p>

                      <p className="text-emerald-400 font-medium mt-1">
                        {showBalances
                          ? account.available
                          : "••••••••"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 bg-gray-800/60 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition-colors text-left">
              <CreditCard
                size={20}
                className="text-pink-400"
              />

              <div>
                <p className="text-white font-medium">
                  View Cards
                </p>

                <p className="text-gray-500 text-sm">
                  Manage your cards
                </p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-gray-800/60 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition-colors text-left">
              <Wallet
                size={20}
                className="text-emerald-400"
              />

              <div>
                <p className="text-white font-medium">
                  Transfer Money
                </p>

                <p className="text-gray-500 text-sm">
                  Move money between accounts
                </p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-gray-800/60 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition-colors text-left">
              <Building2
                size={20}
                className="text-blue-400"
              />

              <div>
                <p className="text-white font-medium">
                  Link Bank
                </p>

                <p className="text-gray-500 text-sm">
                  Connect another bank
                </p>
              </div>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}