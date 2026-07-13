"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";
import { subscribeToAddresses, createOrder, type DeliveryAddress } from "@/lib/firestore";
import { formatPrice } from "@/lib/colorways";
import AddressForm from "./AddressForm";

export default function CartModal() {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQty, toast } = useUI();
  const { user, openAuth, firebaseEnabled } = useAuth();
  const total = cartItems.reduce((s, c) => s + c.price * c.qty, 0);

  const [selectedAddr, setSelectedAddr] = useState<DeliveryAddress | null>(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToAddresses(user.uid, (addrs) => {
      setSelectedAddr((cur) => cur ?? addrs[0] ?? null);
    });
    return () => unsub?.();
  }, [user]);

  const handleCheckout = async () => {
    if (!user) {
      openAuth();
      return;
    }
    if (!selectedAddr) {
      setAddressFormOpen(true);
      return;
    }
    setPlacing(true);
    try {
      await createOrder({
        uid: user.uid,
        items: cartItems,
        total,
        address: selectedAddr,
        status: "Order Placed",
      });
      closeCart();
      toast("Order placed! Track it anytime from your profile.", "success");
      cartItems.forEach((c) => removeFromCart(c.id));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Couldn't place order — please try again.", "info");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
          />
          {/* panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed bottom-0 right-0 top-0 z-[100] flex w-full max-w-md flex-col bg-[#0d0d0d] shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
              <h2 className="font-display text-xl text-white">
                Your Cart
                {cartItems.length > 0 && (
                  <span className="ml-2 rounded-full bg-[#B37C1D] px-2 py-0.5 text-xs font-bold text-[#1A1409]">
                    {cartItems.reduce((s, c) => s + c.qty, 0)}
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <span className="text-5xl opacity-20">📷</span>
                  <p className="text-sm text-white/40">Your cart is empty.<br />Add a colorway to get started.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <span className="text-sm font-semibold text-white">{item.name}</span>
                        <span className="text-xs text-white/40">{item.pack}</span>
                        <span className="text-sm font-bold" style={{ color: item.accent }}>
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-full border border-white/10 px-2 py-1">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-5 text-center text-white/50 hover:text-white">−</button>
                        <span className="w-4 text-center text-sm text-white">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-5 text-center text-white/50 hover:text-white">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-white/25 hover:text-red-400 transition-colors text-xs">✕</button>
                    </div>
                  ))}

                  {/* delivery address picker */}
                  {user && (
                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">Deliver to</p>
                      {selectedAddr ? (
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white">{selectedAddr.fullName} · {selectedAddr.addressType}</p>
                            <p className="mt-0.5 text-xs text-white/40">{selectedAddr.address}, {selectedAddr.area}, {selectedAddr.city}</p>
                          </div>
                          <button onClick={() => setAddressFormOpen(true)} className="shrink-0 text-xs font-semibold text-[#B37C1D]">Change</button>
                        </div>
                      ) : (
                        <button onClick={() => setAddressFormOpen(true)} className="text-sm font-semibold text-[#B37C1D]">+ Add delivery address</button>
                      )}
                    </div>
                  )}

                  {!user && (
                    <button
                      onClick={openAuth}
                      className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-left text-sm text-white/60 hover:border-white/30 hover:text-white transition-colors"
                    >
                      Sign in with Google to save a delivery address and place your order →
                    </button>
                  )}

                  {!firebaseEnabled && (
                    <p className="rounded-xl border border-[#B37C1D]/25 bg-[#B37C1D]/10 px-4 py-3 text-[11px] leading-relaxed text-[#e6c98c]">
                      Firebase isn&apos;t connected in this deployment yet, so checkout is disabled. Add your keys to
                      <code className="text-white"> .env.local</code> to enable orders, accounts and tracking.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-white/[0.08] px-6 py-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Total</span>
                  <span className="font-display text-2xl text-white">{formatPrice(total)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={placing || !firebaseEnabled}
                  className="w-full rounded-full bg-[#B37C1D] py-4 text-sm font-bold uppercase tracking-wider text-[#1A1409] shadow-[0_0_30px_rgba(179,124,29,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_0_46px_rgba(179,124,29,0.5)] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {placing ? "Placing order…" : !user ? "Sign in to Checkout" : !selectedAddr ? "Add Address to Checkout" : `Checkout — ${formatPrice(total)}`}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}

      <AddressForm
        open={addressFormOpen}
        onClose={() => setAddressFormOpen(false)}
        onSaved={(a) => setSelectedAddr(a)}
      />
    </AnimatePresence>
  );
}
