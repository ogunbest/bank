"use client";

import {
  Plus,
  Search,
  MoreVertical,
  UserRound,
  Send,
  Trash2,
  Pencil,
} from "lucide-react";
import { motion } from "framer-motion";

const beneficiaries = [
  {
    id: 1,
    name: "John Smith",
    bank: "Chase Bank",
    account: "**** 4821",
    type: "Personal",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    bank: "Bank of America",
    account: "**** 7392",
    type: "Personal",
  },
  {
    id: 3,
    name: "Livingstone Fulfilment",
    bank: "Wells Fargo",
    account: "**** 1938",
    type: "Business",
  },
];

export default function BeneficiariesPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Beneficiaries
            </h1>

            <p className="text-gray-400 mt-1">
              Manage the people and businesses you send money to
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-lg transition-colors">
            <Plus size={18} />
            Add Beneficiary
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mb-6 max-w-xl">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="Search beneficiaries..."
            className="w-full bg-gray-800/60 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
          />
        </div>

        {/* BENEFICIARIES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {beneficiaries.map((beneficiary, index) => (
            <motion.div
              key={beneficiary.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 hover:bg-gray-700/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <UserRound
                      size={22}
                      className="text-indigo-400"
                    />
                  </div>

                  <div>
                    <h2 className="text-white font-semibold">
                      {beneficiary.name}
                    </h2>

                    <p className="text-gray-500 text-sm">
                      {beneficiary.type}
                    </p>
                  </div>
                </div>

                <button className="p-2 rounded-lg hover:bg-gray-700 text-gray-400">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Bank
                  </p>

                  <p className="text-gray-300 mt-1">
                    {beneficiary.bank}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Account
                  </p>

                  <p className="text-gray-300 mt-1">
                    {beneficiary.account}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-5 border-t border-gray-700">
                <button className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg transition-colors">
                  <Send size={16} />
                  Transfer
                </button>

                <button className="p-2.5 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-700">
                  <Pencil size={17} />
                </button>

                <button className="p-2.5 rounded-lg border border-gray-700 text-gray-400 hover:bg-red-500/10 hover:text-red-400">
                  <Trash2 size={17} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* EMPTY ACTION */}
        <div className="mt-8 border border-dashed border-gray-700 rounded-2xl p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
            <Plus className="text-gray-400" size={22} />
          </div>

          <h3 className="text-white font-medium mt-4">
            Add another beneficiary
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            Save a recipient for faster transfers in the future.
          </p>

          <button className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            Add Beneficiary
          </button>
        </div>

      </main>
    </div>
  );
}