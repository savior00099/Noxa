"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { value: "3",    label: "Colorways" },
  { value: "100h", label: "Total Playtime" },
  { value: "IPX-5", label: "Waterproof" },
];

const PILLARS = [
  {
    icon: "◎",
    title: "Ear-Mounted Secure Fit",
    body: "A clip wraps the outer ear instead of wedging into the canal, so it stays on through runs, commutes and workouts.",
  },
  {
    icon: "◈",
    title: "Live Digital Display",
    body: "The case's lens-ring is a real battery readout — glance down and know exactly how much charge is left.",
  },
  {
    icon: "◇",
    title: "Studio-Grade Calls",
    body: "Dual-mic isolation and the LHDC codec keep calls and playback clear, with delay under 30ms for synced video.",
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="features" ref={ref} className="relative overflow-hidden bg-[#050505] py-12 px-5 sm:py-28 sm:px-10 lg:px-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none font-display text-[32vw] leading-none text-white/[0.02] sm:text-[20vw]"
      >
        NOXA
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* header row — mobile */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 sm:mb-16 lg:hidden"
        >
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B37C1D]/60">
            Through The Lens
          </span>
          <h2 className="font-display text-[1.75rem] leading-[1.08] text-white">
            Every detail{" "}
            <span className="text-white/30">shot on purpose.</span>
          </h2>
        </motion.div>

        {/* stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="mb-6 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] sm:mb-20"
        >
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5 py-4 px-2 text-center sm:py-10 sm:px-4">
              <span className="font-display text-2xl text-white sm:text-5xl lg:text-6xl">{s.value}</span>
              <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/35 sm:text-xs sm:tracking-[0.2em]">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* pillars */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">

          {/* left — desktop only */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="hidden lg:flex flex-col justify-center gap-6"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B37C1D]/70">Through The Lens</span>
            <h2 className="font-display text-5xl leading-[1.05] text-white sm:text-6xl">
              Every detail<br />
              <span className="text-white/30">shot on purpose.</span>
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-white/50">
              We borrowed the vocabulary of a good camera — a fast aperture, a steady grip, a readout you can trust — and built it into earbuds instead.
            </p>
            <button
              onClick={() => document.getElementById("colorways")?.scrollIntoView({ behavior: "smooth" })}
              className="w-fit rounded-full bg-[#B37C1D] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#1A1409] transition-all hover:scale-105 hover:shadow-[0_0_32px_rgba(179,124,29,0.45)] active:scale-95"
            >
              Shop All Colorways
            </button>
          </motion.div>

          {/* right — pillar cards */}
          <div className="flex flex-col gap-2.5 sm:gap-5">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.08 }}
                className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 sm:gap-5 sm:rounded-2xl sm:p-6"
              >
                <span className="shrink-0 text-lg text-[#B37C1D]/60 sm:text-2xl">{p.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{p.title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-white/40 sm:text-sm">{p.body}</p>
                </div>
              </motion.div>
            ))}

            {/* CTA — mobile only */}
            <motion.button
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
              onClick={() => document.getElementById("colorways")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-1 w-full rounded-full bg-[#B37C1D] py-3.5 text-sm font-bold uppercase tracking-wider text-[#1A1409] active:scale-95 hover:shadow-[0_0_32px_rgba(179,124,29,0.4)] lg:hidden"
            >
              Shop All Colorways
            </motion.button>
          </div>
        </div>

      </div>
    </section>
  );
}
