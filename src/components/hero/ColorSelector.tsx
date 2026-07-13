"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { COLORWAYS } from "@/lib/colorways";

interface ColorSelectorProps {
  activeIdx: number;
  onSelect: (idx: number) => void;
}

export default function ColorSelector({ activeIdx, onSelect }: ColorSelectorProps) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative z-30 hidden flex-col items-center gap-5 lg:flex"
    >
      {COLORWAYS.map((c, i) => {
        const isActive = i === activeIdx;
        return (
          <motion.button
            key={c.id}
            onClick={() => onSelect(i)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${c.name}`}
            className="flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-md transition-all duration-500"
            style={
              isActive
                ? { boxShadow: `0 0 0 3px #f4f1ea, 0 0 24px ${c.shadowAccent}` }
                : { boxShadow: "0 0 0 1px rgba(255,255,255,0.25)" }
            }
          >
            <span
              className="h-9 w-9 rounded-full"
              style={{ backgroundColor: c.swatch }}
            />
          </motion.button>
        );
      })}
      <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">color</span>
    </motion.div>
  );
}
