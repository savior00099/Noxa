"use client";

import { motion, AnimatePresence, useTransform, type MotionValue } from "framer-motion";
import dynamic from "next/dynamic";
import type { ColorwayConfig } from "@/lib/colorways";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

interface HeroBackgroundProps {
  scrollProgress: MotionValue<number>;
  colorway: ColorwayConfig;
}

export default function HeroBackground({ scrollProgress, colorway }: HeroBackgroundProps) {
  const typeY = useTransform(scrollProgress, [0, 1], [0, -70]);
  const typeOpacity = useTransform(scrollProgress, [0, 1], [0.14, 0.04]);
  const glowScale = useTransform(scrollProgress, [0, 1], [1, 1.15]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* base gradient — crossfades on colorway change */}
      <AnimatePresence mode="sync">
        <motion.div
          key={colorway.id}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75 }}
          className="absolute inset-0"
          style={{ background: colorway.bgGradient }}
        />
      </AnimatePresence>

      {/* deep vignette for premium depth */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 105%, rgba(0,0,0,0.55) 0%, transparent 55%), radial-gradient(circle at 0% 0%, rgba(0,0,0,0.35) 0%, transparent 45%)",
        }}
      />

      {/* ambient glow blobs */}
      <motion.div
        aria-hidden
        style={{ scale: glowScale, backgroundColor: colorway.particle1 + "1a" }}
        className="gsap-glow absolute left-[8%] top-[12%] h-[28rem] w-[28rem] rounded-full blur-[110px] transition-colors duration-700"
      />
      <motion.div
        aria-hidden
        style={{ scale: glowScale, backgroundColor: colorway.particle2 + "26" }}
        className="gsap-glow absolute bottom-[6%] right-[10%] h-[24rem] w-[24rem] rounded-full blur-[110px] transition-colors duration-700"
      />

      {/* large center radial glow behind the case */}
      <div
        aria-hidden
        className="gsap-glow absolute left-1/2 top-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-700"
        style={{
          background: `radial-gradient(circle at center, ${colorway.glowColor} 0%, ${colorway.glowColor2} 35%, rgba(0,0,0,0.08) 65%, transparent 100%)`,
        }}
      />

      {/* oversized decorative NOXA watermark */}
      <div
        aria-hidden
        className="gsap-type absolute inset-0 flex items-center justify-center select-none"
      >
        <motion.span
          style={{ y: typeY, opacity: typeOpacity }}
          className="font-display whitespace-nowrap text-[26vw] leading-none text-white sm:text-[24vw] lg:text-[22vw]"
        >
          NOXA
        </motion.span>
      </div>

      {/* viewfinder corner brackets — signature motif */}
      <div aria-hidden className="pointer-events-none absolute inset-6 sm:inset-10 opacity-40">
        <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-white/60" />
        <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-white/60" />
        <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-white/60" />
        <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-white/60" />
      </div>

      {/* glass reflection sweep */}
      <div
        aria-hidden
        className="absolute -left-1/4 top-0 h-full w-1/2 rotate-6 bg-gradient-to-r from-white/[0.04] to-transparent"
      />

      <ParticleField particle1={colorway.particle1} particle2={colorway.particle2} />

      {/* inner shadow for luxury depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.55)]"
      />
    </div>
  );
}
