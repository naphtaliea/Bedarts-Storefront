export function Hero() {
  return (
    <section
      className="relative w-full px-4 sm:px-6 pt-16 pb-14 sm:pt-20 sm:pb-16 overflow-hidden"
      style={{ backgroundColor: "#060F40" }}
    >
      {/* Subtle cold radial glow — deep blue, not distracting */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 50%, rgba(27,80,192,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-5"
          style={{ color: "#8CB0E0" }}
        >
          Bedarts Cold Supplies
        </p>

        {/* Headline — Big Shoulders Display, massive */}
        <h1
          className="font-display-black leading-[0.92] uppercase"
          style={{ color: "#FFFFFF", fontSize: "clamp(3rem, 10vw, 7rem)" }}
        >
          Always fresh.
          <br />
          <span className="relative inline-block">
            Always in
            <br />
            <span style={{ color: "#CC1B14" }}>season.</span>
          </span>
        </h1>

        <p
          className="mt-6 text-base sm:text-lg max-w-md leading-relaxed"
          style={{ color: "#8CB0E0", fontFamily: "var(--font-archivo)" }}
        >
          Order online. We deliver to your door or hold it for pickup — your
          choice.
        </p>

        <a
          href="#products"
          className="mt-8 inline-flex items-center gap-2 h-12 px-7 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#CC1B14" }}
        >
          Shop now
        </a>
      </div>

      {/* Bottom fade to ice background */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-12"
        style={{
          background: "linear-gradient(to bottom, transparent, #E4ECFF)",
        }}
      />
    </section>
  );
}
