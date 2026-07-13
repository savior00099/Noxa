"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";

interface EarbudPlayerProps {
  scrollProgress: MotionValue<number>;
  image: string;
  glowColor: string;
}

export default function EarbudPlayer({ scrollProgress, image, glowColor }: EarbudPlayerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [battery, setBattery] = useState(100);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltX = useSpring(pointerY, { stiffness: 80, damping: 18, mass: 0.6 });
  const tiltY = useSpring(pointerX, { stiffness: 80, damping: 18, mass: 0.6 });

  const scale = useTransform(scrollProgress, [0, 1], [1, 0.86]);
  const translateY = useTransform(scrollProgress, [0, 1], [0, 90]);
  const opacity = useTransform(scrollProgress, [0, 0.85, 1], [1, 1, 0]);

  // slow "battery drains then tops back up" readout — purely decorative
  useEffect(() => {
    let dir = -1;
    const id = setInterval(() => {
      setBattery((b) => {
        const next = b + dir;
        if (next <= 62) dir = 1;
        if (next >= 100) dir = -1;
        return next;
      });
    }, 220);
    return () => clearInterval(id);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(relX * 14);
    pointerY.set(relY * -10);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      ref={wrapperRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ scale, y: translateY, opacity, perspective: 1200 }}
      className="relative flex h-full w-full items-center justify-center"
    >
      <motion.div
        style={{ rotateX: tiltX, rotateY: tiltY }}
        className="relative flex h-full w-full items-center justify-center will-change-transform"
      >
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative aspect-square h-full max-h-[520px] w-auto"
        >
          {/* radial glow directly behind the case — color follows colorway */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[130%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-all duration-700"
            style={{
              background: `radial-gradient(circle at center, ${glowColor} 0%, rgba(0,0,0,0.1) 65%, transparent 100%)`,
              opacity: 0.85,
            }}
          />

          <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
            <Image
              src={image}
              alt="NOXA Lens Q86 earbud case"
              fill
              priority
              sizes="(max-width: 768px) 70vw, 34vw"
              className="object-cover"
            />
          </div>

          {/* live digital battery badge */}
          <div className="absolute bottom-3 right-3 flex h-16 w-16 flex-col items-center justify-center rounded-full border-[3px] border-[#f4f1ea] bg-[#1a1409] text-[#d9e7c8] shadow-[0_10px_24px_rgba(0,0,0,0.45)] sm:h-20 sm:w-20">
            <span className="font-mono text-base font-bold leading-none sm:text-xl">{battery}%</span>
            <span className="mt-1 text-[6px] uppercase tracking-[1.5px] text-[#9fb98c] sm:text-[7px]">charge</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
