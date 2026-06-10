"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  value?: number | "";
  onChange?: (value: number | "") => void;
}

/**
 * ATM-style currency input. Digits are entered from the right; the decimal
 * point is always placed 2 positions from the right.
 *
 * e.g.  type "1"  → "0.01"
 *       type "12" → "0.12"
 *       type "123"→ "1.23"
 *
 * Integrates with react-hook-form via Controller / setValue.
 */
export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, onBlur, name, id, placeholder = "0.00", ...rest }, ref) => {
    // Store the raw digit string internally, e.g. "123" → display "1.23"
    const [digits, setDigits] = React.useState<string>(() => {
      if (value === "" || value === undefined || value === 0) return "";
      // Convert existing numeric value back to digit string (e.g. 1.23 → "123")
      const str = Math.round(Number(value) * 100).toString();
      return str;
    });

    // When the parent resets the form value, sync back
    React.useEffect(() => {
      if (value === "" || value === undefined || value === 0) {
        setDigits("");
      } else {
        const str = Math.round(Number(value) * 100).toString();
        setDigits(str);
      }
    // Only run when `value` changes from the outside (form reset)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const displayValue = React.useMemo(() => {
      if (!digits) return "";
      const num = parseInt(digits, 10);
      const whole = Math.floor(num / 100);
      const cents = num % 100;
      const wholeFormatted = whole.toLocaleString();
      return `${wholeFormatted}.${String(cents).padStart(2, "0")}`;
    }, [digits]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Backspace") {
        e.preventDefault();
        const next = digits.slice(0, -1);
        setDigits(next);
        const numValue = next ? parseInt(next, 10) / 100 : "";
        onChange?.(numValue);
        return;
      }

      if (e.key === "Delete") {
        e.preventDefault();
        setDigits("");
        onChange?.("");
        return;
      }

      if (/^\d$/.test(e.key)) {
        e.preventDefault();
        // Max 13 digits total to prevent overflow
        if (digits.length >= 13) return;
        const next = digits + e.key;
        setDigits(next);
        const numValue = parseInt(next, 10) / 100;
        onChange?.(numValue);
      }
    }

    return (
      <div className="relative">
        <input
          ref={ref}
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          readOnly
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          value={displayValue}
          placeholder={placeholder}
          className={cn(
            "flex h-11 w-full min-w-0 max-w-full rounded-md border border-sky-100 bg-white/90 px-3 py-2 text-base outline-none transition focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent-muted)] dark:border-slate-800 dark:bg-slate-950/80 sm:text-sm",
            className,
          )}
          {...rest}
        />
      </div>
    );
  },
);
CurrencyInput.displayName = "CurrencyInput";
