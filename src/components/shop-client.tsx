"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "./product-card";
import { cn } from "@/src/lib/utils";
import type { StorefrontProduct } from "@/src/lib/types";

interface ShopClientProps {
  products: StorefrontProduct[];
  onAuthRequired: () => void;
  isLoggedIn: boolean;
}

export function ShopClient({ products, onAuthRequired, isLoggedIn }: ShopClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const cats: string[] = ["All"];
    for (const p of products) {
      if (!seen.has(p.category_name)) {
        seen.add(p.category_name);
        cats.push(p.category_name);
      }
    }
    return cats;
  }, [products]);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? products
        : products.filter((p) => p.category_name === activeCategory),
    [products, activeCategory]
  );

  return (
    <section id="products" className="flex-1 flex flex-col">
      {/* Category strip */}
      <div
        className="sticky top-16 z-40 px-4 sm:px-6 py-3 border-b border-[#C8D4F5]"
        style={{ backgroundColor: "#E4ECFF" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "shrink-0 h-8 px-4 rounded-full text-sm font-semibold border transition-colors",
                  activeCategory === cat
                    ? "text-white border-transparent"
                    : "bg-white text-[#080F3A] border-[#C8D4F5] hover:border-[#1B50C0] hover:text-[#1B50C0]"
                )}
                style={activeCategory === cat ? { backgroundColor: "#CC1B14", borderColor: "#CC1B14" } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="flex-1 px-4 sm:px-6 py-6" style={{ backgroundColor: "#E4ECFF" }}>
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#566299] text-sm">No products in this category right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAuthRequired={onAuthRequired}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
