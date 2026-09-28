"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn, signUp } from "@/src/lib/actions/auth";
import { cn } from "@/src/lib/utils";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTab?: "signin" | "signup";
}

export function AuthModal({ open, onClose, onSuccess, defaultTab = "signin" }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (open) { setError(""); setTab(defaultTab); }
  }, [open, defaultTab]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "signin") {
        const res = await signIn(email, password);
        if (!res.ok) { setError(res.error); return; }
      } else {
        const res = await signUp({ email, password, fullName, phone });
        if (!res.ok) { setError(res.error); return; }
      }
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full h-11 px-3.5 rounded-xl border bg-white text-sm text-[#080F3A] placeholder-[#566299] outline-none transition-shadow focus:ring-2 focus:ring-[#1B50C0]/30 focus:border-[#1B50C0]";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 animate-fade-in flex items-end sm:items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-float animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#566299]">
                Bedarts Cold Supplies
              </p>
              <h2 className="font-display-black text-xl uppercase text-[#080F3A] mt-0.5">
                {tab === "signin" ? "Welcome back" : "Create account"}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-[#E4ECFF] transition-colors text-[#566299]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-5 gap-1 mb-4">
            {(["signin", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={cn(
                  "flex-1 h-8 rounded-lg text-xs font-semibold transition-colors",
                  tab === t ? "text-white" : "text-[#566299] hover:bg-[#E4ECFF]"
                )}
                style={tab === t ? { backgroundColor: "#060F40" } : {}}
              >
                {t === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-5 pb-6 space-y-3">
            {tab === "signup" && (
              <input
                required
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
                style={{ borderColor: "#C8D4F5" }}
              />
            )}
            <input
              required
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              style={{ borderColor: "#C8D4F5" }}
            />
            {tab === "signup" && (
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                style={{ borderColor: "#C8D4F5" }}
              />
            )}
            <div className="relative">
              <input
                required
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(inputClass, "pr-11")}
                style={{ borderColor: "#C8D4F5" }}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                tabIndex={-1}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#566299] hover:text-[#080F3A]"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs font-medium rounded-lg px-3 py-2 bg-red-50 text-[#CC1B14]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "#CC1B14" }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {tab === "signin" ? "Sign in" : "Create account"}
            </button>

            {tab === "signup" && (
              <p className="text-[11px] text-center text-[#566299] leading-relaxed">
                By creating an account you agree to our terms of service.
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
