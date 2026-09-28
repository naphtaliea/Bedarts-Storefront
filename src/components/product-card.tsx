"use client";

import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { useCart } from "@/src/lib/cart-store";
import { formatCurrency, cn } from "@/src/lib/utils";
import type { StorefrontProduct } from "@/src/lib/types";

interface ProductCardProps {
  product: StorefrontProduct;
  onAuthRequired: () => void;
  isLoggedIn: boolean;
}

function StockBadge({ qty }: { qty: number }) {
  if (qty <= 0)
    return (
      <span className="text-[11px] font-semibold" style={{ color: "#566299" }}>
        Out of stock
      </span>
    );
  if (qty <= 5)
    return (
      <span className="text-[11px] font-semibold" style={{ color: "#C07C00" }}>
        Only {qty} left
      </span>
    );
  return (
    <span className="text-[11px] font-semibold" style={{ color: "#0D9448" }}>
      In stock
    </span>
  );
}

export function ProductCard({ product, onAuthRequired, isLoggedIn }: ProductCardProps) {
  const { items, add, setQty } = useCart();
  const cartItem = items.find((i) => i.product_id === product.id);
  const qty = cartItem?.quantity ?? 0;
  const outOfStock = product.stock_quantity <= 0;

  const unitLabel =
    product.unit === "kg" ? "/kg" : product.unit === "pcs" ? " each" : "";

  function handleAdd() {
    if (!isLoggedIn) { onAuthRequired(); return; }
    add({
      product_id:   product.id,
      product_name: product.name,
      unit:         product.unit,
      unit_price:   product.selling_price,
      image_url:    product.image_url,
    });
  }

  return (
    <article className="bg-white rounded-2xl shadow-card flex flex-col overflow-hidden border border-[#C8D4F5] hover:shadow-raised transition-shadow duration-200">
      {/* Image */}
      <div className="relative aspect-square bg-white overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2"
            quality={90}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl font-display-black select-none"
            style={{ color: "#1B50C0", opacity: 0.25 }}
          >
            {product.name.slice(0, 2).toUpperCase()}
          </div>
        )}

        {/* Category pill */}
        <span
          className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "#E4ECFF", color: "#566299" }}
        >
          {product.category_name}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <h3
          className="font-display-black uppercase leading-tight text-[15px] sm:text-base line-clamp-2"
          style={{ color: "#080F3A" }}
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-0.5">
          <span className="text-base font-bold" style={{ color: "#CC1B14" }}>
            {formatCurrency(product.selling_price)}
            <span className="text-[11px] font-medium ml-0.5" style={{ color: "#566299" }}>
              {unitLabel}
            </span>
          </span>
          <StockBadge qty={product.stock_quantity} />
        </div>

        {/* Add / stepper */}
        <div className="mt-2">
          {qty === 0 ? (
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className={cn(
                "w-full h-9 rounded-xl flex items-center justify-center gap-1.5 text-sm font-semibold text-white transition-opacity",
                outOfStock ? "opacity-40 cursor-not-allowed" : "hover:opacity-90"
              )}
              style={{ backgroundColor: "#CC1B14" }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          ) : (
            <div
              className="w-full h-9 rounded-xl flex items-center justify-between px-1"
              style={{ backgroundColor: "#E4ECFF" }}
            >
              <button
                onClick={() => setQty(product.id, qty - 1)}
                aria-label="Decrease quantity"
                className="h-7 w-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white"
                style={{ color: "#080F3A" }}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold tabular-nums" style={{ color: "#080F3A" }}>
                {qty}
              </span>
              <button
                onClick={() => setQty(product.id, qty + 1)}
                disabled={qty >= product.stock_quantity}
                aria-label="Increase quantity"
                className="h-7 w-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white disabled:opacity-40"
                style={{ color: "#CC1B14" }}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
