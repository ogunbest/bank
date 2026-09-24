"use client";

import { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Link2,
  Plus,
  ShieldCheck,
  Unlink,
} from "lucide-react";

import SettingSection from "./SettingSection";

const ConnectedAccounts = () => {
  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      id: 1,
      name: "Paystack",
      description: "Payment processing",
      connected: true,
      icon: CreditCard,
    },
    {
      id: 2,
      name: "Appwrite",
      description: "Database & authentication",
      connected: true,
      icon: ShieldCheck,
    },
    {
      id: 3,
      name: "Bank Account",
      description: "Linked banking service",
      connected: false,
      icon: Link2,
    },
  ]);

  const toggleConnection = (id: number) => {
    setConnectedAccounts((accounts) =>
      accounts.map((account) =>
        account.id === id
          ? { ...account, connected: !account.connected }
          : account,
      ),
    );
  };

  return (
    <SettingSection icon={Link2} title="Connected Services">
      <div className="divide-y divide-slate-100">
        {connectedAccounts.map((account) => {
          const Icon = account.icon;

          return (
            <div
              key={account.id}
              className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                  <Icon size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {account.name}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {account.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    account.connected
                      ? "border-teal-100 bg-teal-50 text-[#0F766E]"
                      : "border-slate-200 bg-slate-50 text-slate-500"
                  }`}
                >
                  {account.connected && <CheckCircle2 size={13} />}
                  {account.connected ? "Connected" : "Not connected"}
                </div>

                <button
                  type="button"
                  onClick={() => toggleConnection(account.id)}
                  className={`flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${
                    account.connected
                      ? "border border-red-100 bg-white text-red-500 hover:bg-red-50"
                      : "bg-[#0F766E] text-white hover:bg-[#115E59]"
                  }`}
                >
                  {account.connected ? (
                    <>
                      <Unlink size={14} />
                      Disconnect
                    </>
                  ) : (
                    <>
                      <Link2 size={14} />
                      Connect
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#0F766E] transition hover:text-[#115E59]"
      >
        <Plus size={17} />
        Add service
      </button>
    </SettingSection>
  );
};

export default ConnectedAccounts;