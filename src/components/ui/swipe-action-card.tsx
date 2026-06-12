"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";

const maxPull = 72;
const threshold = 58;

export function SwipeActionCard({
  children,
  detailHref,
  editHref,
  onDelete,
}: {
  children: React.ReactNode;
  detailHref: string;
  editHref: string;
  onDelete: () => Promise<void> | void;
}) {
  const router = useRouter();
  const t = useTranslations("SwipeActions");
  const tCommon = useTranslations("Common");
  const tErrors = useTranslations("Errors");
  const startX = useRef(0);
  const moved = useRef(false);
  const dragging = useRef(false);
  const [offset, setOffset] = useState(0);
  const [busy, setBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [navigationPending, setNavigationPending] = useState(false);
  const thresholdNotified = useRef(false);
  const activeAction = offset > threshold ? "edit" : offset < -threshold ? "delete" : null;

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

    const nextOffset = Math.max(-maxPull, Math.min(maxPull, delta));
    const crossedThreshold = Math.abs(nextOffset) > threshold;
    if (crossedThreshold && !thresholdNotified.current) {
      thresholdNotified.current = true;
      navigator.vibrate?.(8);
    }
    if (!crossedThreshold) {
      thresholdNotified.current = false;
    }
    setOffset(nextOffset);
  }

  async function pointerUp() {
    dragging.current = false;
    setIsDragging(false);
    thresholdNotified.current = false;

    if (offset > threshold) {
      setOffset(0);
      setNavigationPending(true);
      router.push(editHref);
    } else if (offset < -threshold) {
      setOffset(0);
      setConfirmOpen(true);
    } else {
      setOffset(0);
    }
  }

  async function deleteItem() {
    setBusy(true);
    try {
      await onDelete();
    } catch (error) {
      toast.error(error instanceof Error ? friendlyFirebaseMessage(error.message, tErrors("permission"), t("unableDeleteRecord")) : t("unableDeleteRecord"));
    } finally {
      setBusy(false);
    }
  }

  function openDetail() {
    if (navigationPending) return;
    if (moved.current || offset !== 0) {
      setOffset(0);
      return;
    }

    setNavigationPending(true);
    router.push(detailHref);
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-lg">
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 flex w-24 items-center justify-center rounded-l-lg bg-[var(--accent)] text-[var(--accent-ink)] transition-all duration-150",
          offset > 8 ? "opacity-100" : "opacity-0",
          activeAction === "edit" && "w-28 shadow-lg shadow-[var(--accent)]/25",
        )}
      >
        <div className={cn("flex flex-col items-center gap-1 text-xs font-semibold transition-transform duration-150", activeAction === "edit" && "scale-110")}>
          <Pencil className="h-4 w-4" />
          {activeAction === "edit" ? tCommon("release") : tCommon("edit")}
        </div>
      </div>
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 flex w-24 items-center justify-center rounded-r-lg bg-red-600 text-white shadow-lg shadow-red-600/30 transition-all duration-150 dark:bg-red-500",
          offset < -8 ? "opacity-100" : "opacity-0",
          activeAction === "delete" && "w-28 shadow-red-600/45",
        )}
      >
        <div className={cn("flex flex-col items-center gap-1 text-xs font-semibold transition-transform duration-150", activeAction === "delete" && "scale-110")}>
          <Trash2 className="h-4 w-4" />
          {activeAction === "delete" ? tCommon("release") : tCommon("delete")}
        </div>
      </div>
      <div
        role="link"
        tabIndex={0}
        aria-label={t("openDetailsInstructions")}
        onClick={openDetail}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setNavigationPending(true);
            router.push(detailHref);
          }
        }}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        className="relative touch-pan-y rounded-lg bg-[#fdf7ff] dark:bg-[#101423]"
        style={{
          transform: `translateX(${offset}px)`,
          opacity: busy ? 0.6 : 1,
          transition: isDragging ? "none" : "transform 180ms ease, scale 150ms ease",
          scale: activeAction ? 0.985 : 1,
          pointerEvents: navigationPending ? "none" : "auto",
        }}
      >
        {children}
        {navigationPending ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/70 backdrop-blur-[1px] dark:bg-slate-950/60">
            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-lg dark:bg-slate-900 dark:text-slate-100">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--accent-text)] dark:text-[var(--accent)]" />
              {tCommon("loading")}
            </div>
          </div>
        ) : null}
      </div>
      </div>
      {createPortal(
        <AnimatePresence>
          {confirmOpen ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-lg border border-sky-100 bg-white/95 p-4 shadow-xl shadow-sky-100/40 dark:border-slate-800 dark:bg-slate-900"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <h2 className="text-base font-semibold">{t("deleteRecordQuestion")}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{t("deleteRecordDescription")}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
                  {tCommon("cancel")}
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={async () => {
                    await deleteItem();
                    setConfirmOpen(false);
                  }}
                  disabled={busy}
                  loading={busy}
                >
                  {busy ? tCommon("deleting") : tCommon("delete")}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

function friendlyFirebaseMessage(message: string, permissionMessage: string, fallback: string) {
  if (message.toLowerCase().includes("permission")) {
    return permissionMessage;
  }

  return message || fallback;
}
