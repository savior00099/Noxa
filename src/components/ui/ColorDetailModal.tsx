"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";
import type { ColorwayConfig } from "@/lib/colorways";
import { PACKS, formatPrice } from "@/lib/colorways";

interface Props {
  colorway: ColorwayConfig | null;
  onClose: () => void;
}

export default function ColorDetailModal({ colorway, onClose }: Props) {
  const [selectedPack, setSelectedPack] = useState(0);
  const { addToCart, openCart, toast } = useUI();

  const handleAdd = () => {
    if (!colorway) return;
    const pk = PACKS[selectedPack];
    addToCart({
      colorwayId: colorway.id,
      name: colorway.name,
      pack: pk.label,
      qty: 1,
      price: pk.price,
      accent: colorway.accent,
      image: colorway.image,
    });
    toast(`${colorway.name} (${pk.label}) added to cart!`);
    onClose();
    openCart();
  };

  return (
    <AnimatePresence>
      {colorway && (
        <>
          {/* backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* sheet — slides up on mobile, centred modal on sm+ */}
          <motion.div
            key="sheet"
            initial={{ y: "100%", opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-[91] flex flex-col rounded-t-3xl bg-[#0f0f0f] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[480px] sm:rounded-3xl"
            style={{ border: `1px solid ${colorway.accent}22` }}
          >
            {/* drag handle */}
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-white/10 sm:hidden" />

            {/* case image */}
            <div
              className="relative h-52 w-full overflow-hidden rounded-t-3xl sm:rounded-t-3xl"
              style={{ background: colorway.bgGradient }}
            >
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at 50% 60%, ${colorway.glowColor} 0%, transparent 65%)`,
                }}
              />
              <Image
                src={colorway.image}
                alt={colorway.name}
                fill
                sizes="480px"
                className="object-cover opacity-95"
              />
            </div>

            {/* content */}
            <div className="flex flex-col gap-4 p-6">
              {/* title */}
              <div>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: colorway.accent }}
                >
                  {colorway.label}
                </span>
                <h3 className="mt-0.5 font-display text-2xl text-white">{colorway.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/45">{colorway.description}</p>
              </div>

              {/* pack picker */}
              <div>
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  Select pack
                </span>
                <div className="flex flex-col gap-2">
                  {PACKS.map((pk, i) => (
                    <button
                      key={pk.label}
                      onClick={() => setSelectedPack(i)}
                      className="flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all"
                      style={{
                        borderColor: selectedPack === i ? colorway.accent : "rgba(255,255,255,0.08)",
                        background: selectedPack === i ? colorway.accent + "18" : "transparent",
                      }}
                    >
                      <span>
                        <span className="block text-xs font-bold" style={{ color: selectedPack === i ? colorway.accent : "rgba(255,255,255,0.7)" }}>{pk.label}</span>
                        <span className="block text-[10px] text-white/35">{pk.detail}</span>
                      </span>
                      <span className="text-right">
                        <span className="block text-xs font-bold" style={{ color: selectedPack === i ? colorway.accent : "rgba(255,255,255,0.7)" }}>{formatPrice(pk.price)}</span>
                        <span className="block text-[10px] text-white/30 line-through">{formatPrice(pk.originalPrice)}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* add to cart */}
              <button
                onClick={handleAdd}
                className="w-full rounded-full py-3.5 text-sm font-bold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95"
                style={{
                  background: colorway.accent,
                  color: colorway.accentDark,
                  boxShadow: `0 0 28px ${colorway.accent}44`,
                }}
              >
                Add to Cart — {formatPrice(PACKS[selectedPack].price)}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
