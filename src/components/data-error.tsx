"use client";

import { AlertCircle } from "lucide-react";

export function DataError({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-red-950 dark:border-red-500/35 dark:bg-red-950/30 dark:text-red-100">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-300" />
      <div>
        <p className="text-sm font-semibold">Unable to load data.</p>
        <p className="text-sm opacity-85">{message}</p>
      </div>
    </div>
  );
}
