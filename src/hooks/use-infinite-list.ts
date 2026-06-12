"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_BATCH_SIZE = 10;

export function useInfiniteList<T>(
  items: T[],
  getKey: (item: T) => string,
  batchSize = DEFAULT_BATCH_SIZE,
) {
  const [pagination, setPagination] = useState({ itemSignature: "", visibleCount: batchSize });
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const itemSignature = useMemo(() => items.map(getKey).join("|"), [getKey, items]);
  const visibleCount = pagination.itemSignature === itemSignature ? pagination.visibleCount : batchSize;
  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const hasMore = visibleCount < items.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setPagination((current) => {
          const currentCount = current.itemSignature === itemSignature ? current.visibleCount : batchSize;
          return {
            itemSignature,
            visibleCount: Math.min(currentCount + batchSize, items.length),
          };
        });
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [batchSize, hasMore, itemSignature, items.length, visibleCount]);

  return { hasMore, sentinelRef, visibleItems };
}
