import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps =
  React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200",
          "placeholder:text-slate-400",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "hover:border-slate-300",
          "focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10",
          "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:opacity-70",
          "aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:border-red-500 aria-[invalid=true]:focus:ring-red-500/10",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };