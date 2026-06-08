import { Inbox } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-sky-100 bg-white/80 p-6 text-center dark:border-slate-800 dark:bg-slate-900/90">
      <Inbox className="mx-auto h-8 w-8 text-teal-300" />
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{description}</p>
    </div>
  );
}
