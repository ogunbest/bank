import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/20 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#0F766E] text-white shadow-sm hover:bg-[#115E59]",

        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600",

        outline:
          "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-teal-100 hover:bg-teal-50 hover:text-[#0F766E]",

        secondary:
          "bg-teal-50 text-[#0F766E] hover:bg-teal-100",

        ghost:
          "text-slate-600 hover:bg-teal-50 hover:text-[#0F766E]",

        link:
          "text-[#0F766E] underline-offset-4 hover:text-[#115E59] hover:underline",
      },

      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
          }),
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };