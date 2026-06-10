"use client";

import * as React from "react";
import { Input } from "./form";

interface AutocompleteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suggestions: string[];
}

export const AutocompleteInput = React.forwardRef<HTMLInputElement, AutocompleteInputProps>(
  ({ className, suggestions, onChange, onFocus, value, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [filtered, setFiltered] = React.useState<string[]>([]);
    const containerRef = React.useRef<HTMLDivElement>(null);
    // Use an internal ref if the forwarded ref is not easily usable for dispatching events
    const innerRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      const val = (value as string) || "";
      if (!val) {
        setFiltered([]);
      } else {
        setFiltered(suggestions.filter(s => s.toLowerCase().includes(val.toLowerCase()) && s !== val));
      }
    }, [value, suggestions]);

    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setOpen(true);
      onChange?.(e);
    };

    const handleSelect = (val: string) => {
      setOpen(false);
      // Instead of synthetic event, we update the native input value and dispatch a new Event
      // so react-hook-form's native integration works perfectly.
      const inputElement = innerRef.current;
      if (inputElement) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        nativeInputValueSetter?.call(inputElement, val);
        const ev = new Event("input", { bubbles: true });
        inputElement.dispatchEvent(ev);
      }
    };

    return (
      <div className="relative" ref={containerRef}>
        <Input
          ref={(node) => {
            innerRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          value={value}
          onChange={handleChange}
          onFocus={(e) => {
            setOpen(true);
            onFocus?.(e);
          }}
          className={className}
          autoComplete="off"
          {...props}
        />
        {open && filtered.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-slate-800 dark:bg-slate-950 sm:text-sm">
            {filtered.map((suggestion, index) => (
              <li
                key={`${suggestion}-${index}`}
                className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-slate-900 hover:bg-[var(--accent-soft)] hover:text-[var(--accent-text)] dark:text-slate-100 dark:hover:bg-[var(--accent-muted)] dark:hover:text-[var(--accent)]"
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
AutocompleteInput.displayName = "AutocompleteInput";
