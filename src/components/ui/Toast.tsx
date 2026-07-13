"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUI } from "@/context/UIContext";

export default function ToastContainer() {
  const { toasts } = useUI();

  return (
    <div className="pointer-events-none fixed bottom-6 right-4 z-[200] flex flex-col items-end gap-2 sm:right-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111] px-4 py-3 shadow-xl backdrop-blur-md"
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                t.type === "success" ? "bg-[#B37C1D] text-[#1A1409]" : "bg-blue-500 text-white"
              }`}
            >
              {t.type === "success" ? "✓" : "i"}
            </span>
            <span className="text-sm text-white/90">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
