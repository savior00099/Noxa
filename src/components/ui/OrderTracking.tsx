"use client";

import { ORDER_STEPS, type OrderRecord } from "@/lib/firestore";

const STEP_COPY: Record<string, string> = {
  "Order Placed": "Your order was placed successfully with NOXA.",
  "Processing": "We've received your order — our team is checking and confirming it.",
  "Confirmed": "Your order is confirmed and queued for packing.",
  "Packing": "We're currently packing your order.",
  "Packed": "Your order is packed and ready for pickup.",
  "Delivering": "Pathao has picked up your order for delivery.",
  "Payment": "Your payment has been recorded.",
  "Delivered": "You've received your order. Enjoy the Lens Q86!",
};

export default function OrderTracking({ order }: { order: OrderRecord }) {
  const currentIdx = ORDER_STEPS.indexOf(order.status);

  return (
    <div className="flex flex-col gap-0">
      {ORDER_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        const isLast = i === ORDER_STEPS.length - 1;
        return (
          <div key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px]"
                style={{
                  background: done ? "#B37C1D" : "rgba(255,255,255,0.08)",
                  color: done ? "#1A1409" : "rgba(255,255,255,0.3)",
                }}
              >
                {done ? "✓" : ""}
              </span>
              {!isLast && (
                <span
                  className="w-px flex-1"
                  style={{ background: done && i < currentIdx ? "#B37C1D" : "rgba(255,255,255,0.1)", minHeight: 28 }}
                />
              )}
            </div>
            <div className="pb-6">
              <p className="text-sm font-semibold" style={{ color: done ? "#fff" : "rgba(255,255,255,0.35)" }}>{step}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-white/35">{STEP_COPY[step]}</p>
              {step === "Delivering" && order.pathaoConsignmentId && (
                <p className="mt-1 text-[11px] text-[#B37C1D]">Pathao consignment: {order.pathaoConsignmentId}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
