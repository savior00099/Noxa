"use client";

import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { CartItem } from "@/context/UIContext";

export interface DeliveryAddress {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  region: string;
  city: string;
  area: string;
  address: string;
  addressType: "Home" | "Office" | "Hometown";
  isDefault?: boolean;
}

export const ORDER_STEPS = [
  "Order Placed",
  "Processing",
  "Confirmed",
  "Packing",
  "Packed",
  "Delivering",
  "Payment",
  "Delivered",
] as const;

export type OrderStatus = (typeof ORDER_STEPS)[number];

export interface OrderRecord {
  id?: string;
  uid: string;
  items: CartItem[];
  total: number;
  address: DeliveryAddress;
  status: OrderStatus;
  pathaoConsignmentId?: string;
  pathaoStatus?: string;
  createdAt?: unknown;
}

export interface SupportMessage {
  id?: string;
  uid: string;
  sender: "user" | "support";
  text: string;
  createdAt?: unknown;
}

/** Saves (or updates) a user's profile document, keyed by their Firebase Auth uid. */
export async function saveUserProfile(uid: string, data: { name: string; email: string; photoURL?: string }) {
  if (!db) return;
  await setDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

/** Saves a delivery address under users/{uid}/addresses. */
export async function saveAddress(uid: string, address: DeliveryAddress) {
  if (!db) throw new Error("Firebase is not configured — see .env.local.example");
  const ref = collection(db, "users", uid, "addresses");
  const docRef = await addDoc(ref, { ...address, createdAt: serverTimestamp() });
  return docRef.id;
}

/** Live-subscribes to a user's saved addresses. */
export function subscribeToAddresses(uid: string, cb: (addresses: DeliveryAddress[]) => void): Unsubscribe | null {
  if (!db) return null;
  const ref = collection(db, "users", uid, "addresses");
  return onSnapshot(ref, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as DeliveryAddress) })));
  });
}

/** Creates an order document under `orders`, then (best-effort) asks our API route to book Pathao pickup. */
export async function createOrder(order: Omit<OrderRecord, "id" | "createdAt">) {
  if (!db) throw new Error("Firebase is not configured — see .env.local.example");
  const ref = collection(db, "orders");
  const docRef = await addDoc(ref, { ...order, createdAt: serverTimestamp() });

  // Best-effort call to the Pathao booking route — safe to fail silently client-side;
  // it will simply leave pathaoStatus unset until PATHAO_* env vars are configured.
  try {
    await fetch("/api/pathao/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: docRef.id, ...order }),
    });
  } catch {
    // non-fatal — order is already saved in Firestore
  }

  return docRef.id;
}

/** Live-subscribes to a user's orders, newest first. */
export function subscribeToOrders(uid: string, cb: (orders: OrderRecord[]) => void): Unsubscribe | null {
  if (!db) return null;
  const ref = query(collection(db, "orders"), where("uid", "==", uid), orderBy("createdAt", "desc"));
  return onSnapshot(ref, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as OrderRecord) })));
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (!db) return;
  await updateDoc(doc(db, "orders", orderId), { status });
}

/** Sends a support inbox message under users/{uid}/messages. */
export async function sendSupportMessage(uid: string, text: string, sender: "user" | "support" = "user") {
  if (!db) throw new Error("Firebase is not configured — see .env.local.example");
  const ref = collection(db, "users", uid, "messages");
  await addDoc(ref, { uid, sender, text, createdAt: serverTimestamp() });
}

/** Live-subscribes to a user's support inbox thread. */
export function subscribeToMessages(uid: string, cb: (messages: SupportMessage[]) => void): Unsubscribe | null {
  if (!db) return null;
  const ref = query(collection(db, "users", uid, "messages"), orderBy("createdAt", "asc"));
  return onSnapshot(ref, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as SupportMessage) })));
  });
}

/** Saves a product review to the `reviews` collection for moderation before publishing. */
export async function saveReview(review: { name: string; colorwayId: string; rating: number; text: string; uid?: string }) {
  if (!db) throw new Error("Firebase is not configured — see .env.local.example");
  const ref = collection(db, "reviews");
  await addDoc(ref, { ...review, createdAt: serverTimestamp(), published: false });
}
