import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "slate",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: "slate" | "emerald" | "red" | "amber" }) {
  const tones = {
    slate: "bg-sky-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    emerald: "bg-[var(--accent-soft)] text-[var(--accent-text)] dark:bg-[var(--accent-muted)] dark:text-[var(--accent)]",
    red: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
  };
  return <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", tones[tone], className)} {...props} />;
}
