import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAdmin, getBearerToken } from "@/lib/adminAuth";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Lists every user's support thread, grouped by uid, newest message first per thread.
 * Uses a collection-group query across all `users/{uid}/messages` subcollections.
 */
export async function GET(req: Request) {
  const admin = await verifyAdmin(getBearerToken(req));
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  if (!adminDb) return NextResponse.json({ error: "Firebase Admin is not configured" }, { status: 500 });

  const snap = await adminDb.collectionGroup("messages").orderBy("createdAt", "asc").get();

  const threads: Record<string, Array<{ id: string; [key: string]: unknown }>> = {};
  for (const d of snap.docs) {
    const data = d.data();
    const uid = (data.uid as string) ?? d.ref.parent.parent?.id ?? "unknown";
    if (!threads[uid]) threads[uid] = [];
    threads[uid].push({ id: d.id, ...data });
  }

  // Attach basic profile info (name/email) per uid so the admin panel can label threads.
  const uids = Object.keys(threads);
  const profiles: Record<string, { name?: string; email?: string }> = {};
  await Promise.all(
    uids.map(async (uid) => {
      const userDoc = await adminDb!.collection("users").doc(uid).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        profiles[uid] = { name: data?.name, email: data?.email };
      }
    })
  );

  const result = uids.map((uid) => ({
    uid,
    name: profiles[uid]?.name ?? "Unknown",
    email: profiles[uid]?.email ?? "",
    messages: threads[uid],
    lastMessageAt: threads[uid][threads[uid].length - 1]?.createdAt ?? null,
  }));

  return NextResponse.json({ threads: result });
}

/** Sends a support reply into a specific user's inbox thread. */
export async function POST(req: Request) {
  const admin = await verifyAdmin(getBearerToken(req));
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  if (!adminDb) return NextResponse.json({ error: "Firebase Admin is not configured" }, { status: 500 });

  const { uid, text } = (await req.json()) as { uid?: string; text?: string };
  if (!uid || !text?.trim()) {
    return NextResponse.json({ error: "uid and text are required" }, { status: 400 });
  }

  await adminDb.collection("users").doc(uid).collection("messages").add({
    uid,
    sender: "support",
    text: text.trim(),
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true });
}
