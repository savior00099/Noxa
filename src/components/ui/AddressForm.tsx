"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { saveAddress, type DeliveryAddress } from "@/lib/firestore";

const REGIONS = ["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"];
const ADDRESS_TYPES: DeliveryAddress["addressType"][] = ["Home", "Office", "Hometown"];

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: (address: DeliveryAddress) => void;
}

export default function AddressForm({ open, onClose, onSaved }: Props) {
  const { user } = useAuth();
  const [form, setForm] = useState<DeliveryAddress>({
    fullName: user?.displayName ?? "",
    phone: "",
    email: user?.email ?? "",
    region: "",
    city: "",
    area: "",
    address: "",
    addressType: "Home",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof DeliveryAddress) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    if (!user) return;
    if (!form.fullName || !form.phone || !form.region || !form.city || !form.address) {
      setError("Please fill in name, phone, region, city and address.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await saveAddress(user.uid, form);
      onSaved(form);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save address.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="flex max-h-[88vh] w-full flex-col overflow-y-auto rounded-t-3xl bg-[#0f0f0f] p-6 sm:w-[440px] sm:rounded-3xl"
            >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl text-white">Add shipping address</h2>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white text-sm">✕</button>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Full Name">
                <input value={form.fullName} onChange={set("fullName")} placeholder="Abu Sayeed" className="ninput" />
              </Field>
              <Field label="Phone Number">
                <input value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" className="ninput" />
              </Field>
              <Field label="Email">
                <input value={form.email} onChange={set("email")} placeholder="you@gmail.com" type="email" className="ninput" />
              </Field>
              <Field label="Region">
                <select value={form.region} onChange={set("region")} className="ninput">
                  <option value="">Select Region</option>
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="City / District">
                <input value={form.city} onChange={set("city")} placeholder="e.g. Gazipur" className="ninput" />
              </Field>
              <Field label="Area">
                <input value={form.area} onChange={set("area")} placeholder="e.g. Jorpukur" className="ninput" />
              </Field>
              <Field label="Address">
                <textarea value={form.address} onChange={set("address")} placeholder="House, Flat No, Road" className="ninput min-h-[80px] resize-y" />
              </Field>

              <div>
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/30">Address Type</span>
                <div className="flex gap-2">
                  {ADDRESS_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, addressType: t }))}
                      className="flex-1 rounded-xl border py-2.5 text-xs font-semibold transition-all"
                      style={
                        form.addressType === t
                          ? { borderColor: "#B37C1D", background: "#B37C1D22", color: "#E6C98C" }
                          : { borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">{error}</p>}

              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-1 w-full rounded-full bg-[#B37C1D] py-3.5 text-sm font-bold uppercase tracking-wider text-[#1A1409] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Address"}
              </button>
            </div>

            <style>{`.ninput{width:100%;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);border-radius:12px;padding:12px 14px;font-size:14px;color:#fff;outline:none}
            .ninput:focus{border-color:#B37C1D}
            .ninput option{background:#111;color:#fff}`}</style>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">{label}</span>
      {children}
    </label>
  );
}
