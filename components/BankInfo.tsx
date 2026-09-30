"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

import {
  cn,
  formUrlQuery,
  formatAmount,
  getAccountTypeColors,
} from "@/lib/utils";

const BankInfo = ({
  account,
  appwriteItemId,
  type,
}: BankInfoProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isActive = appwriteItemId === account?.appwriteItemId;

  const handleBankChange = () => {
    if (!account?.appwriteItemId) return;

    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      key: "id",
      value: account.appwriteItemId,
    });

    router.push(newUrl, { scroll: false });
  };

  const colors = getAccountTypeColors(account?.type as AccountTypes);

  return (
    <div
      onClick={handleBankChange}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border bg-white p-4 transition-colors duration-200",
        "dark:bg-slate-900",
        type === "card" &&
          "cursor-pointer hover:-translate-y-0.5 hover:shadow-md",
        type === "card" &&
          !isActive &&
          "border-slate-200 hover:border-teal-200 dark:border-slate-800 dark:hover:border-teal-800",
        isActive &&
          type === "card" &&
          "border-[#0F766E] bg-teal-50/40 shadow-sm dark:border-teal-500 dark:bg-teal-950/40 dark:shadow-none",
        type !== "card" &&
          "border-slate-200 dark:border-slate-800",
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          colors.lightBg || "bg-teal-50 dark:bg-teal-950/50",
        )}
      >
        <Image
          src="/icons/connect-bank.svg"
          width={20}
          height={20}
          alt={account?.subtype || "Bank account"}
        />
      </div>

      {/* Account information */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2
            className={cn(
              "truncate text-sm font-semibold text-slate-900 dark:text-white",
              colors.title,
            )}
          >
            {account.name}
          </h2>

          {type === "full" && (
            <span
              className={cn(
                "hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline-flex",
                colors.lightBg || "bg-teal-50 dark:bg-teal-950/50",
                colors.subText ||
                  "text-[#0F766E] dark:text-teal-400",
              )}
            >
              {account.subtype}
            </span>
          )}
        </div>

        <p
          className={cn(
            "mt-1 text-sm font-semibold",
            colors.subText ||
              "text-[#0F766E] dark:text-teal-400",
          )}
        >
          {formatAmount(account.currentBalance)}
        </p>
      </div>

      {/* Active indicator */}
      {type === "card" && isActive && (
        <span className="hidden shrink-0 rounded-full bg-[#0F766E] px-2.5 py-1 text-[11px] font-semibold text-white dark:bg-teal-600 sm:inline-flex">
          Active
        </span>
      )}
    </div>
  );
};

export default BankInfo;