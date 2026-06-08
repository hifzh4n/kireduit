"use client";

import { useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const maxPull = 86;
const triggerPull = 68;

export function PullToRefresh({
  children,
  onRefresh,
}: {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
}) {
  const startY = useRef(0);
  const pulling = useRef(false);
  const [distance, setDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  function touchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (window.scrollY > 0 || refreshing) return;
    startY.current = event.touches[0]?.clientY ?? 0;
    pulling.current = true;
    setIsPulling(true);
  }

  function touchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (!pulling.current || refreshing) return;

    const currentY = event.touches[0]?.clientY ?? 0;
    const delta = currentY - startY.current;
    if (delta <= 0) {
      setDistance(0);
      return;
    }

    setDistance(Math.min(maxPull, delta * 0.45));
  }

  async function touchEnd() {
    if (!pulling.current || refreshing) return;
    pulling.current = false;
    setIsPulling(false);

    if (distance < triggerPull) {
      setDistance(0);
      return;
    }

    setRefreshing(true);
    setDistance(56);
    try {
      await onRefresh();
      await new Promise((resolve) => setTimeout(resolve, 450));
    } finally {
      setRefreshing(false);
      setDistance(0);
    }
  }

  const ready = distance >= triggerPull;

  return (
    <div
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
      onTouchCancel={() => {
        pulling.current = false;
        setIsPulling(false);
        setDistance(0);
      }}
    >
      <div
        className="pointer-events-none flex justify-center overflow-hidden"
        style={{
          height: distance,
          transition: isPulling ? "none" : "height 180ms ease",
        }}
      >
        <div
          className={cn(
            "mt-3 flex h-10 items-center gap-2 rounded-full border border-sky-100 bg-white/90 px-4 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200",
            ready && "text-[var(--accent-text)] dark:text-[var(--accent)]",
          )}
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          {refreshing ? "Refreshing" : ready ? "Release to refresh" : "Pull to refresh"}
        </div>
      </div>
      {children}
    </div>
  );
}
