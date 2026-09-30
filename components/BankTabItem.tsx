"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { cn, formUrlQuery } from "@/lib/utils";

export const BankTabItem = ({
  account,
  appwriteItemId,
}: BankTabItemProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

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

  return (
    <button
      type="button"
      onClick={handleBankChange}
      className={cn(
        "relative min-w-[130px] px-1 pb-3 text-left transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "dark:focus-visible:ring-teal-500 dark:focus-visible:ring-offset-slate-950",
      )}
    >
      <p
        className={cn(
          "truncate text-sm font-medium text-slate-500 transition dark:text-slate-400",
          isActive && "font-semibold text-[#0F766E] dark:text-teal-400",
        )}
      >
        {account.name}
      </p>

      {/* Active indicator */}
      <span
        className={cn(
          "absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-transparent transition",
          isActive && "bg-[#0F766E] dark:bg-teal-500",
        )}
      />
    </button>
  );
};