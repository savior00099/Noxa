import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAdmin, getBearerToken } from "@/lib/adminAuth";
import { ORDER_STEPS, type OrderStatus } from "@/lib/firestore";

export async function GET(req: Request) {
  const admin = await verifyAdmin(getBearerToken(req));
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  if (!adminDb) return NextResponse.json({ error: "Firebase Admin is not configured" }, { status: 500 });

  const snap = await adminDb.collection("orders").orderBy("createdAt", "desc").get();
  const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ orders });
}

export async function PATCH(req: Request) {
  const admin = await verifyAdmin(getBearerToken(req));
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  if (!adminDb) return NextResponse.json({ error: "Firebase Admin is not configured" }, { status: 500 });

  const { orderId, status } = (await req.json()) as { orderId?: string; status?: OrderStatus };
  if (!orderId || !status || !ORDER_STEPS.includes(status)) {
    return NextResponse.json({ error: "orderId and a valid status are required" }, { status: 400 });
  }

  await adminDb.collection("orders").doc(orderId).update({ status });
  return NextResponse.json({ ok: true });
}
