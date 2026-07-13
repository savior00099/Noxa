import Image from "next/image";

const NAV = [
  { heading: "Shop",    links: ["Sepia Umber", "Fern Olive", "Bone Cream", "Compare Specs"] },
  { heading: "Company", links: ["About NOXA", "Craft & Materials", "Press", "Careers"] },
  { heading: "Support", links: ["FAQ", "Warranty", "Shipping & Returns", "Wholesale"] },
];

const SOCIALS = ["Instagram", "TikTok", "YouTube", "X"];

const SUPPORT_EMAIL = "smartproductb@gmail.com";
const SUPPORT_WHATSAPP = "8801887321156";

export default function Footer() {
  return (
    <footer id="footer" className="relative overflow-hidden bg-[#1A1409] px-5 pt-12 pb-6 sm:px-10 sm:pt-16 lg:px-16">
      {/* top glow line */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2"
        style={{ background: "linear-gradient(90deg, transparent, #B37C1D55, transparent)" }}
      />
      {/* dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* top row: brand + social */}
        <div className="mb-8 flex items-center justify-between sm:mb-12">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/15">
              <Image src="/logo/noxa-icon.png" alt="NOXA" fill sizes="36px" className="object-cover scale-125" />
            </span>
            <span className="font-display text-2xl tracking-wide text-white">NOXA</span>
          </div>
          <div className="flex gap-2">
            {SOCIALS.map((s) => (
              <button
                key={s}
                aria-label={s}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/60 transition-colors hover:border-[#B37C1D]/50 hover:bg-[#B37C1D]/15 hover:text-[#B37C1D]"
              >
                <span className="text-[10px] font-bold">{s[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* tagline — mobile only */}
        <p className="mb-8 text-sm leading-relaxed text-white/45 sm:hidden">
          Camera-styled TWS earbuds. Three colorways. Digital display, secure fit, zero compromise.
        </p>

        {/* customer service */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:mb-12 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B37C1D]/70">Customer Service</span>
            <p className="mt-1 text-sm text-white/50">Order, warranty, or delivery questions — we usually reply within a day.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/80 transition-colors hover:border-[#B37C1D]/50 hover:text-white"
            >
              ✉ {SUPPORT_EMAIL}
            </a>
            <a
              href={`https://wa.me/${SUPPORT_WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 px-4 py-2.5 text-xs font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/25"
            >
              WhatsApp · +{SUPPORT_WHATSAPP}
            </a>
          </div>
        </div>

        {/* nav columns */}
        <div className="mb-8 grid grid-cols-3 gap-4 sm:mb-12 sm:grid-cols-[1.2fr_repeat(3,1fr)]">
          <p className="hidden text-sm leading-relaxed text-white/45 sm:block">
            Camera-styled TWS earbuds built with the details of a good camera — steady grip, honest readouts, and a finish that ages well.
          </p>

          {NAV.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B37C1D]/70 sm:text-xs">
                {col.heading}
              </span>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-xs leading-snug text-white/45 transition-colors hover:text-white sm:text-sm">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom legal row */}
        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} NOXA Audio Co. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {["Privacy Policy", "Terms of Use", "Cookie Settings"].map((l) => (
              <a key={l} href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">
                {l}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
