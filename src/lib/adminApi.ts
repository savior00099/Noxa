"use client";

import { auth } from "./firebase";

async function authedFetch(path: string, options: RequestInit = {}) {
  if (!auth?.currentUser) throw new Error("Not signed in");
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

// ── Orders ───────────────────────────────────────────────────────────────
export const fetchAdminOrders = () => authedFetch("/api/admin/orders");
export const updateAdminOrderStatus = (orderId: string, status: string) =>
  authedFetch("/api/admin/orders", { method: "PATCH", body: JSON.stringify({ orderId, status }) });

// ── Reviews ──────────────────────────────────────────────────────────────
export const fetchAdminReviews = () => authedFetch("/api/admin/reviews");
export const setReviewPublished = (reviewId: string, published: boolean) =>
  authedFetch("/api/admin/reviews", { method: "PATCH", body: JSON.stringify({ reviewId, published }) });
export const deleteAdminReview = (reviewId: string) =>
  authedFetch("/api/admin/reviews", { method: "DELETE", body: JSON.stringify({ reviewId }) });

// ── Inbox ────────────────────────────────────────────────────────────────
export const fetchAdminThreads = () => authedFetch("/api/admin/messages");
export const sendAdminReply = (uid: string, text: string) =>
  authedFetch("/api/admin/messages", { method: "POST", body: JSON.stringify({ uid, text }) });
