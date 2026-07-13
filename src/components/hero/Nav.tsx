"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";
import ProfileDrawer from "@/components/ui/ProfileDrawer";

const NAV_LINKS = [
  { label: "Colorways", href: "#colorways" },
  { label: "Features",  href: "#features" },
  { label: "Specs",     href: "#specs" },
  { label: "Reviews",   href: "#reviews" },
];

export default function Nav() {
  const { openCart, cartCount } = useUI();
  const { user, openAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleProfileClick = () => {
    if (user) setProfileOpen(true);
    else openAuth();
  };

  return (
    <motion.nav
      variants={fadeUp}
      className="relative z-30 flex items-center justify-between px-5 pt-5 sm:px-10 sm:pt-8"
    >
      {/* logo — real NOXA mark, tinted to sit on any colorway bg */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/15 shadow-[0_0_18px_rgba(179,124,29,0.35)]">
          <Image src="/logo/noxa-icon.png" alt="NOXA" fill sizes="36px" className="object-cover scale-125" />
        </span>
        <span className="font-display text-2xl tracking-wide text-white">NOXA</span>
      </div>

      {/* desktop nav links */}
      <div className="hidden items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1 backdrop-blur-md sm:flex">
        {NAV_LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="rounded-full px-5 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white first:bg-white first:text-umber-dark first:shadow-sm"
          >
            {l.label}
          </a>
        ))}
      </div>

      {/* right icons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* profile */}
        <button
          aria-label="Account"
          onClick={handleProfileClick}
          className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-transform hover:scale-105"
        >
          {user?.photoURL ? (
            <Image src={user.photoURL} alt={user.displayName ?? "Account"} fill sizes="40px" className="object-cover" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5 20c1.4-3.6 4.2-5.5 7-5.5s5.6 1.9 7 5.5" strokeLinecap="round" />
            </svg>
          )}
        </button>

        {/* cart */}
        <button
          aria-label="Cart"
          onClick={openCart}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-umber-dark shadow-sm transition-transform hover:scale-105"
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
            <path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B37C1D] text-[9px] font-bold text-[#1A1409]">
              {cartCount}
            </span>
          )}
        </button>

        {/* mobile hamburger */}
        <button
          aria-label="Menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md sm:hidden"
        >
          <span className="flex flex-col gap-1.5">
            <span className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {/* mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 right-4 top-[calc(100%+8px)] z-50 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl sm:hidden"
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="px-6 py-4 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white border-b border-white/[0.06] last:border-0"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
    </motion.nav>
  );
}
