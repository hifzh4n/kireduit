"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const accentOptions = [
  { value: "green", label: "Green", swatch: "#059669" },
  { value: "red", label: "Red", swatch: "#dc2626" },
  { value: "blue", label: "Blue", swatch: "#2563eb" },
  { value: "brown", label: "Brown", swatch: "#92400e" },
  { value: "purple", label: "Purple", swatch: "#7c3aed" },
  { value: "pink", label: "Pink", swatch: "#db2777" },
] as const;

export type AccentColor = (typeof accentOptions)[number]["value"];

type AccentContextValue = {
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
};

const AccentContext = createContext<AccentContextValue | null>(null);
const storageKey = "kireduit-accent";

function isAccentColor(value: string | null): value is AccentColor {
  return accentOptions.some((option) => option.value === value);
}

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<AccentColor>(() => {
    if (typeof window === "undefined") return "green";
    const stored = window.localStorage.getItem(storageKey);
    return isAccentColor(stored) ? stored : "green";
  });

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    window.localStorage.setItem(storageKey, accent);
  }, [accent]);

  const value = useMemo(
    () => ({
      accent,
      setAccent: setAccentState,
    }),
    [accent],
  );

  return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>;
}

export function useAccent() {
  const context = useContext(AccentContext);
  if (!context) {
    throw new Error("useAccent must be used inside AccentProvider");
  }
  return context;
}
