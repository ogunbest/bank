"use client";

import {
  CreditCard,
  Lock,
  Unlock,
  Plus,
  MoreVertical,
  Wifi,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const cards = [
  {
    id: 1,
    type: "Visa Debit",
    number: "4532  ••••  ••••  7821",
    expiry: "09/29",
    holder: "JOSHUA A.",
    status: "Active",
    balance: "$8,420.50",
    color: "from-indigo-600 to-purple-700",
  },
  {
    id: 2,
    type: "Virtual Card",
    number: "5214  ••••  ••••  3490",
    expiry: "11/28",
    holder: "JOSHUA A.",
    status: "Active",
    balance: "$2,150.00",
    color: "from-gray-700 to-gray-900",
  },
];

const activities = [
  {
    name: "Netflix",
    date: "Sep 8, 2026",
    amount: "-$15.99",
  },
  {
    name: "Amazon",
    date: "Sep 6, 2026",
    amount: "-$128.40",
  },
  {
    name: "Uber",
    date: "Sep 5, 2026",
    amount: "-$24.50",
  },
];

export default function CardsPage() {
  const [showNumber, setShowNumber] = useState(false);
  const [frozen, setFrozen] = useState(false);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Cards
            </h1>

            <p className="text-gray-400 mt-1">
              Manage your debit and virtual cards
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-lg transition-colors">
            <Plus size={18} />
            Add New Card
          </button>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${card.color} shadow-xl`}
            >
              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10" />
              <div className="absolute -left-20 -bottom-24 w-56 h-56 rounded-full bg-white/5" />

              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/70 text-sm">
                      {card.type}
                    </p>

                    <p className="text-white text-xl font-semibold mt-1">
                      {card.balance}
                    </p>
                  </div>

                  <CreditCard className="text-white/80" size={32} />
                </div>

                <div className="mt-12">
                  <Wifi
                    size={24}
                    className="text-white/80 rotate-90"
                  />

                  <div className="flex items-center gap-3 mt-4">
                    <p className="text-white text-lg tracking-widest">
                      {showNumber
                        ? card.number
                        : "••••  ••••  ••••  ••••"}
                    </p>

                    <button
                      onClick={() => setShowNumber(!showNumber)}
                      className="text-white/70 hover:text-white"
                    >
                      {showNumber ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-end mt-6">
                  <div>
                    <p className="text-white/50 text-[10px] uppercase">
                      Card Holder
                    </p>

                    <p className="text-white text-sm">
                      {card.holder}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/50 text-[10px] uppercase">
                      Expires
                    </p>

                    <p className="text-white text-sm">
                      {card.expiry}
                    </p>
                  </div>

                  <div className="text-white font-bold italic text-xl">
                    VISA
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CARD CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/10">
                <CreditCard className="text-indigo-400" size={22} />
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Available Balance
                </p>

                <p className="text-white text-xl font-semibold">
                  $8,420.50
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setFrozen(!frozen)}
            className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 text-left hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                {frozen ? (
                  <Unlock className="text-yellow-400" size={22} />
                ) : (
                  <Lock className="text-yellow-400" size={22} />
                )}
              </div>

              <div>
                <p className="text-white font-medium">
                  {frozen ? "Unfreeze Card" : "Freeze Card"}
                </p>

                <p className="text-gray-500 text-sm">
                  {frozen
                    ? "Card is currently frozen"
                    : "Temporarily disable your card"}
                </p>
              </div>
            </div>
          </button>

          <button className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 text-left hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <MoreVertical
                  className="text-emerald-400"
                  size={22}
                />
              </div>

              <div>
                <p className="text-white font-medium">
                  Card Settings
                </p>

                <p className="text-gray-500 text-sm">
                  Manage card preferences
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* RECENT CARD ACTIVITY */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              Recent Card Activity
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Recent purchases made with your card
            </p>
          </div>

          {activities.map((activity) => (
            <div
              key={activity.name}
              className="flex items-center justify-between px-6 py-5 border-b border-gray-700 last:border-b-0"
            >
              <div>
                <p className="text-white font-medium">
                  {activity.name}
                </p>

                <p className="text-gray-500 text-sm">
                  {activity.date}
                </p>
              </div>

              <p className="text-white font-semibold">
                {activity.amount}
              </p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}