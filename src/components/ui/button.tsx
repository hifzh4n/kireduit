"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "rich-click-button relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-md px-4 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--accent)] text-[var(--accent-ink)] hover:bg-[var(--accent-hover)]",
        secondary: "bg-violet-100 text-slate-800 hover:bg-sky-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
        ghost: "hover:bg-sky-100 dark:hover:bg-slate-800",
        outline: "border border-sky-100 bg-white/90 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900",
        danger: "bg-red-600 text-white shadow-md shadow-red-600/25 hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-700",
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
  ({ className, onClick, variant, size, ...props }, ref) => {
    const [spinning, setSpinning] = React.useState(false);

    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        data-spinning={spinning ? "true" : undefined}
        ref={ref}
        onClick={(event) => {
          if (!props.disabled) {
            setSpinning(false);
            window.requestAnimationFrame(() => setSpinning(true));
            window.setTimeout(() => setSpinning(false), 950);
          }
          onClick?.(event);
        }}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
