// Server-only helper for the Pathao Merchant Courier API.
// Docs: https://pathao.com (Merchant Dashboard → API Credentials)
// Sandbox base: https://courier-api-sandbox.pathao.com
// Production base: https://api-hermes.pathao.com
//
// Required env vars (see .env.local.example):
//   PATHAO_BASE_URL, PATHAO_CLIENT_ID, PATHAO_CLIENT_SECRET,
//   PATHAO_USERNAME, PATHAO_PASSWORD, PATHAO_STORE_ID,
//   PATHAO_SENDER_NAME, PATHAO_SENDER_PHONE

export const pathaoEnabled = Boolean(
  process.env.PATHAO_CLIENT_ID &&
  process.env.PATHAO_CLIENT_SECRET &&
  process.env.PATHAO_USERNAME &&
  process.env.PATHAO_PASSWORD &&
  process.env.PATHAO_STORE_ID
);

const BASE_URL = process.env.PATHAO_BASE_URL || "https://courier-api-sandbox.pathao.com";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function issueToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token;

  const res = await fetch(`${BASE_URL}/aladdin/api/v1/issue-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.PATHAO_CLIENT_ID,
      client_secret: process.env.PATHAO_CLIENT_SECRET,
      username: process.env.PATHAO_USERNAME,
      password: process.env.PATHAO_PASSWORD,
      grant_type: "password",
    }),
  });

  if (!res.ok) throw new Error(`Pathao issue-token failed: ${res.status} ${await res.text()}`);
  const data = await res.json();

  cachedToken = {
    token: data.access_token,
    // refresh a little early
    expiresAt: Date.now() + (Number(data.expires_in ?? 3600) - 60) * 1000,
  };
  return cachedToken.token;
}

export interface PathaoOrderInput {
  merchantOrderId: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  itemDescription: string;
  itemQuantity: number;
  amountToCollect: number; // 0 for prepaid orders
  specialInstruction?: string;
}

export interface PathaoOrderResult {
  consignmentId: string;
  orderStatus: string;
  deliveryFee?: number;
}

/** Books a delivery with Pathao. Throws if PATHAO_* env vars aren't configured. */
export async function createPathaoOrder(input: PathaoOrderInput): Promise<PathaoOrderResult> {
  if (!pathaoEnabled) {
    throw new Error("Pathao is not configured — set PATHAO_* env vars (see .env.local.example)");
  }

  const token = await issueToken();

  const res = await fetch(`${BASE_URL}/aladdin/api/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      store_id: Number(process.env.PATHAO_STORE_ID),
      merchant_order_id: input.merchantOrderId,
      sender_name: process.env.PATHAO_SENDER_NAME || "NOXA Audio Co.",
      sender_phone: process.env.PATHAO_SENDER_PHONE || "",
      recipient_name: input.recipientName,
      recipient_phone: input.recipientPhone,
      recipient_address: input.recipientAddress,
      // recipient_city / recipient_zone / recipient_area are intentionally omitted —
      // Pathao's auto-address feature resolves these from recipient_address automatically.
      delivery_type: 48, // 48 = Normal delivery, 12 = On-demand
      item_type: 2,      // 1 = Document, 2 = Parcel
      special_instruction: input.specialInstruction ?? "",
      item_quantity: input.itemQuantity,
      item_weight: 0.5,
      amount_to_collect: input.amountToCollect,
      item_description: input.itemDescription,
    }),
  });

  if (!res.ok) throw new Error(`Pathao create-order failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const order = data.data ?? data;

  return {
    consignmentId: order.consignment_id,
    orderStatus: order.order_status,
    deliveryFee: order.delivery_fee,
  };
}
