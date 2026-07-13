"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal() {
  const { isAuthOpen, closeAuth, signInWithGoogle, firebaseEnabled } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuth}
            className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-[120] w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f] p-7 text-center shadow-2xl"
          >
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#B37C1D]/15">
              <span className="h-6 w-6 rounded-full border-2 border-[#B37C1D]" />
            </span>
            <h2 className="font-display text-xl text-white">Sign in to continue</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/45">
              We ask for a quick Google sign-in before checkout so we can save your delivery
              address, order history and support inbox.
            </p>

            {!firebaseEnabled && (
              <p className="mt-4 rounded-xl border border-[#B37C1D]/30 bg-[#B37C1D]/10 px-4 py-3 text-left text-xs leading-relaxed text-[#e6c98c]">
                Firebase isn&apos;t connected yet. Add your project keys to <code className="text-white">.env.local</code> (see
                <code className="text-white"> .env.local.example</code>) to enable sign-in.
              </p>
            )}

            {error && (
              <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-left text-xs text-red-300">
                {error}
              </p>
            )}

            <button
              onClick={handleSignIn}
              disabled={busy || !firebaseEnabled}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-white py-3.5 text-sm font-semibold text-[#1A1409] transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg viewBox="0 0 48 48" className="h-4.5 w-4.5">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.3 5.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.8 18.9 12 24 12c3.1 0 5.8 1.1 8 3l6-6C34.3 5.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.3 0 10-1.8 13.7-5l-6.3-5.3C29.4 35.6 26.8 36.5 24 36.5c-5.4 0-9.9-3.4-11.5-8.2l-6.5 5C9.6 39.6 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.5-2.7 4.6-5 6l6.3 5.3C40.1 36.3 44 30.9 44 24c0-1.2-.1-2.4-.4-3.5z" />
              </svg>
              {busy ? "Signing in…" : "Continue with Google"}
            </button>

            <button onClick={closeAuth} className="mt-3 w-full py-2 text-xs text-white/35 hover:text-white/60">
              Not now
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
