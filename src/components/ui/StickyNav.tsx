"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";
import ProfileDrawer from "./ProfileDrawer";

const LINKS = [
  { label: "Colorways", href: "#colorways" },
  { label: "Features",  href: "#features" },
  { label: "Reviews",   href: "#reviews" },
];

export default function StickyNav() {
  const [visible, setVisible] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { openCart, cartCount } = useUI();
  const { user, openAuth } = useAuth();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleProfileClick = () => {
    if (user) setProfileOpen(true);
    else openAuth();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -64, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 top-0 z-[80] flex items-center justify-between border-b border-white/[0.07] bg-black/80 px-5 py-3 backdrop-blur-xl sm:px-10"
        >
          {/* logo */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/15">
              <Image src="/logo/noxa-icon.png" alt="NOXA" fill sizes="28px" className="object-cover scale-125" />
            </span>
            <span className="font-display text-lg tracking-wide text-white">NOXA</span>
          </div>

          {/* links — desktop */}
          <nav className="hidden items-center gap-1 sm:flex">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* profile */}
            <button
              onClick={handleProfileClick}
              aria-label="Account"
              className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/15 text-white/80 transition-transform hover:scale-105"
            >
              {user?.photoURL ? (
                <Image src={user.photoURL} alt={user.displayName ?? "Account"} fill sizes="36px" className="object-cover" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="3.2" />
                  <path d="M5 20c1.4-3.6 4.2-5.5 7-5.5s5.6 1.9 7 5.5" strokeLinecap="round" />
                </svg>
              )}
            </button>

            {/* cart */}
            <button
              onClick={openCart}
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1A1409] shadow-sm transition-transform hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
                <path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B37C1D] text-[9px] font-bold text-[#1A1409]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </motion.header>
      )}

      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
    </AnimatePresence>
  );
}
