"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { formUrlQuery, formatAmount } from "@/lib/utils";

export const BankDropdown = ({
  accounts = [],
  setValue,
  otherStyles,
}: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selected, setSelected] = useState<Account | undefined>(
    accounts[0],
  );

  const handleBankChange = (id: string) => {
    const account = accounts.find(
      (item) => item.appwriteItemId === id,
    );

    if (!account) return;

    setSelected(account);

    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      key: "id",
      value: id,
    });

    router.push(newUrl, { scroll: false });

    if (setValue) {
      setValue("senderBank", id);
    }
  };

  if (!selected) {
    return (
      <div
        className={`flex h-12 w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 md:w-[300px] ${otherStyles || ""}`}
      >
        No account available
      </div>
    );
  }

  return (
    <Select
      value={selected.appwriteItemId}
      onValueChange={handleBankChange}
    >
      <SelectTrigger
        className={`h-12 w-full gap-3 rounded-xl border-slate-200 bg-white px-4 shadow-sm hover:bg-slate-50 focus:ring-[#0F766E] md:w-[300px] ${otherStyles || ""}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50">
            <Image
              src="/icons/credit-card.svg"
              width={18}
              height={18}
              alt="account"
            />
          </div>

          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-semibold text-slate-900">
              {selected.name}
            </p>

            <p className="text-xs text-slate-500">
              {formatAmount(selected.currentBalance)}
            </p>
          </div>
        </div>
      </SelectTrigger>

      <SelectContent
        className="w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white shadow-xl md:w-[300px]"
        align="end"
      >
        <SelectGroup>
          <SelectLabel className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Select account
          </SelectLabel>

          {accounts.map((account: Account) => (
            <SelectItem
              key={account.id}
              value={account.appwriteItemId}
              className="cursor-pointer rounded-lg px-3 py-3 focus:bg-teal-50 focus:text-slate-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  <Image
                    src="/icons/credit-card.svg"
                    width={17}
                    height={17}
                    alt=""
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {account.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {formatAmount(account.currentBalance)}
                  </p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};