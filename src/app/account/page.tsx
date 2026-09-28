"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Package, Clock, Truck, Store, CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { getCustomerOrders } from "@/src/lib/actions/orders";
import { signOut } from "@/src/lib/actions/auth";
import { formatCurrency, formatDate, cn } from "@/src/lib/utils";
import { createClient } from "@/src/lib/supabase/client";
import Link from "next/link";
import type { OnlineOrder, OrderStatus } from "@/src/lib/types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
  pending_payment: { label: "Awaiting payment", color: "#C07C00", Icon: Clock },
  paid:            { label: "Confirmed",        color: "#1B50C0", Icon: CheckCircle2 },
  dispatched:      { label: "On the way",       color: "#1B50C0", Icon: Truck },
  delivered:       { label: "Delivered",        color: "#0D9448", Icon: CheckCircle2 },
  cancelled:       { label: "Cancelled",        color: "#CC1B14", Icon: XCircle },
};

function OrderCard({ order }: { order: OnlineOrder }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending_payment;
  const { Icon } = cfg;
  const isPickup = (order as { fulfillment_type?: string }).fulfillment_type === "pickup";

  return (
    <article className="bg-white rounded-2xl shadow-card border border-[#C8D4F5] overflow-hidden">
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-[#E4ECFF]/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${cfg.color}15` }}
          >
            <Icon className="w-4 h-4" style={{ color: cfg.color }} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#080F3A] font-display-black uppercase">
                {formatCurrency(order.total_amount)}
              </span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}
              >
                {cfg.label}
              </span>
            </div>
            <p className="text-xs text-[#566299] mt-0.5 truncate">
              {formatDate(order.created_at)} ·{" "}
              {isPickup ? (
                <span className="inline-flex items-center gap-0.5"><Store className="w-3 h-3 inline" /> Pickup</span>
              ) : (
                <span className="inline-flex items-center gap-0.5"><Truck className="w-3 h-3 inline" /> Delivery</span>
              )}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn("w-4 h-4 text-[#566299] shrink-0 transition-transform", expanded && "rotate-180")}
        />
      </button>

      {expanded && (
        <div className="border-t border-[#E4ECFF] divide-y divide-[#E4ECFF]">
          {(order.items ?? []).map((item) => (
            <div key={item.id} className="flex justify-between items-center px-4 py-2.5">
              <div>
                <p className="text-sm font-bold uppercase font-display-black text-[#080F3A] leading-tight">
                  {item.product_name}
                </p>
                <p className="text-xs text-[#566299]">Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold tabular-nums text-[#080F3A]">
                {formatCurrency(item.total_price)}
              </p>
            </div>
          ))}
          {order.delivery_address && order.delivery_address !== "Pickup" && (
            <div className="px-4 py-2.5">
              <p className="text-xs font-semibold text-[#566299] uppercase tracking-widest mb-0.5">Address</p>
              <p className="text-sm text-[#080F3A]">{order.delivery_address}</p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OnlineOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.replace("/"); return; }
      setEmail(data.user.email ?? "");
    });
    getCustomerOrders().then(setOrders).finally(() => setLoading(false));
  }, [router]);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: "#E4ECFF" }}>
      {/* Nav */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 h-14 flex items-center justify-between" style={{ backgroundColor: "#060F40" }}>
        <Link href="/" className="flex items-center gap-1.5 text-white text-sm font-medium hover:opacity-80 transition-opacity">
          <ChevronLeft className="w-4 h-4" />
          Back to shop
        </Link>
        <button onClick={handleSignOut} className="text-xs font-medium hover:opacity-80 transition-opacity" style={{ color: "#8CB0E0" }}>
          Sign out
        </button>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#060F40" }}>
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display-black text-xl uppercase text-[#080F3A]">My orders</h1>
            {email && <p className="text-xs text-[#566299]">{email}</p>}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-10 h-10 mx-auto text-[#C8D4F5] mb-3" />
            <p className="text-sm text-[#566299]">No orders yet.</p>
            <Link href="/" className="mt-3 inline-block text-sm font-semibold" style={{ color: "#CC1B14" }}>
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
