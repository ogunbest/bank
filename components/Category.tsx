"use client";

import Image from "next/image";

import { topCategoryStyles } from "@/constants";
import { cn } from "@/lib/utils";

import { Progress } from "./ui/progress";

const Category = ({ category }: CategoryProps) => {
  const {
    
    circleBg,
    text: { main, count },
    progress: { bg: progressBg },
    icon,
  } =
    topCategoryStyles[
      category.name as keyof typeof topCategoryStyles
    ] || topCategoryStyles.default;

  const percentage =
    category.totalCount > 0
      ? Math.min(
          (category.count / category.totalCount) * 100,
          100,
        )
      : 0;

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-4",
        "shadow-sm transition hover:shadow-md",
      )}
    >
      <div className="flex items-center gap-4">
        {/* Category icon */}
        <figure
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            circleBg || "bg-teal-50",
          )}
        >
          <Image
            src={icon}
            width={20}
            height={20}
            alt={category.name}
          />
        </figure>

        {/* Category information */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h2
              className={cn(
                "truncate text-sm font-semibold text-slate-900",
                main,
              )}
            >
              {category.name}
            </h2>

            <span
              className={cn(
                "shrink-0 text-sm font-semibold text-[#0F766E]",
                count,
              )}
            >
              {category.count}
            </span>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <Progress
              value={percentage}
              className={cn(
                "h-1.5 w-full bg-slate-100",
                progressBg,
              )}
            />
          </div>

          <p className="mt-2 text-xs text-slate-400">
            {Math.round(percentage)}% of total
          </p>
        </div>
      </div>
    </div>
  );
};

export default Category;