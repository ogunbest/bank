"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { formUrlQuery } from "@/lib/utils";

export const Pagination = ({
  page,
  totalPages,
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(page);
  const total = Number(totalPages);

  const handleNavigation = (type: "prev" | "next") => {
    const pageNumber =
      type === "prev" ? currentPage - 1 : currentPage + 1;

    const newUrl = formUrlQuery({
      params: searchParams?.toString() ?? "",
      key: "page",
      value: pageNumber.toString(),
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
      <Button
        type="button"
        variant="ghost"
        onClick={() => handleNavigation("prev")}
        disabled={currentPage <= 1}
        className="h-10 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-[#0F766E] disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-teal-950/40 dark:hover:text-teal-400"
      >
        <ChevronLeft size={18} />
        <span className="ml-1 hidden sm:inline">Previous</span>
      </Button>

      <div className="flex items-center rounded-xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <span className="text-[#0F766E] dark:text-teal-400">
          {currentPage}
        </span>

        <span className="mx-2 text-slate-300 dark:text-slate-600">
          /
        </span>

        <span>{total}</span>
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={() => handleNavigation("next")}
        disabled={currentPage >= total}
        className="h-10 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-[#0F766E] disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-teal-950/40 dark:hover:text-teal-400"
      >
        <span className="mr-1 hidden sm:inline">Next</span>
        <ChevronRight size={18} />
      </Button>
    </div>
  );
};