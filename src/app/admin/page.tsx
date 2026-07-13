"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { ORDER_STEPS, type OrderStatus, type OrderRecord } from "@/lib/firestore";
import {
  fetchAdminOrders,
  updateAdminOrderStatus,
  fetchAdminReviews,
  setReviewPublished,
  deleteAdminReview,
  fetchAdminThreads,
  sendAdminReply,
} from "@/lib/adminApi";

type Tab = "orders" | "reviews" | "inbox";

interface ReviewRecord {
  id: string;
  name: string;
  colorwayId: string;
  rating: number;
  text: string;
  published: boolean;
  createdAt?: { seconds?: number } | null;
}

interface Thread {
  uid: string;
  name: string;
  email: string;
  messages: Array<{ id: string; sender: "user" | "support"; text: string; createdAt?: { seconds?: number } | null }>;
}

function fmtDate(ts?: { seconds?: number } | null) {
  if (!ts?.seconds) return "—";
  return new Date(ts.seconds * 1000).toLocaleString();
}

export default function AdminPage() {
  const { user, loading, firebaseEnabled, signInWithGoogle } = useAuth();
  const [tab, setTab] = useState<Tab>("orders");
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Orders
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Inbox
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    setError(null);
    try {
      const data = await fetchAdminOrders();
      setOrders(data.orders);
      setAuthorized(true);
    } catch (e) {
      setAuthorized(false);
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const loadReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const data = await fetchAdminReviews();
      setReviews(data.reviews);
      setAuthorized(true);
    } catch (e) {
      setAuthorized(false);
      setError(e instanceof Error ? e.message : "Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  const loadThreads = useCallback(async () => {
    setThreadsLoading(true);
    try {
      const data = await fetchAdminThreads();
      setThreads(data.threads);
      setAuthorized(true);
    } catch (e) {
      setAuthorized(false);
      setError(e instanceof Error ? e.message : "Failed to load inbox");
    } finally {
      setThreadsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    if (tab === "orders") loadOrders();
    if (tab === "reviews") loadReviews();
    if (tab === "inbox") loadThreads();
  }, [user, tab, loadOrders, loadReviews, loadThreads]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    try {
      await updateAdminOrderStatus(orderId, status);
    } catch {
      loadOrders(); // revert to server truth on failure
    }
  };

  const handlePublishToggle = async (reviewId: string, published: boolean) => {
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, published } : r)));
    try {
      await setReviewPublished(reviewId, published);
    } catch {
      loadReviews();
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    try {
      await deleteAdminReview(reviewId);
    } catch {
      loadReviews();
    }
  };

  const handleSendReply = async () => {
    if (!activeThread || !replyText.trim()) return;
    const text = replyText.trim();
    setReplyText("");
    try {
      await sendAdminReply(activeThread, text);
      loadThreads();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send reply");
    }
  };

  // ── Gate states ────────────────────────────────────────────────────────
  if (!firebaseEnabled) {
    return (
      <Centered>
        Firebase isn&apos;t configured yet. Set the <code>NEXT_PUBLIC_FIREBASE_*</code> and{" "}
        <code>FIREBASE_SERVICE_ACCOUNT_KEY</code> env vars first.
      </Centered>
    );
  }

  if (loading) return <Centered>Loading…</Centered>;

  if (!user) {
    return (
      <Centered>
        <p className="mb-4">Sign in with your admin Google account to continue.</p>
        <button
          onClick={signInWithGoogle}
          className="rounded-full bg-ochre px-6 py-2 font-medium text-ink hover:opacity-90 transition"
        >
          Sign in with Google
        </button>
      </Centered>
    );
  }

  if (authorized === false) {
    return (
      <Centered>
        <p className="text-red-400 mb-2">Not authorized</p>
        <p className="text-sm text-bone/60">
          Signed in as {user.email}. This account isn&apos;t in the ADMIN_EMAILS allowlist.
        </p>
      </Centered>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">NOXA Admin</h1>
        <span className="text-sm text-bone/60">{user.email}</span>
      </header>

      <nav className="flex gap-2 mb-8 border-b border-bone/10">
        {(["orders", "reviews", "inbox"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 capitalize text-sm font-medium border-b-2 transition ${
              tab === t ? "border-ochre text-ochre" : "border-transparent text-bone/50 hover:text-bone"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {tab === "orders" && (
        <section>
          {ordersLoading ? (
            <p className="text-bone/50">Loading orders…</p>
          ) : orders.length === 0 ? (
            <p className="text-bone/50">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-bone/50 border-b border-bone/10">
                    <th className="py-2 pr-4">Order</th>
                    <th className="py-2 pr-4">Customer</th>
                    <th className="py-2 pr-4">Total</th>
                    <th className="py-2 pr-4">Placed</th>
                    <th className="py-2 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-bone/5">
                      <td className="py-3 pr-4 font-mono text-xs">{o.id?.slice(0, 8)}</td>
                      <td className="py-3 pr-4">
                        {o.address?.fullName}
                        <div className="text-xs text-bone/40">{o.address?.phone}</div>
                      </td>
                      <td className="py-3 pr-4">৳{o.total}</td>
                      <td className="py-3 pr-4 text-xs text-bone/50">{fmtDate(o.createdAt as { seconds?: number } | null)}</td>
                      <td className="py-3 pr-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id!, e.target.value as OrderStatus)}
                          className="bg-ink border border-bone/20 rounded px-2 py-1 text-sm"
                        >
                          {ORDER_STEPS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {tab === "reviews" && (
        <section className="space-y-4">
          {reviewsLoading ? (
            <p className="text-bone/50">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <p className="text-bone/50">No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="border border-bone/10 rounded-lg p-4 flex justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{r.name}</span>
                    <span className="text-ochre text-xs">{"★".repeat(r.rating)}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        r.published ? "bg-olive/30 text-olive" : "bg-bone/10 text-bone/50"
                      }`}
                    >
                      {r.published ? "Published" : "Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-bone/70">{r.text}</p>
                  <p className="text-xs text-bone/30 mt-1">{fmtDate(r.createdAt)} · {r.colorwayId}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handlePublishToggle(r.id, !r.published)}
                    className="text-xs px-3 py-1 rounded-full border border-bone/20 hover:bg-bone/10 transition"
                  >
                    {r.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => handleDeleteReview(r.id)}
                    className="text-xs px-3 py-1 rounded-full border border-red-400/30 text-red-400 hover:bg-red-400/10 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {tab === "inbox" && (
        <section className="grid grid-cols-3 gap-4 h-[60vh]">
          <div className="col-span-1 border border-bone/10 rounded-lg overflow-y-auto">
            {threadsLoading ? (
              <p className="text-bone/50 p-4">Loading…</p>
            ) : threads.length === 0 ? (
              <p className="text-bone/50 p-4">No messages yet.</p>
            ) : (
              threads.map((t) => (
                <button
                  key={t.uid}
                  onClick={() => setActiveThread(t.uid)}
                  className={`w-full text-left px-4 py-3 border-b border-bone/5 hover:bg-bone/5 transition ${
                    activeThread === t.uid ? "bg-bone/10" : ""
                  }`}
                >
                  <div className="text-sm font-medium">{t.name || t.email || t.uid.slice(0, 8)}</div>
                  <div className="text-xs text-bone/40 truncate">
                    {t.messages[t.messages.length - 1]?.text}
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="col-span-2 border border-bone/10 rounded-lg flex flex-col">
            {!activeThread ? (
              <p className="text-bone/50 p-4 m-auto">Select a conversation</p>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {threads
                    .find((t) => t.uid === activeThread)
                    ?.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                          m.sender === "support" ? "ml-auto bg-ochre/20" : "bg-bone/10"
                        }`}
                      >
                        {m.text}
                        <div className="text-[10px] text-bone/30 mt-1">{fmtDate(m.createdAt)}</div>
                      </div>
                    ))}
                </div>
                <div className="flex gap-2 p-3 border-t border-bone/10">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                    placeholder="Type a reply…"
                    className="flex-1 bg-ink border border-bone/20 rounded-full px-4 py-2 text-sm"
                  />
                  <button
                    onClick={handleSendReply}
                    className="rounded-full bg-ochre px-4 py-2 text-sm font-medium text-ink"
                  >
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center text-center px-6">
      <div>{children}</div>
    </main>
  );
}
