import { NextRequest, NextResponse } from "next/server";
import { createPathaoOrder, pathaoEnabled } from "@/lib/pathao";
import { adminDb, firebaseAdminEnabled } from "@/lib/firebaseAdmin";

interface RequestBody {
  orderId: string;
  total: number;
  items: { name: string; pack: string; qty: number }[];
  address: {
    fullName: string;
    phone: string;
    address: string;
    area: string;
    city: string;
    region: string;
  };
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RequestBody;

  if (!pathaoEnabled) {
    // Not configured yet — this is expected until PATHAO_* env vars are set.
    // The order still exists in Firestore; it just won't have a courier booking.
    return NextResponse.json({ ok: false, reason: "pathao_not_configured" }, { status: 200 });
  }

  try {
    const fullAddress = `${body.address.address}, ${body.address.area}, ${body.address.city}, ${body.address.region}`;
    const itemDescription = body.items.map((i) => `${i.name} (${i.pack}) ×${i.qty}`).join(", ");
    const itemQuantity = body.items.reduce((s, i) => s + i.qty, 0);

    const result = await createPathaoOrder({
      merchantOrderId: body.orderId,
      recipientName: body.address.fullName,
      recipientPhone: body.address.phone,
      recipientAddress: fullAddress,
      itemDescription,
      itemQuantity,
      amountToCollect: body.total, // set to 0 here instead if you take prepayment at checkout
    });

    if (firebaseAdminEnabled && adminDb) {
      await adminDb.collection("orders").doc(body.orderId).update({
        pathaoConsignmentId: result.consignmentId,
        pathaoStatus: result.orderStatus,
        status: "Delivering",
      });
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("Pathao booking failed:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
