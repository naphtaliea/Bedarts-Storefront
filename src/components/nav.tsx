"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, LogOut, Package } from "lucide-react";
import { useCart } from "@/src/lib/cart-store";
import { createClient } from "@/src/lib/supabase/client";
import { signOut } from "@/src/lib/actions/auth";
import { cn } from "@/src/lib/utils";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface NavProps {
  onAuthClick: () => void;
}

export function Nav({ onAuthClick }: NavProps) {
  const { count, open } = useCart();
  const cartCount = count();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-shadow duration-200",
        scrolled ? "shadow-float" : ""
      )}
      style={{ backgroundColor: "#060F40" }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2">
          <Image
            src="/logo-brand.png"
            alt="Bedarts Cold Supplies"
            width={120}
            height={36}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Cart */}
          <button
            onClick={open}
            aria-label={`Cart, ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
            className="relative h-10 w-10 flex items-center justify-center rounded-xl text-white hover:bg-white/10 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full text-[11px] font-bold flex items-center justify-center text-white"
                style={{ backgroundColor: "#CC1B14" }}>
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* Account */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((p) => !p)}
                aria-label="Account menu"
                className="h-10 w-10 flex items-center justify-center rounded-xl text-white hover:bg-white/10 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-12 z-20 w-48 rounded-xl bg-white shadow-float border border-[#C8D4F5] py-1 animate-slide-up">
                    <Link
                      href="/account"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#080F3A] hover:bg-[#E4ECFF] transition-colors"
                    >
                      <Package className="w-4 h-4 text-[#566299]" />
                      My orders
                    </Link>
                    <button
                      onClick={async () => { setMenuOpen(false); await signOut(); setUser(null); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#CC1B14] hover:bg-[#E4ECFF] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="h-9 px-4 rounded-xl text-sm font-semibold transition-colors"
              style={{ backgroundColor: "#CC1B14", color: "#fff" }}
            >
              Sign in
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
