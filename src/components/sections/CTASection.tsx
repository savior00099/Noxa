"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useUI } from "@/context/UIContext";
import { COLORWAYS, PACKS } from "@/lib/colorways";

const MARQUEE_ITEMS = [
  "Sepia Umber", "·", "Fern Olive", "·", "Bone Cream", "·",
  "Bluetooth 5.3", "·", "IPX-5 Waterproof", "·", "LHDC Codec", "·",
  "JL Chipset", "·",
];

const STATS = [
  { value: "5.3",  unit: "",   label: "Bluetooth",         accent: "#B37C1D" },
  { value: "IPX",  unit: "-5", label: "Waterproof Rating", accent: "#E0E3DE" },
  { value: "100",  unit: "h",  label: "Total Playtime",    accent: "#B37C1D" },
  { value: "3",    unit: "×",  label: "Colorways",         accent: "#E0E3DE" },
];

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const { addToCart, openCart, toast } = useUI();

  const handleAddToCart = () => {
    const colorway = COLORWAYS[0];
    addToCart({ colorwayId: colorway.id, name: colorway.name, pack: PACKS[0].label, qty: 1, price: PACKS[0].price, accent: colorway.accent, image: colorway.image });
    toast(`${colorway.name} added to cart!`);
    openCart();
  };

  const handleBuyNow = () => {
    const colorway = COLORWAYS[0];
    addToCart({ colorwayId: colorway.id, name: colorway.name, pack: PACKS[0].label, qty: 1, price: PACKS[0].price, accent: colorway.accent, image: colorway.image });
    toast("Order placed! You'll receive a confirmation email soon.");
  };

  return (
    <section id="specs" ref={ref} className="relative overflow-hidden bg-[#050505]">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* marquee */}
      <div className="flex overflow-hidden border-b border-white/[0.06] bg-[#0d0d0d] py-2.5">
        {[0, 1].map((n) => (
          <motion.div
            key={n}
            animate={{ x: ["0%", "-100%"] }}
            transition={{ duration: 22, ease: "linear", repeat: Infinity }}
            className="flex shrink-0 items-center gap-6 pr-6"
          >
            {MARQUEE_ITEMS.map((item, i) => (
              <span
                key={i}
                className={`whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.2em] ${
                  item === "·" ? "text-white/20" : "text-white/35"
                }`}
              >
                {item}
              </span>
            ))}
          </motion.div>
        ))}
      </div>

      {/* main */}
      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:py-24 sm:px-10 lg:px-16">

        {/* headline */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center sm:mb-20"
        >
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30 sm:text-xs">
            Zero compromise
          </p>
          <h2 className="font-display text-[2.2rem] leading-[0.95] tracking-tight text-white sm:text-[clamp(3rem,9vw,8rem)]">
            Same Grip.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #B37C1D 0%, #E0E3DE 50%, #B37C1D 100%)" }}
            >
              Zero Slip.
            </span>
          </h2>
        </motion.div>

        {/* spec stats — 2×2 on mobile, 4 cols on lg */}
        <div className="mb-10 grid grid-cols-2 gap-3 sm:mb-20 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.08 }}
              className="group relative flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] px-3 py-7 text-center sm:px-6 sm:py-10"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${s.accent}18 0%, transparent 70%)` }}
              />
              <div className="flex items-end gap-0.5">
                <span
                  className="font-display text-[2rem] leading-none sm:text-[clamp(2.8rem,6vw,5rem)]"
                  style={{ color: s.accent }}
                >
                  {s.value}
                </span>
                {s.unit && (
                  <span
                    className="mb-1 font-display text-base leading-none opacity-70 sm:mb-2 sm:text-2xl"
                    style={{ color: s.accent }}
                  >
                    {s.unit}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40 sm:text-xs sm:tracking-[0.18em]">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <p className="max-w-xs text-xs leading-relaxed text-white/35 sm:max-w-md sm:text-[15px]">
            Pick your colorway. Clip them in. Feel exactly what a secure fit is supposed to feel like.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <button
              onClick={handleAddToCart}
              className="w-full rounded-full border border-white/15 bg-white/[0.06] py-3.5 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-all active:scale-95 hover:bg-white/[0.12] sm:w-auto sm:px-10 sm:py-4"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full rounded-full bg-[#B37C1D] py-3.5 text-sm font-bold uppercase tracking-wider text-[#1A1409] shadow-[0_0_28px_rgba(179,124,29,0.35)] transition-all active:scale-95 hover:scale-105 hover:shadow-[0_0_44px_rgba(179,124,29,0.55)] sm:w-auto sm:px-10 sm:py-4"
            >
              Buy Now
            </button>
          </div>
        </motion.div>

      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
