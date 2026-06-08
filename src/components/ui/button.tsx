"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-teal-300 text-slate-800 hover:bg-teal-200 dark:bg-teal-300 dark:text-slate-900 dark:hover:bg-teal-200",
        secondary: "bg-violet-100 text-slate-800 hover:bg-sky-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
        ghost: "hover:bg-sky-100 dark:hover:bg-slate-800",
        outline: "border border-sky-100 bg-white/90 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900",
        danger: "bg-rose-300 text-slate-800 hover:bg-rose-200 dark:bg-rose-300 dark:text-slate-900 dark:hover:bg-rose-200",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-3",
        icon: "h-11 w-11 px-0",
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
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
  ),
);
Button.displayName = "Button";
