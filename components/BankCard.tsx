"use client";

import Image from "next/image";
import Link from "next/link";

import { formatAmount } from "@/lib/utils";
import Copy from "./Copy";

const BankCard = ({
  account,
  userName,
  showBalance = true,
}: CreditCardProps) => {
  return (
    <div className="flex w-full flex-col">
      <Link
        href={`/transaction-history/?id=${account.appwriteItemId}`}
        className="group relative block min-h-[210px] overflow-hidden rounded-3xl bg-[#0F766E] p-6 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-teal-950/40" />

        <div className="relative z-10 flex h-full min-h-[158px] flex-col justify-between">
          {/* Top */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-teal-100">
                Account
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                {account.name}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Image
                src="/icons/Paypass.svg"
                width={20}
                height={24}
                alt="Contactless"
              />
            </div>
          </div>

          {/* Balance */}
          <div className="mt-5">
            <p className="text-xs text-teal-100">
              Available balance
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight">
              {formatAmount(account.currentBalance)}
            </p>
          </div>

          {/* Bottom */}
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-teal-100">
                Account holder
              </p>

              <p className="mt-1 max-w-[180px] truncate text-sm font-semibold">
                {userName}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-teal-100">
                Account
              </p>

              <p className="mt-1 font-mono text-sm font-semibold tracking-widest">
                •••• {account?.mask}
              </p>
            </div>
          </div>
        </div>

        {/* Mastercard mark */}
        <div className="absolute bottom-5 right-5 opacity-90">
          <Image
            src="/icons/mastercard.svg"
            width={42}
            height={30}
            alt="Card"
          />
        </div>
      </Link>

      {showBalance && (
        <div className="mt-3">
          <Copy title={account?.shareableId} />
        </div>
      )}
    </div>
  );
};

export default BankCard;