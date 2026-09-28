"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/src/components/nav";
import { Hero } from "@/src/components/hero";
import { ShopClient } from "@/src/components/shop-client";
import { CartDrawer } from "@/src/components/cart-drawer";
import { AuthModal } from "@/src/components/auth-modal";
import { useCart } from "@/src/lib/cart-store";
import { getStorefrontProducts } from "@/src/lib/actions/products";
import { createClient } from "@/src/lib/supabase/client";
import type { StorefrontProduct } from "@/src/lib/types";

export default function HomePage() {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isOpen: cartOpen } = useCart();

  useEffect(() => {
    getStorefrontProducts().then(setProducts).catch(console.error);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) =>
      setIsLoggedIn(!!s?.user)
    );
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: "#E4ECFF" }}>
      <Nav onAuthClick={() => setAuthOpen(true)} />

      <Hero />

      <ShopClient
        products={products}
        onAuthRequired={() => setAuthOpen(true)}
        isLoggedIn={isLoggedIn}
      />

      <footer className="px-6 py-10 text-center" style={{ backgroundColor: "#060F40" }}>
        <p className="font-display-black text-lg uppercase text-white tracking-wide">
          Bedarts Cold Supplies
        </p>
        <p className="text-sm mt-1" style={{ color: "#8CB0E0" }}>
          Always fresh. Always in season.
        </p>
      </footer>

      {/* Overlays */}
      <CartDrawer isLoggedIn={isLoggedIn} onAuthRequired={() => setAuthOpen(true)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
