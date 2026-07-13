import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAdmin, getBearerToken } from "@/lib/adminAuth";

export async function GET(req: Request) {
  const admin = await verifyAdmin(getBearerToken(req));
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  if (!adminDb) return NextResponse.json({ error: "Firebase Admin is not configured" }, { status: 500 });

  const snap = await adminDb.collection("reviews").orderBy("createdAt", "desc").get();
  const reviews = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ reviews });
}

export async function PATCH(req: Request) {
  const admin = await verifyAdmin(getBearerToken(req));
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  if (!adminDb) return NextResponse.json({ error: "Firebase Admin is not configured" }, { status: 500 });

  const { reviewId, published } = (await req.json()) as { reviewId?: string; published?: boolean };
  if (!reviewId || typeof published !== "boolean") {
    return NextResponse.json({ error: "reviewId and published (boolean) are required" }, { status: 400 });
  }

  await adminDb.collection("reviews").doc(reviewId).update({ published });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const admin = await verifyAdmin(getBearerToken(req));
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  if (!adminDb) return NextResponse.json({ error: "Firebase Admin is not configured" }, { status: 500 });

  const { reviewId } = (await req.json()) as { reviewId?: string };
  if (!reviewId) return NextResponse.json({ error: "reviewId is required" }, { status: 400 });

  await adminDb.collection("reviews").doc(reviewId).delete();
  return NextResponse.json({ ok: true });
}
