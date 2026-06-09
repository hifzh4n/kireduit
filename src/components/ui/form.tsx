"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("block text-sm font-medium text-slate-700 dark:text-slate-200", className)} {...props} />;
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full min-w-0 max-w-full rounded-md border border-sky-100 bg-white/90 px-3 py-2 text-base outline-none transition focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent-muted)] dark:border-slate-800 dark:bg-slate-950/80 sm:text-sm",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const DateInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, defaultValue, onChange, placeholder = "Select date", value, ...props }, ref) => {
    const tCommon = useTranslations("Common");
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue?.toString() || "");
    const hasValue = value !== undefined ? Boolean(value) : Boolean(uncontrolledValue);
    const displayPlaceholder = placeholder === "Select date" ? tCommon("selectDate") : placeholder;

    return (
      <div className="relative min-w-0">
        <input
          ref={ref}
          type="date"
          value={value}
          defaultValue={defaultValue}
          onChange={(event) => {
            if (value === undefined) {
              setUncontrolledValue(event.currentTarget.value);
            }
            onChange?.(event);
          }}
          className={cn(
            "date-input flex h-11 w-full min-w-0 max-w-full rounded-md border border-sky-100 bg-white/90 px-3 py-2 text-base outline-none transition focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent-muted)] dark:border-slate-800 dark:bg-slate-950/80 sm:text-sm",
            !hasValue && "text-transparent focus:text-slate-900 dark:focus:text-slate-100",
            className,
          )}
          {...props}
        />
        {!hasValue ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-base text-slate-400 dark:text-slate-500 sm:text-sm">
            {displayPlaceholder}
          </span>
        ) : null}
      </div>
    );
  },
);
DateInput.displayName = "DateInput";

export const PasswordInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    const tCommon = useTranslations("Common");
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="relative">
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(
            "password-input flex h-11 w-full min-w-0 max-w-full rounded-md border border-sky-100 bg-white/90 px-3 py-2 pr-11 text-base outline-none transition focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent-muted)] dark:border-slate-800 dark:bg-slate-950/80 sm:text-sm",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          aria-label={visible ? tCommon("hidePassword") : tCommon("showPassword")}
          onClick={() => setVisible((value) => !value)}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition hover:text-[var(--accent-text)] dark:text-slate-400 dark:hover:text-[var(--accent)]"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full min-w-0 max-w-full rounded-md border border-sky-100 bg-white/90 px-3 py-2 text-base outline-none transition focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent-muted)] dark:border-slate-800 dark:bg-slate-950/80 sm:text-sm",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-11 w-full min-w-0 max-w-full rounded-md border border-sky-100 bg-white/90 px-3 py-2 text-base outline-none transition focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent-muted)] dark:border-slate-800 dark:bg-slate-950/80 sm:text-sm",
        className,
      )}
      {...props}
    />
  ),
);
Select.displayName = "Select";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-rose-600">{message}</p>;
}

export function Field({ children }: { children: React.ReactNode }) {
  return <div className="min-w-0 space-y-2">{children}</div>;
}
