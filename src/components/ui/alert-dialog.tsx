"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./button";

export function ConfirmButton({
  children,
  title,
  description,
  actionLabel = "Delete",
  onConfirm,
  variant = "danger",
  disabled = false,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onConfirm: () => Promise<void> | void;
  variant?: "danger" | "default";
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <span
        className={disabled ? "block cursor-not-allowed" : "block"}
        aria-disabled={disabled}
        onClick={() => !disabled && setOpen(true)}
      >
        {children}
      </span>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-end bg-slate-950/60 p-4 sm:items-center sm:justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl dark:bg-slate-900"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            >
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant={variant} onClick={confirm} disabled={busy}>
                {busy ? "Working..." : actionLabel}
              </Button>
            </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
