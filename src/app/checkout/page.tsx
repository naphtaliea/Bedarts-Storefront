"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronLeft, Truck, Store } from "lucide-react";
import { useCart } from "@/src/lib/cart-store";
import { initializeOrder } from "@/src/lib/actions/orders";
import { formatCurrency, cn } from "@/src/lib/utils";
import { createClient } from "@/src/lib/supabase/client";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

type Fulfillment = "delivery" | "pickup";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.replace("/"); return; }
      setUser(data.user);
    });
  }, [router]);

  useEffect(() => {
    if (items.length === 0) router.replace("/");
  }, [items.length, router]);

  const orderTotal = total();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError("");
    setLoading(true);

    try {
      const res = await initializeOrder(
        items.map((i) => ({
          product_id:   i.product_id,
          product_name: i.product_name,
          unit:         i.unit,
          quantity:     i.quantity,
          unit_price:   i.unit_price,
          total_price:  i.total_price,
          image_url:    i.image_url,
        })),
        {
          name,
          phone,
          address: fulfillment === "delivery" ? address : "Pickup",
          notes: fulfillment === "pickup" ? "PICKUP ORDER" : notes || undefined,
          fulfillmentType: fulfillment,
        },
        orderTotal
      );

      if (!res.ok) { setError(res.error); return; }

      clear();
      window.location.href = res.data.authorizationUrl;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full h-11 px-3.5 rounded-xl border border-[#C8D4F5] bg-white text-sm text-[#080F3A] placeholder-[#566299] outline-none transition-shadow focus:ring-2 focus:ring-[#1B50C0]/30 focus:border-[#1B50C0]";

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: "#E4ECFF" }}>
      {/* Nav strip */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 h-14 flex items-center" style={{ backgroundColor: "#060F40" }}>
        <Link href="/" className="flex items-center gap-1.5 text-white text-sm font-medium hover:opacity-80 transition-opacity">
          <ChevronLeft className="w-4 h-4" />
          Back to shop
        </Link>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 grid md:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left — form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="font-display-black text-2xl uppercase text-[#080F3A]">Checkout</h1>

          {/* Fulfillment toggle */}
          <div>
            <p className="text-xs font-semibold text-[#566299] uppercase tracking-widest mb-2">
              How do you want it?
            </p>
            <div className="flex rounded-xl border border-[#C8D4F5] overflow-hidden bg-white p-1 gap-1">
              {([
                { value: "delivery" as const, label: "Delivery", Icon: Truck },
                { value: "pickup"   as const, label: "Pickup",   Icon: Store },
              ] as const).map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFulfillment(value)}
                  className={cn(
                    "flex-1 h-10 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-colors",
                    fulfillment === value ? "text-white" : "text-[#566299] hover:bg-[#E4ECFF]"
                  )}
                  style={fulfillment === value ? { backgroundColor: "#060F40" } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact details */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#566299] uppercase tracking-widest">
              Your details
            </p>
            <input required type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            <input required type="tel"  placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </div>

          {/* Delivery fields */}
          {fulfillment === "delivery" && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#566299] uppercase tracking-widest">
                Delivery address
              </p>
              <input required type="text" placeholder="Street / area" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
              <textarea
                rows={2}
                placeholder="Delivery notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={cn(inputClass, "h-auto py-3 resize-none")}
              />
              <p className="text-xs text-[#566299]">
                We&apos;ll call you to confirm delivery time and fee.
              </p>
            </div>
          )}

          {fulfillment === "pickup" && (
            <div className="rounded-xl border border-[#C8D4F5] bg-white px-4 py-3 text-sm text-[#566299]">
              We&apos;ll call you to confirm when your order is ready for pickup.
            </div>
          )}

          {error && (
            <p className="text-xs font-medium rounded-xl px-3 py-2.5 bg-red-50 border border-red-100 text-[#CC1B14]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#CC1B14" }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Pay {formatCurrency(orderTotal)}
          </button>
        </form>

        {/* Right — order summary */}
        <aside className="bg-white rounded-2xl shadow-card border border-[#C8D4F5] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#C8D4F5]">
            <p className="text-xs font-semibold text-[#566299] uppercase tracking-widest">
              Order summary
            </p>
          </div>
          <div className="divide-y divide-[#E4ECFF]">
            {items.map((item) => (
              <div key={item.product_id} className="flex justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold uppercase text-[#080F3A] font-display-black leading-snug line-clamp-1">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-[#566299]">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-[#080F3A] shrink-0">
                  {formatCurrency(item.total_price)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-4 py-3 border-t border-[#C8D4F5]">
            <span className="text-sm text-[#566299]">Total</span>
            <span className="text-base font-bold tabular-nums" style={{ color: "#080F3A" }}>
              {formatCurrency(orderTotal)}
            </span>
          </div>
        </aside>
      </main>
    </div>
  );
}
