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

    const localRef = React.useRef<HTMLInputElement | null>(null);

    // Merge forwarded ref and local ref
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        localRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const moveCursorToEnd = React.useCallback(() => {
      const el = localRef.current;
      if (el) {
        // Queue the selection change to ensure the browser has finished updating the input value
        requestAnimationFrame(() => {
          const len = el.value.length;
          el.setSelectionRange(len, len);
        });
      }
    }, []);

    // When the parent resets the form value, sync back
    React.useEffect(() => {
      if (value === "" || value === undefined || value === 0) {
        setDigits("");
      } else {
        const str = Math.round(Number(value) * 100).toString();
        setDigits(str);
      }
    }, [value]);

    const displayValue = React.useMemo(() => {
      if (!digits) return "";
      const num = parseInt(digits, 10);
      const whole = Math.floor(num / 100);
      const cents = num % 100;
      const wholeFormatted = whole.toLocaleString();
      return `${wholeFormatted}.${String(cents).padStart(2, "0")}`;
    }, [digits]);

    // Keep cursor at the end when displayValue updates and the element is focused
    React.useEffect(() => {
      if (document.activeElement === localRef.current) {
        moveCursorToEnd();
      }
    }, [displayValue, moveCursorToEnd]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const cleanDigits = inputValue.replace(/\D/g, "");
      
      // Limit to 13 digits to prevent overflow
      const nextDigits = cleanDigits.slice(0, 13);
      
      let finalDigits = nextDigits;
      if (finalDigits) {
        const parsed = parseInt(finalDigits, 10);
        finalDigits = parsed === 0 ? "" : parsed.toString();
      }
      
      setDigits(finalDigits);
      const numValue = finalDigits ? parseInt(finalDigits, 10) / 100 : "";
      onChange?.(numValue);
    };

    return (
      <div className="relative">
        <input
          ref={setRefs}
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          onChange={handleChange}
          onFocus={(e) => {
            moveCursorToEnd();
            rest.onFocus?.(e);
          }}
          onClick={(e) => {
            moveCursorToEnd();
            rest.onClick?.(e);
          }}
          onKeyUp={(e) => {
            moveCursorToEnd();
            rest.onKeyUp?.(e);
          }}
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
