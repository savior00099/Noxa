"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { staggerContainer, staggerItem, buttonHover, buttonTap } from "@/lib/motion";
import type { ColorwayConfig } from "@/lib/colorways";
import { COLORWAYS, PACKS, formatPrice, discountPercent } from "@/lib/colorways";
import { useUI } from "@/context/UIContext";

const CHIPS = ["Bluetooth 5.3", "Digital Display", "IPX-5 Waterproof"];

interface HeroContentProps {
  colorway: ColorwayConfig;
  activeDot: number;
  onPrev: () => void;
  onNext: () => void;
  onSetColorway: (idx: number) => void;
}

export default function HeroContent({ colorway, activeDot, onPrev, onNext, onSetColorway }: HeroContentProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openCart, toast } = useUI();

  const handleAddToCart = () => {
    addToCart({
      colorwayId: colorway.id,
      name: colorway.name,
      pack: PACKS[0].label,
      qty: quantity,
      price: PACKS[0].price,
      accent: colorway.accent,
      image: colorway.image,
    });
    toast(`${colorway.name} × ${quantity} added to cart!`);
    openCart();
  };

  const handleExploreColorways = () => {
    const el = document.getElementById("colorways");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      variants={staggerContainer}
      className="relative z-30 flex max-w-xl flex-col gap-2 sm:gap-4 lg:gap-6"
    >
      {/* kicker chip */}
      <motion.span
        variants={staggerItem}
        className="inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md"
        style={{ borderColor: colorway.accent + "4d", backgroundColor: colorway.accent + "1a", color: colorway.accent }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colorway.accent, boxShadow: `0 0 8px ${colorway.accent}e6` }} />
        New · Lens Q86 Series
      </motion.span>

      {/* headline */}
      <motion.h1 variants={staggerItem} className="font-display leading-[0.95] text-white">
        <span
          className="block text-[2.2rem] text-white sm:text-[clamp(2.8rem,7vw,5.5rem)]"
          style={{ WebkitTextStroke: `2px ${colorway.stroke}`, paintOrder: "stroke fill" }}
        >
          NOXA
        </span>
        <span
          className="block text-[1.25rem] transition-colors duration-700 sm:text-[clamp(1.4rem,3.4vw,2.75rem)]"
          style={{ color: colorway.accent }}
        >
          {colorway.name}
        </span>
      </motion.h1>

      {/* description */}
      <motion.p
        variants={staggerItem}
        className="max-w-md text-xs leading-relaxed text-white/75 line-clamp-2 sm:line-clamp-none sm:text-base lg:text-lg"
      >
        {colorway.description}
      </motion.p>

      {/* chips — hidden on smallest mobile */}
      <motion.div variants={staggerItem} className="hidden flex-wrap gap-2 xs:flex sm:gap-2.5">
        {CHIPS.map((chip) => (
          <span key={chip} className="rounded-full border border-white/20 bg-white/[0.06] px-3 py-1.5 text-xs text-white/85 backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm">
            {chip}
          </span>
        ))}
      </motion.div>

      {/* price */}
      <motion.div variants={staggerItem} className="flex items-center gap-2.5">
        <span className="font-display text-2xl text-white sm:text-3xl">{formatPrice(PACKS[0].price)}</span>
        <span className="text-sm text-white/35 line-through">{formatPrice(PACKS[0].originalPrice)}</span>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
          style={{ background: colorway.accent + "22", color: colorway.accent }}
        >
          {discountPercent(PACKS[0])}% off
        </span>
      </motion.div>

      {/* CTAs */}
      <motion.div variants={staggerItem} className="mt-1 flex flex-wrap items-center gap-2.5 sm:gap-4">
        <motion.button
          whileHover={buttonHover}
          whileTap={buttonTap}
          onClick={handleAddToCart}
          className="rounded-full px-5 py-2.5 text-sm font-semibold transition-shadow sm:px-8 sm:py-3.5"
          style={{ backgroundColor: colorway.accent, color: colorway.accentDark, boxShadow: `0 8px 30px ${colorway.shadowAccent}` }}
        >
          Add to Cart — {formatPrice(PACKS[0].price)}
        </motion.button>
        <motion.button
          whileHover={buttonHover}
          whileTap={buttonTap}
          onClick={handleExploreColorways}
          className="rounded-full border border-white/25 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/[0.12] sm:px-8 sm:py-3.5"
        >
          Explore Colorways
        </motion.button>
      </motion.div>

      {/* quantity + colorway nav — hidden on mobile */}
      <motion.div variants={staggerItem} className="mt-1 hidden flex-wrap items-center gap-6 sm:flex sm:mt-4">
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 backdrop-blur-md">
          <button aria-label="Decrease" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10">−</button>
          <span className="w-4 text-center text-sm font-medium text-white">{quantity}</span>
          <button aria-label="Increase" onClick={() => setQuantity((q) => q + 1)} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10">+</button>
        </div>

        <div className="flex items-center gap-2">
          <button aria-label="Previous colorway" onClick={onPrev} className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:scale-105 transition-transform" style={{ backgroundColor: colorway.stroke, boxShadow: `0 4px 16px ${colorway.shadowAccent}` }}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button aria-label="Next colorway" onClick={onNext} className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:scale-105 transition-transform" style={{ backgroundColor: colorway.stroke, boxShadow: `0 4px 16px ${colorway.shadowAccent}` }}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          <div className="ml-1 flex items-center gap-1.5">
            {COLORWAYS.map((c, i) => (
              <button
                key={c.id}
                aria-label={`Switch to ${c.name}`}
                onClick={() => onSetColorway(i)}
                className="h-1 rounded-full transition-all duration-300"
                style={{ width: i === activeDot ? "1.5rem" : "0.625rem", backgroundColor: i === activeDot ? colorway.accent : "rgba(255,255,255,0.3)" }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
