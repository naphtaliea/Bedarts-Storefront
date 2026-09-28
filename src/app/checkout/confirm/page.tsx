"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import { getOrderByRef } from "@/src/lib/actions/orders";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import Link from "next/link";
import type { OnlineOrder } from "@/src/lib/types";

function ConfirmContent() {
  const params = useSearchParams();
  const ref = params.get("reference") ?? params.get("trxref") ?? "";
  const [order, setOrder] = useState<OnlineOrder | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!ref) return;

    let cancelled = false;
    const MAX = 15; // 15 × 2s = 30s max

    async function poll() {
      const o = await getOrderByRef(ref);
      if (cancelled) return;
      setOrder(o);
      setAttempts((a) => a + 1);

      if (o && o.status === "pending_payment" && attempts < MAX) {
        setTimeout(poll, 2000);
      }
    }

    poll();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  if (!ref) {
    return (
      <div className="text-center py-20">
        <p className="text-[#566299] text-sm">No order reference found.</p>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold text-[#CC1B14]">Back to shop</Link>
      </div>
    );
  }

  const isPending = !order || order.status === "pending_payment";
  const isPaid = order?.status === "paid" || order?.status === "dispatched" || order?.status === "delivered";
  const isCancelled = order?.status === "cancelled";

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center animate-slide-up">
      {isPending && (
        <>
          <div className="w-16 h-16 rounded-full bg-[#E4ECFF] flex items-center justify-center mx-auto mb-5">
            <Loader2 className="w-8 h-8 animate-spin text-[#1B50C0]" />
          </div>
          <h1 className="font-display-black text-2xl uppercase text-[#080F3A]">Confirming payment…</h1>
          <p className="text-sm text-[#566299] mt-2">This usually takes a few seconds.</p>
          {attempts >= 10 && (
            <p className="text-xs text-[#566299] mt-4 bg-white rounded-xl px-4 py-3 border border-[#C8D4F5]">
              Taking longer than expected. If you completed payment, your order will be confirmed shortly and you&apos;ll see it in{" "}
              <Link href="/account" className="text-[#CC1B14] font-semibold">My orders</Link>.
            </p>
          )}
        </>
      )}

      {isPaid && order && (
        <>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "rgba(13,148,72,0.1)" }}>
            <CheckCircle2 className="w-8 h-8 text-[#0D9448]" />
          </div>
          <h1 className="font-display-black text-2xl uppercase text-[#080F3A]">Order confirmed!</h1>
          <p className="text-sm text-[#566299] mt-2">
            {order.fulfillment_type === "pickup"
              ? "We'll call you when your order is ready for pickup."
              : "We'll call you to confirm delivery time and details."}
          </p>

          <div className="mt-6 bg-white rounded-2xl border border-[#C8D4F5] shadow-card text-left overflow-hidden">
            <div className="px-4 py-3 border-b border-[#C8D4F5]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#566299]">Order details</p>
            </div>
            <div className="divide-y divide-[#E4ECFF]">
              {(order.items ?? []).map((item) => (
                <div key={item.id} className="flex justify-between px-4 py-2.5">
                  <p className="text-sm font-bold uppercase font-display-black text-[#080F3A]">{item.product_name}</p>
                  <p className="text-sm tabular-nums text-[#080F3A]">{formatCurrency(item.total_price)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between px-4 py-3 border-t border-[#C8D4F5]">
              <span className="text-sm text-[#566299]">Total paid</span>
              <span className="font-bold tabular-nums text-[#080F3A]">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>

          <p className="text-xs text-[#566299] mt-4">{formatDate(order.created_at)}</p>
        </>
      )}

      {isCancelled && (
        <>
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-8 h-8 text-[#CC1B14]" />
          </div>
          <h1 className="font-display-black text-2xl uppercase text-[#080F3A]">Order cancelled</h1>
          <p className="text-sm text-[#566299] mt-2">Your payment was not completed.</p>
        </>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link
          href="/account"
          className="flex-1 h-11 rounded-xl border border-[#C8D4F5] bg-white text-sm font-semibold text-[#080F3A] flex items-center justify-center gap-2 hover:bg-[#E4ECFF] transition-colors"
        >
          <Clock className="w-4 h-4 text-[#566299]" />
          My orders
        </Link>
        <Link
          href="/"
          className="flex-1 h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#CC1B14" }}
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <div className="min-h-dvh" style={{ backgroundColor: "#E4ECFF" }}>
      <header className="px-4 py-4" style={{ backgroundColor: "#060F40" }}>
        <Link href="/" className="inline-block">
          <span className="font-display-black text-base uppercase text-white tracking-wide">
            Bedarts Cold Supplies
          </span>
        </Link>
      </header>
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#566299]" />
        </div>
      }>
        <ConfirmContent />
      </Suspense>
    </div>
  );
}
