"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  subscribeToOrders,
  subscribeToAddresses,
  subscribeToMessages,
  sendSupportMessage,
  type OrderRecord,
  type DeliveryAddress,
  type SupportMessage,
} from "@/lib/firestore";
import { formatPrice } from "@/lib/colorways";
import AddressForm from "./AddressForm";
import OrderTracking from "./OrderTracking";

const SUPPORT_EMAIL = "smartproductb@gmail.com";
const SUPPORT_WHATSAPP = "8801887321156";

type Tab = "overview" | "orders" | "addresses" | "inbox";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ open, onClose }: Props) {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [msgDraft, setMsgDraft] = useState("");

  useEffect(() => {
    if (!user) return;
    const unsub1 = subscribeToOrders(user.uid, setOrders);
    const unsub2 = subscribeToAddresses(user.uid, setAddresses);
    const unsub3 = subscribeToMessages(user.uid, setMessages);
    return () => {
      unsub1?.();
      unsub2?.();
      unsub3?.();
    };
  }, [user]);

  const handleSend = async () => {
    if (!user || !msgDraft.trim()) return;
    const text = msgDraft.trim();
    setMsgDraft("");
    await sendSupportMessage(user.uid, text, "user");
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed bottom-0 right-0 top-0 z-[100] flex w-full max-w-md flex-col bg-[#0d0d0d] shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <Image src={user.photoURL} alt={user.displayName ?? "You"} width={38} height={38} className="rounded-full" />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B37C1D] text-sm font-bold text-[#1A1409]">
                    {(user.displayName ?? user.email ?? "?")[0].toUpperCase()}
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold text-white">{user.displayName ?? "Your account"}</p>
                  <p className="text-xs text-white/40">{user.email}</p>
                </div>
              </div>
              <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white transition-colors">✕</button>
            </div>

            {/* tabs */}
            <div className="flex gap-1 border-b border-white/[0.08] px-4 pt-3">
              {([["overview", "Overview"], ["orders", "Orders"], ["addresses", "Addresses"], ["inbox", "Inbox"]] as [Tab, string][]).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="rounded-t-lg px-4 py-2.5 text-xs font-semibold transition-colors"
                  style={tab === id ? { color: "#B37C1D", borderBottom: "2px solid #B37C1D" } : { color: "rgba(255,255,255,0.4)" }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {tab === "overview" && (
                <div className="flex flex-col gap-3">
                  <RowLink label="My Orders" value={`${orders.length}`} onClick={() => setTab("orders")} />
                  <RowLink label="Saved Addresses" value={`${addresses.length}`} onClick={() => setTab("addresses")} />
                  <RowLink label="Inbox" value={`${messages.length}`} onClick={() => setTab("inbox")} />
                  <div className="mt-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Customer Service</p>
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="mt-2 block text-sm text-white hover:text-[#B37C1D]">{SUPPORT_EMAIL}</a>
                    <a href={`https://wa.me/${SUPPORT_WHATSAPP}`} target="_blank" rel="noreferrer" className="mt-1 block text-sm text-white hover:text-[#B37C1D]">WhatsApp +{SUPPORT_WHATSAPP}</a>
                  </div>
                  <button onClick={signOut} className="mt-4 w-full rounded-full border border-white/15 py-3 text-sm font-semibold text-white/70 hover:text-white hover:border-white/30 transition-colors">
                    Sign out
                  </button>
                </div>
              )}

              {tab === "orders" && (
                <div className="flex flex-col gap-3">
                  {orders.length === 0 && <p className="text-sm text-white/40">No orders yet.</p>}
                  {orders.map((o) => (
                    <div key={o.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                      <button onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id ?? null)} className="flex w-full items-center justify-between">
                        <div className="text-left">
                          <p className="text-xs text-white/40">Order #{o.id?.slice(0, 8)}</p>
                          <p className="text-sm font-semibold text-white">{formatPrice(o.total)} · {o.items.length} item{o.items.length > 1 ? "s" : ""}</p>
                        </div>
                        <span className="rounded-full px-3 py-1 text-[10px] font-bold" style={{ background: "#B37C1D22", color: "#E6C98C" }}>{o.status}</span>
                      </button>
                      {expandedOrder === o.id && (
                        <div className="mt-4 border-t border-white/[0.07] pt-4">
                          <OrderTracking order={o} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tab === "addresses" && (
                <div className="flex flex-col gap-3">
                  {addresses.length === 0 && <p className="text-sm text-white/40">No saved addresses yet.</p>}
                  {addresses.map((a) => (
                    <div key={a.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">{a.fullName}</p>
                        <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] text-white/50">{a.addressType}</span>
                      </div>
                      <p className="mt-1 text-xs text-white/40">{a.phone}{a.email ? ` · ${a.email}` : ""}</p>
                      <p className="mt-1 text-xs text-white/40">{a.address}, {a.area}, {a.city}, {a.region}</p>
                    </div>
                  ))}
                  <button onClick={() => setAddressFormOpen(true)} className="mt-1 w-full rounded-full border border-dashed border-white/20 py-3 text-sm font-semibold text-white/60 hover:text-white hover:border-white/40 transition-colors">
                    + Add new address
                  </button>
                </div>
              )}

              {tab === "inbox" && (
                <div className="flex h-full flex-col">
                  <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pb-4">
                    {messages.length === 0 && (
                      <p className="text-sm text-white/40">
                        No messages yet. Send us a note about your order and our support team will reply here.
                      </p>
                    )}
                    {messages.map((m) => (
                      <div key={m.id} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.sender === "user" ? "self-end bg-[#B37C1D] text-[#1A1409]" : "self-start bg-white/[0.06] text-white"}`}>
                        {m.text}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2 border-t border-white/[0.08] pt-3">
                    <input
                      value={msgDraft}
                      onChange={(e) => setMsgDraft(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Message NOXA support…"
                      className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-[#B37C1D]"
                    />
                    <button onClick={handleSend} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B37C1D] text-[#1A1409]">→</button>
                  </div>
                  <p className="mt-3 text-center text-[11px] text-white/30">
                    Prefer WhatsApp? Message our supplier directly at{" "}
                    <a href={`https://wa.me/${SUPPORT_WHATSAPP}`} target="_blank" rel="noreferrer" className="text-[#B37C1D]">+{SUPPORT_WHATSAPP}</a>
                  </p>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}

      <AddressForm
        open={addressFormOpen}
        onClose={() => setAddressFormOpen(false)}
        onSaved={() => setAddressFormOpen(false)}
      />
    </AnimatePresence>
  );
}

function RowLink({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 text-left hover:border-white/20 transition-colors">
      <span className="text-sm text-white">{label}</span>
      <span className="flex items-center gap-2 text-sm text-white/40">
        {value}
        <span>›</span>
      </span>
    </button>
  );
}
