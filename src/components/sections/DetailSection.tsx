"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const CHECKS_LEFT = [
  "Large, always-on percentage display on the case",
  "Type-C fast charging — 1 to 3 hours to full",
  "200mAh case battery, 3–5 hours per earbud charge",
  "Touch controls on each bud for calls, tracks and volume",
];

const CHECKS_RIGHT = [
  "Painless clip-on design for all-day wear",
  "10mm dynamic drivers tuned for roomy, surrounding sound",
  "Single-color ambient light ring on each bud",
  "Quick auto-pairing the instant the lid opens",
];

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-relaxed text-white/60">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#415C2B]">
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="#E0E3DE" strokeWidth="2">
          <path d="M2 6l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {children}
    </li>
  );
}

export default function DetailSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="relative bg-[#050505] px-5 py-20 sm:px-10 sm:py-28 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-20 lg:gap-28">

        {/* panel 1 — digital display */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
          >
            <Image
              src="/products/display-desk.jpg"
              alt="NOXA Lens Q86 case showing digital battery display"
              width={900}
              height={880}
              className="w-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B37C1D]/80 sm:text-xs">
              The Readout
            </span>
            <h3 className="mb-4 font-display text-3xl leading-tight text-white sm:text-4xl">
              You can see the power at a glance.
            </h3>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
              No app required. The digital screen sits where a lens would on a real camera, counting down from 100 in real time so you always know when to top up.
            </p>
            <ul className="flex flex-col gap-3">
              {CHECKS_LEFT.map((c) => <Check key={c}>{c}</Check>)}
            </ul>
          </motion.div>
        </div>

        {/* panel 2 — secure fit */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1"
          >
            <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B37C1D]/80 sm:text-xs">
              The Fit
            </span>
            <h3 className="mb-4 font-display text-3xl leading-tight text-white sm:text-4xl">
              Built to disappear on your ear, not off it.
            </h3>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
              The semi-in-ear, clip-mounted shape spreads its weight across the outer ear instead of sealing the canal — no ache after a long call, no sudden pop-out mid-set.
            </p>
            <ul className="flex flex-col gap-3">
              {CHECKS_RIGHT.map((c) => <Check key={c}>{c}</Check>)}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="order-1 overflow-hidden rounded-3xl border border-white/10 shadow-2xl lg:order-2"
          >
            <Image
              src="/products/hero-worn.jpg"
              alt="Person wearing the NOXA Lens Q86 earbud, holding the case"
              width={900}
              height={880}
              className="w-full object-cover"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
