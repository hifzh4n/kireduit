import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "slate",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: "slate" | "emerald" | "red" | "amber" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    red: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  };
  return <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", tones[tone], className)} {...props} />;
}
