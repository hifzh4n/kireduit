"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

const actionWidth = 88;
const threshold = 42;

export function SwipeActionCard({
  children,
  detailHref,
  editHref,
  deleteLabel = "Delete",
  editLabel = "Edit",
  onDelete,
}: {
  children: React.ReactNode;
  detailHref: string;
  editHref: string;
  deleteLabel?: string;
  editLabel?: string;
  onDelete: () => Promise<void> | void;
}) {
  const router = useRouter();
  const startX = useRef(0);
  const moved = useRef(false);
  const dragging = useRef(false);
  const [offset, setOffset] = useState(0);
  const [busy, setBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  function pointerDown(event: React.PointerEvent<HTMLDivElement>) {
    startX.current = event.clientX;
    moved.current = false;
    dragging.current = true;
    setIsDragging(true);
  }

  function pointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;

    const delta = event.clientX - startX.current;
    if (Math.abs(delta) > 8) {
      moved.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    setOffset(Math.max(-actionWidth, Math.min(actionWidth, delta)));
  }

  function pointerUp() {
    dragging.current = false;
    setIsDragging(false);

    if (offset > threshold) {
      setOffset(actionWidth);
    } else if (offset < -threshold) {
      setOffset(-actionWidth);
    } else {
      setOffset(0);
    }
  }

  async function deleteItem() {
    setBusy(true);
    try {
      await onDelete();
      setOffset(0);
    } finally {
      setBusy(false);
    }
  }

  function openDetail() {
    if (moved.current || offset !== 0) {
      setOffset(0);
      return;
    }

    router.push(detailHref);
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute inset-y-0 left-0 flex w-24 items-center justify-center bg-[var(--accent)] text-[var(--accent-ink)]">
        <button type="button" className="flex h-full w-full flex-col items-center justify-center gap-1 text-xs font-semibold" onClick={() => router.push(editHref)}>
          <Pencil className="h-4 w-4" />
          {editLabel}
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex w-24 items-center justify-center bg-rose-600 text-white">
        <button type="button" className="flex h-full w-full flex-col items-center justify-center gap-1 text-xs font-semibold disabled:opacity-60" disabled={busy} onClick={deleteItem}>
          <Trash2 className="h-4 w-4" />
          {busy ? "..." : deleteLabel}
        </button>
      </div>
      <div
        role="link"
        tabIndex={0}
        aria-label="Open details"
        onClick={openDetail}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            router.push(detailHref);
          }
        }}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        className="relative touch-pan-y bg-transparent"
        style={{
          transform: `translateX(${offset}px)`,
          transition: isDragging ? "none" : "transform 180ms ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}
