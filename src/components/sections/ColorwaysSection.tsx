"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { COLORWAYS, PACKS, formatPrice, discountPercent, type ColorwayConfig } from "@/lib/colorways";
import { useUI } from "@/context/UIContext";
import ColorDetailModal from "@/components/ui/ColorDetailModal";

export default function ColorwaysSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const { addToCart, openCart, toast } = useUI();
  const [detailColorway, setDetailColorway] = useState<ColorwayConfig | null>(null);

  const handleAddToCart = (colorway: ColorwayConfig) => {
    addToCart({ colorwayId: colorway.id, name: colorway.name, pack: PACKS[0].label, qty: 1, price: PACKS[0].price, accent: colorway.accent, image: colorway.image });
    toast(`${colorway.name} added to cart!`);
    openCart();
  };

  return (
    <>
      <section id="colorways" ref={ref} className="relative bg-[#080808] py-24 overflow-hidden">

        {/* subtle dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
          {/* heading */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 text-center"
          >
            <span className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35 sm:text-xs">
              Three Rolls Of Film
            </span>
            <h2 className="font-display text-[2rem] leading-tight text-white sm:text-5xl sm:leading-normal lg:text-6xl">
              Three Colorways.{" "}
              <span className="text-white/25">Zero Compromise.</span>
            </h2>
          </motion.div>

          {/* group banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mx-auto mb-14 max-w-3xl overflow-hidden rounded-3xl border border-white/10"
          >
            <Image
              src="/products/trio-group.jpg"
              alt="All three NOXA Lens Q86 colorways together"
              width={1100}
              height={1050}
              className="w-full object-cover"
            />
          </motion.div>

          {/* cards — horizontal scroll on mobile, grid on sm+ */}
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 sm:gap-5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {COLORWAYS.map((colorway, i) => (
              <motion.article
                key={colorway.id}
                initial={{ opacity: 0, y: 52 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative flex w-[76vw] max-w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl sm:w-auto sm:max-w-none"
                style={{ background: colorway.bgGradient }}
              >
                {/* hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at 50% 40%, ${colorway.glowColor} 0%, transparent 70%)`,
                  }}
                />

                {/* case image — clickable to explore */}
                <button
                  onClick={() => setDetailColorway(colorway)}
                  className="relative mx-auto h-52 w-full sm:h-60 cursor-pointer"
                  aria-label={`Explore ${colorway.name}`}
                >
                  <Image
                    src={colorway.image}
                    alt={colorway.name}
                    fill
                    sizes="(max-width: 640px) 60vw, 24vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>

                {/* info */}
                <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-2">
                  {/* name + label */}
                  <div>
                    <span
                      className="block text-[11px] font-bold uppercase tracking-[0.18em]"
                      style={{ color: colorway.accent }}
                    >
                      {colorway.label}
                    </span>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/45 line-clamp-2">
                      {colorway.description}
                    </p>
                  </div>

                  {/* packs */}
                  <div className="flex flex-wrap gap-1.5">
                    {PACKS.map((pk) => (
                      <span
                        key={pk.label}
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                        style={{
                          background: colorway.accent + "1a",
                          color: colorway.accent,
                          border: `1px solid ${colorway.accent}33`,
                        }}
                      >
                        {pk.label}
                      </span>
                    ))}
                  </div>

                  {/* price */}
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg text-white">{formatPrice(PACKS[0].price)}</span>
                    <span className="text-xs text-white/35 line-through">{formatPrice(PACKS[0].originalPrice)}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                      style={{ background: colorway.accent + "22", color: colorway.accent }}
                    >
                      {discountPercent(PACKS[0])}% off
                    </span>
                  </div>

                  {/* divider */}
                  <div className="h-px w-full" style={{ background: colorway.accent + "22" }} />

                  {/* price row + cta */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => setDetailColorway(colorway)}
                      className="text-[11px] font-semibold text-white/40 underline-offset-2 hover:text-white/70 transition-colors"
                    >
                      Explore
                    </button>
                    <button
                      onClick={() => handleAddToCart(colorway)}
                      className="rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
                      style={{ background: colorway.accent, color: colorway.accentDark }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <ColorDetailModal
        colorway={detailColorway}
        onClose={() => setDetailColorway(null)}
      />
    </>
  );
}
