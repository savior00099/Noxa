"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, type Transition } from "framer-motion";
import gsap from "gsap";
import Nav from "./Nav";
import HeroBackground from "./HeroBackground";
import EarbudPlayer from "./EarbudPlayer";
import HeroContent from "./HeroContent";
import ColorSelector from "./ColorSelector";
import { COLORWAYS } from "@/lib/colorways";

const ENTRY_DURATION = 0.8;
const PAUSE_DURATION = 3.8;
const EXIT_DURATION  = 2.8;

export default function Hero() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isFirst, setIsFirst] = useState(true);

  const colorway = COLORWAYS[activeIdx];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const waitMs = ((isFirst ? 1.4 + ENTRY_DURATION : ENTRY_DURATION) + PAUSE_DURATION) * 1000;
    timerRef.current = setTimeout(() => {
      setIsFirst(false);
      setDirection(1);
      setActiveIdx((i) => (i + 1) % COLORWAYS.length);
    }, waitMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx]);

  const onNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsFirst(false);
    setDirection(1);
    setActiveIdx((i) => (i + 1) % COLORWAYS.length);
  }, []);

  const onPrev = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsFirst(false);
    setDirection(-1);
    setActiveIdx((i) => (i - 1 + COLORWAYS.length) % COLORWAYS.length);
  }, []);

  const onSetColorway = useCallback((idx: number) => {
    if (idx === activeIdx) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsFirst(false);
    setDirection(idx > activeIdx ? 1 : -1);
    setActiveIdx(idx);
  }, [activeIdx]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".gsap-bg",      { opacity: 0 }, { opacity: 1, duration: 1.3 })
        .fromTo(".gsap-glow",    { opacity: 0 }, { opacity: 1, duration: 1.4, stagger: 0.1 }, "-=0.9")
        .fromTo(".gsap-type",    { opacity: 0, scale: 0.92 }, { opacity: 0.14, scale: 1, duration: 1.6 }, "-=1.1")
        .fromTo(".gsap-case",    { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=1.2")
        .fromTo(".gsap-content", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.7");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const initialState = isFirst
    ? { x: 0, opacity: 0, scale: 0.82 }
    : { x: direction > 0 ? "100vw" : "-100vw", opacity: 1, scale: 1 };

  const entryTransition: Transition = {
    duration: ENTRY_DURATION,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    delay: isFirst ? 1.4 : 0,
  };

  const exitTarget = direction > 0 ? "-110vw" : "110vw";

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[600px] w-full"
    >
      <div ref={containerRef} className="relative flex w-full flex-col overflow-hidden">

        {/* Background */}
        <div className="gsap-bg absolute inset-0">
          <HeroBackground scrollProgress={scrollYProgress} colorway={colorway} />
        </div>

        {/* Nav */}
        <Nav />

        {/* Case slot */}
        <div
          className={[
            "gsap-case z-10",
            "relative mx-auto flex items-center justify-center",
            "h-[52%] w-full overflow-hidden",
            "sm:absolute sm:left-1/2 sm:top-1/2 sm:h-auto sm:w-auto sm:overflow-visible",
            "sm:-translate-x-1/2 sm:-translate-y-1/2",
          ].join(" ")}
        >
          <div className="pointer-events-none relative h-full w-[62vw] sm:h-auto sm:w-auto">
            <style>{`@media(min-width:640px){.case-sizer{width:clamp(220px,28vw,420px)!important;height:clamp(220px,45vh,420px)!important}}`}</style>
            <div className="case-sizer pointer-events-auto relative h-full w-full">
              <AnimatePresence mode="sync">
                <motion.div
                  key={activeIdx}
                  className="absolute inset-0"
                  initial={initialState}
                  animate={{ x: 0, opacity: 1, scale: 1, transition: entryTransition }}
                  exit={{ x: exitTarget, transition: { duration: EXIT_DURATION, ease: "linear" } }}
                >
                  <EarbudPlayer
                    scrollProgress={scrollYProgress}
                    image={colorway.image}
                    glowColor={colorway.glowColor}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="relative z-20 sm:absolute sm:inset-0 sm:flex sm:items-center sm:justify-between sm:px-10 sm:pb-10 lg:px-14">

          <div
            className={[
              "gsap-content",
              "flex flex-1 flex-col justify-end px-5 pb-7 pt-5",
              "sm:flex-none sm:justify-start sm:p-0",
            ].join(" ")}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] sm:hidden"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)",
              }}
            />
            <div className="relative z-10">
              <HeroContent
                colorway={colorway}
                activeDot={activeIdx}
                onPrev={onPrev}
                onNext={onNext}
                onSetColorway={onSetColorway}
              />
            </div>
          </div>

          {/* color selector — desktop only */}
          <ColorSelector activeIdx={activeIdx} onSelect={onSetColorway} />
        </div>

        {/* mobile colorway dot nav — pinned above content */}
        <div className="absolute bottom-[calc(52%+8px)] left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 sm:hidden">
          {COLORWAYS.map((c, i) => (
            <button
              key={c.id}
              aria-label={`Switch to ${c.name}`}
              onClick={() => onSetColorway(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === activeIdx ? "1.75rem" : "0.5rem",
                backgroundColor: i === activeIdx ? colorway.accent : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
