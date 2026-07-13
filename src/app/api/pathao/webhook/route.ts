import { NextRequest, NextResponse } from "next/server";
import { adminDb, firebaseAdminEnabled } from "@/lib/firebaseAdmin";

// Configure this URL in the Pathao Merchant Dashboard under Webhooks, and set
// PATHAO_WEBHOOK_SECRET to the secret shown there. Pathao will POST delivery status
// changes here (picked up, in transit, delivered, returned, etc).
//
// Pathao requires your endpoint to respond within 10s with a 2xx status and an
// `X-Pathao-Merchant-Webhook-Integration-Secret` header equal to your configured secret.

const STATUS_MAP: Record<string, string> = {
  pickup_requested: "Packed",
  picked: "Delivering",
  in_transit: "Delivering",
  delivered: "Delivered",
};

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-pathao-signature");
  const expected = process.env.PATHAO_WEBHOOK_SECRET;

  if (expected && signature !== expected) {
    return NextResponse.json({ ok: false, reason: "invalid_signature" }, { status: 401 });
  }

  const body = await req.json();
  const merchantOrderId: string | undefined = body.merchant_order_id;
  const pathaoStatus: string | undefined = body.order_status;

  if (merchantOrderId && firebaseAdminEnabled && adminDb) {
    const mappedStatus = pathaoStatus ? STATUS_MAP[pathaoStatus] : undefined;
    await adminDb.collection("orders").doc(merchantOrderId).update({
      pathaoStatus: pathaoStatus ?? null,
      ...(mappedStatus ? { status: mappedStatus } : {}),
    });
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "X-Pathao-Merchant-Webhook-Integration-Secret": expected ?? "" } }
  );
}
