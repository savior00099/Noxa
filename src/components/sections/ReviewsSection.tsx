"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { COLORWAYS } from "@/lib/colorways";
import { saveReview } from "@/lib/firestore";

const REVIEWS = [
  { name: "Priya S.",  location: "Austin, US",     colorway: "Sepia Umber", accent: "#B37C1D", stars: 5, text: "The clip fit is the whole story here — I forget I'm wearing them on 5k runs. The battery readout on the case is genuinely useful, not a gimmick.", initials: "PS" },
  { name: "Marcus T.", location: "Manchester, UK", colorway: "Fern Olive",  accent: "#E0E3DE", stars: 4, text: "Sound is full and warm, calls come through clean. Wish the case charged a hair faster, but 1–3 hours isn't bad at all.", initials: "MT" },
  { name: "Elena R.",  location: "Lisbon, PT",     colorway: "Sepia Umber", accent: "#B37C1D", stars: 5, text: "Bought the Fern Olive for my partner and Sepia Umber for myself. The leather texture actually looks and feels premium, not cheap plastic.", initials: "ER" },
  { name: "Daniel K.", location: "Toronto, CA",    colorway: "Bone Cream",  accent: "#E0E3DE", stars: 5, text: "Pairing was instant the second I opened the lid. The display counting down from 100 is such a small thing but I check it constantly.", initials: "DK" },
  { name: "Naomi B.",  location: "Cape Town, ZA",  colorway: "Fern Olive",  accent: "#E0E3DE", stars: 4, text: "Comfortable for hour-long calls, no ear ache like my old buds. Bass is present without drowning out vocals on podcasts.", initials: "NB" },
  { name: "Tomás V.",  location: "Buenos Aires, AR", colorway: "Sepia Umber", accent: "#B37C1D", stars: 5, text: "Caught in the rain twice now with these in and zero issues. The IPX-5 rating holds up, and the case looks better with a little wear.", initials: "TV" },
  { name: "Chloe W.",  location: "Sydney, AU",     colorway: "Bone Cream",  accent: "#E0E3DE", stars: 5, text: "The Bone Cream colorway is stunning in person, way nicer than the photos. Feels like a little vintage camera in your pocket.", initials: "CW" },
  { name: "Farid A.",  location: "Dubai, UAE",     colorway: "Fern Olive",  accent: "#E0E3DE", stars: 4, text: "Great daily driver. Touch controls took a day to get used to but now they're second nature. Wireless delay is unnoticeable on video.", initials: "FA" },
  { name: "Grace L.",  location: "Singapore",      colorway: "Bone Cream",  accent: "#E0E3DE", stars: 5, text: "Gifted these to my sister for her commute and she won't stop talking about the digital display. Sound punches above the price.", initials: "GL" },
  { name: "Owen P.",   location: "Dublin, IE",     colorway: "Sepia Umber", accent: "#B37C1D", stars: 4, text: "Solid all-rounder for gym sessions. Doesn't budge during burpees, which is more than I can say for my last three pairs of earbuds.", initials: "OP" },
  { name: "Ingrid H.", location: "Oslo, NO",       colorway: "Fern Olive",  accent: "#E0E3DE", stars: 5, text: "The Fern Olive matches my bag perfectly and the sound stage feels wide for something this small. Case magnet snap is satisfying too.", initials: "IH" },
  { name: "Ravi D.",   location: "Mumbai, IN",     colorway: "Bone Cream",  accent: "#E0E3DE", stars: 5, text: "Battery genuinely lasts through my full workday of calls combined with the case. Charging via Type-C is convenient, no separate cable.", initials: "RD" },
  { name: "Sofia M.",  location: "Madrid, ES",     colorway: "Sepia Umber", accent: "#B37C1D", stars: 4, text: "Very happy with the fit — I have small ears and most buds fall out. These clip on and stay. Only wish there were more color options.", initials: "SM" },
  { name: "Ben C.",    location: "Vancouver, CA",  colorway: "Fern Olive",  accent: "#E0E3DE", stars: 5, text: "Design is the real draw for me — genuinely looks like a tiny toy camera. Sound and call quality have been reliable for two months straight.", initials: "BC" },
  { name: "Aaliyah J.", location: "Lagos, NG",     colorway: "Sepia Umber", accent: "#B37C1D", stars: 5, text: "Ordered the Sepia Umber and it's become a conversation starter at work. Glad the audio backs up the looks — crisp highs, no distortion.", initials: "AJ" },
];

