"use client";

import { useEffect, useState } from "react";
import { Mood, SAMPLE_TRIP, moodColors } from "@/lib/data";
import { Atmosphere } from "@/components/ui/Atmosphere";
import { TopBar } from "@/components/ui/TopBar";
import { Frame } from "@/components/ui/Frame";

interface SampleTeaserProps {
  mood: Mood;
  userName: string;
  isGenerating: boolean;
  generationDone: boolean;
  aiError: string | null;
  onDone: () => void;
  onBack: () => void;
}

const FUNNY_MESSAGES = [
  "Arguing with the GPS…",
  "Convincing the cat to house-sit…",
  "Googling 'is it rude to nap at a temple'…",
  "Packing socks… unpacking socks… repacking socks…",
  "Asking locals where the locals eat…",
  "Negotiating with an auto-rickshaw driver…",
  "Finding the sunset spot nobody posts about…",
  "Rating hotels by pillow fluffiness…",
  "Calculating how many samosas fit in a backpack…",
  "Composing the perfect OOO email…",
  "Wondering if 3 books is enough for 4 days…",
  "Planning the 'spontaneous' photo ops…",
  "Checking if Wi-Fi counts as a personality trait…",
  "Mentally quitting my job already…",
  "Searching 'do I really need pants for this trip'…",
];

export function SampleTeaser({
  mood,
  userName,
  isGenerating,
  generationDone,
  aiError,
  onDone,
  onBack,
}: SampleTeaserProps) {
  const c = moodColors(mood);
  const t = SAMPLE_TRIP;
  const [msgIdx, setMsgIdx] = useState(0);
  const [minTimePassed, setMinTimePassed] = useState(false);

  // Cycle through funny messages
  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx((i) => (i + 1) % FUNNY_MESSAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Minimum display time so the screen doesn't flash
  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // Auto-advance once generation is done and minimum time has passed
  useEffect(() => {
    if (minTimePassed && (generationDone || aiError)) {
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }
  }, [minTimePassed, generationDone, aiError, onDone]);

  return (
    <div className="min-h-[100dvh] relative flex flex-col">
      <div className="fixed inset-0 opacity-50">
        <Atmosphere mood={mood} dim />
      </div>

      {/* Main content */}
      <div className="flex-1 relative z-[1]">
        <Frame>
          <TopBar onBack={onBack} />

          <div className="mt-8" style={{ animation: "wmFadeUp 0.6s ease both" }}>
            <div
              className="text-[11px] font-semibold tracking-wider uppercase mb-3"
              style={{ color: c.bright }}
            >
              From a fellow traveler
            </div>

            <h2
              className="text-[clamp(28px,7vw,40px)] leading-[1.05] tracking-tight mb-2"
              style={{ fontFamily: "var(--serif)", fontWeight: 400 }}
            >
              {t.title}
            </h2>

            <p className="text-[13px] mb-6" style={{ color: "var(--ink-faint)" }}>
              Hang tight, {userName} — we&apos;re building yours next.
            </p>

            <p className="text-[15px] mb-6" style={{ color: "var(--ink-soft)" }}>
              📍 {t.place}
            </p>

            {/* Quote card */}
            <div
              className="rounded-2xl p-5 mb-6"
              style={{
                background: "var(--card)",
                border: "1px solid var(--line)",
              }}
            >
              <p
                className="text-[16.5px] italic leading-relaxed mb-4"
                style={{ fontFamily: "var(--serif)" }}
              >
                &ldquo;{t.traveler.quote}&rdquo;
              </p>
              <div className="text-[13px]" style={{ color: "var(--ink-faint)" }}>
                — {t.traveler.name}, {t.traveler.type}
              </div>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-4 gap-px rounded-2xl overflow-hidden"
              style={{
                background: "var(--line-soft)",
                border: "1px solid var(--line)",
              }}
            >
              {t.stats.map((s) => (
                <div
                  key={s.label}
                  className="py-4 px-2 text-center"
                  style={{ background: "oklch(0.2 0.01 70)" }}
                >
                  <div
                    className="text-[20px] leading-none"
                    style={{ fontFamily: "var(--serif)" }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="text-[10px] tracking-wider uppercase mt-1.5"
                    style={{ color: "var(--ink-faint)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Frame>
      </div>

      {/* Bottom loader area */}
      <div className="relative z-[1] px-6 pb-8 pt-6">
        <div className="max-w-[540px] mx-auto">
          {/* Progress bar */}
          <div
            className="h-[3px] rounded-full overflow-hidden mb-4"
            style={{ background: "oklch(0.98 0.01 80 / 0.1)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-[2s] ease-out"
              style={{
                background: `linear-gradient(90deg, ${c.bright}, ${c.glow})`,
                width: generationDone || aiError ? "100%" : isGenerating ? "65%" : "10%",
              }}
            />
          </div>

          {/* Funny message ticker */}
          <p
            key={msgIdx}
            className="text-[13.5px] text-center italic"
            style={{
              color: "var(--ink-faint)",
              animation: "wmFadeUp 0.4s ease both",
            }}
          >
            {FUNNY_MESSAGES[msgIdx]}
          </p>
        </div>
      </div>
    </div>
  );
}
