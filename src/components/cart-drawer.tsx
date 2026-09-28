"use client";

import { useEffect } from "react";
import { X, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/src/lib/cart-store";
import { formatCurrency } from "@/src/lib/utils";
import Link from "next/link";

interface CartDrawerProps {
  isLoggedIn: boolean;
  onAuthRequired: () => void;
}

export function CartDrawer({ isLoggedIn, onAuthRequired }: CartDrawerProps) {
  const { items, isOpen, close, setQty, remove, total } = useCart();

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const orderTotal = total();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 animate-fade-in"
        onClick={close}
      />

      {/* Drawer — bottom sheet on mobile, right panel on md+ */}
      <div className="fixed z-50 inset-x-0 bottom-0 md:inset-y-0 md:inset-x-auto md:right-0 md:w-96 flex flex-col animate-sheet-up md:animate-slide-right"
        style={{ maxHeight: "90dvh" }}
      >
        <div className="flex flex-col h-full bg-white md:h-screen md:max-h-screen rounded-t-3xl md:rounded-none overflow-hidden shadow-float">
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ backgroundColor: "#060F40" }}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-5 h-5 text-white" />
              <span className="font-semibold text-white text-sm">
                Your cart
              </span>
            </div>
            <button
              onClick={close}
              aria-label="Close cart"
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <ShoppingCart className="w-10 h-10 text-[#C8D4F5]" />
                <p className="text-sm text-[#566299]">Your cart is empty</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product_id} className="flex gap-3">
                  {/* Colour swatch placeholder */}
                  <div
                    className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center text-xs font-display-black select-none overflow-hidden"
                    style={{ backgroundColor: "#E4ECFF", color: "#1B50C0" }}
                  >
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      item.product_name.slice(0, 2).toUpperCase()
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold uppercase leading-tight text-[#080F3A] font-display-black line-clamp-1">
                      {item.product_name}
                    </p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: "#CC1B14" }}>
                      {formatCurrency(item.total_price)}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5">
                      <div
                        className="flex items-center rounded-lg overflow-hidden border"
                        style={{ borderColor: "#C8D4F5" }}
                      >
                        <button
                          onClick={() => setQty(item.product_id, item.quantity - 1)}
                          aria-label="Decrease"
                          className="h-7 w-7 flex items-center justify-center hover:bg-[#E4ECFF] transition-colors"
                          style={{ color: "#080F3A" }}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-sm font-bold tabular-nums" style={{ color: "#080F3A" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => setQty(item.product_id, item.quantity + 1)}
                          aria-label="Increase"
                          className="h-7 w-7 flex items-center justify-center hover:bg-[#E4ECFF] transition-colors"
                          style={{ color: "#CC1B14" }}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => remove(item.product_id)}
                        aria-label="Remove item"
                        className="p-1 rounded-lg hover:bg-[#E4ECFF] transition-colors"
                        style={{ color: "#566299" }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-5 py-4 border-t border-[#C8D4F5] space-y-3 shrink-0">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-[#566299]">Total</span>
                <span className="text-xl font-bold tabular-nums" style={{ color: "#080F3A" }}>
                  {formatCurrency(orderTotal)}
                </span>
              </div>

              {isLoggedIn ? (
                <Link
                  href="/checkout"
                  onClick={close}
                  className="block w-full h-12 rounded-xl text-center text-sm font-semibold text-white leading-[3rem] transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#CC1B14" }}
                >
                  Checkout
                </Link>
              ) : (
                <button
                  onClick={() => { close(); onAuthRequired(); }}
                  className="w-full h-12 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#CC1B14" }}
                >
                  Sign in to checkout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