function Stars({ count, accent }: { count: number; accent: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 12 12" className="h-3 w-3" fill={i < count ? accent : "rgba(255,255,255,0.15)"}>
          <path d="M6 1l1.4 2.9 3.2.5-2.3 2.2.5 3.2L6 8.4 3.2 9.8l.5-3.2L1.4 4.4l3.2-.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section id="reviews" ref={ref} className="relative overflow-hidden bg-[#080808] py-16 px-5 sm:py-24 sm:px-10 lg:px-16">
      {/* subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 sm:mb-14"
        >
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30 sm:text-xs">
            Contact sheet
          </span>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-[1.9rem] leading-tight text-white sm:text-5xl">
              Fit approved.
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 12 12" className="h-4 w-4" fill="#B37C1D">
                    <path d="M6 1l1.4 2.9 3.2.5-2.3 2.2.5 3.2L6 8.4 3.2 9.8l.5-3.2L1.4 4.4l3.2-.5z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-white">4.8</span>
              <span className="text-sm text-white/30">· 1,340+ reviews</span>
            </div>
          </div>
        </motion.div>

        {/* cards — horizontal scroll on mobile, 3-col grid on md+ */}
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 sm:gap-4 lg:grid-cols-3 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (i % 6) * 0.07 }}
              className="flex w-[80vw] max-w-[320px] shrink-0 flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 sm:w-auto sm:max-w-none"
            >
              {/* stars + colorway tag */}
              <div className="flex items-center justify-between">
                <Stars count={r.stars} accent={r.accent} />
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{ background: r.accent + "1a", color: r.accent, border: `1px solid ${r.accent}33` }}
                >
                  {r.colorway}
                </span>
              </div>

              {/* text */}
              <p className="flex-1 text-sm leading-relaxed text-white/55">&ldquo;{r.text}&rdquo;</p>

              {/* reviewer */}
              <div className="flex items-center gap-3 border-t border-white/[0.06] pt-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{ background: r.accent + "22", color: r.accent }}
                >
                  {r.initials}
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">{r.name}</p>
                  <p className="text-[10px] text-white/30">{r.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <WriteReview />
      </div>
    </section>
  );
}

function WriteReview() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [colorwayId, setColorwayId] = useState(COLORWAYS[0].id);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim() || !text.trim()) {
      setError("Please add your name and a few words about the earbuds.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      await saveReview({ name: name.trim(), colorwayId, rating, text: text.trim() });
      setDone(true);
      setName("");
      setText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't submit — please try again.");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="mt-12 rounded-2xl border border-[#B37C1D]/25 bg-[#B37C1D]/10 p-6 text-center">
        <p className="text-sm text-[#e6c98c]">Thanks — your review was submitted and is awaiting a quick check before it goes live.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B37C1D]/70">Share Your Experience</span>
      <h3 className="mt-1 font-display text-xl text-white">Write a review</h3>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#B37C1D]"
        />
        <select
          value={colorwayId}
          onChange={(e) => setColorwayId(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#B37C1D]"
        >
          {COLORWAYS.map((c) => <option key={c.id} value={c.id} className="bg-[#111]">{c.name}</option>)}
        </select>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
            <svg viewBox="0 0 12 12" className="h-6 w-6" fill={n <= rating ? "#B37C1D" : "rgba(255,255,255,0.15)"}>
              <path d="M6 1l1.4 2.9 3.2.5-2.3 2.2.5 3.2L6 8.4 3.2 9.8l.5-3.2L1.4 4.4l3.2-.5z" />
            </svg>
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="How's the fit, sound and battery life been for you?"
        className="mt-4 min-h-[90px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#B37C1D]"
      />

      {error && <p className="mt-3 text-xs text-red-300">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={sending}
        className="mt-4 rounded-full bg-[#B37C1D] px-7 py-3 text-sm font-bold uppercase tracking-wider text-[#1A1409] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
      >
        {sending ? "Submitting…" : "Submit Review"}
      </button>
    </div>
  );
}
