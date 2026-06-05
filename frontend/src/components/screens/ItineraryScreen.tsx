"use client";

import { useState } from "react";
import { Mood, Itinerary as ItineraryType, moodColors } from "@/lib/data";
import { Atmosphere } from "@/components/ui/Atmosphere";
import { Btn } from "@/components/ui/Btn";
import { Chip } from "@/components/ui/Chip";
import { TopBar } from "@/components/ui/TopBar";
import { Frame } from "@/components/ui/Frame";
import type { PrefsState } from "./Preferences";

interface ItineraryScreenProps {
  mood: Mood;
  prefs: PrefsState;
  userName: string;
  trip: ItineraryType;
  tripIndex: number;
  tripTotal: number;
  onSwap: () => void;
  onGenerateMore: () => void;
  swapDisabled: boolean;
  swapLoading: boolean;
  onSend: () => void;
  onBack: () => void;
  onHome: () => void;
}

export function ItineraryScreen({
  mood,
  prefs,
  userName,
  trip,
  tripIndex,
  tripTotal,
  onSwap,
  onGenerateMore,
  swapDisabled,
  swapLoading,
  onSend,
  onBack,
  onHome,
}: ItineraryScreenProps) {
  const c = moodColors(mood);

  return (
    <div className="min-h-[100dvh] relative">
      {/* Hero */}
      <div className="relative h-[44vh] min-h-[320px] overflow-hidden">
        <Atmosphere mood={mood} />
        <Frame style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column" }}>
          <TopBar
            onBack={onBack}
            onLogoClick={onHome}
            right={
              <span className="text-[12.5px]" style={{ color: "var(--ink-soft)" }}>
                Crafted for {userName}
              </span>
            }
          />
          <div
            className="mt-auto pb-6"
            style={{ animation: "wmFadeUp .7s both" }}
          >
            <div className="inline-flex items-center gap-2 mb-3.5">
              <span className="text-[22px]">{mood.emoji}</span>
              <Chip mood={mood} active>
                {mood.name}
              </Chip>
            </div>
            <h1
              className="text-[clamp(38px,10vw,60px)] leading-[0.98] tracking-tight mb-2"
              style={{
                fontFamily: "var(--serif)",
                fontWeight: 400,
                textShadow: "0 2px 24px oklch(0 0 0 / 0.5)",
              }}
            >
              {trip.title}
            </h1>
            <div className="flex items-center gap-2.5 text-[15px]" style={{ color: "oklch(0.97 0.01 80 / 0.92)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {trip.place} · {trip.range}
            </div>
          </div>
        </Frame>
      </div>

      <Frame>
        {/* Stats */}
        <div
          className="grid grid-cols-4 gap-px rounded-2xl overflow-hidden mt-5"
          style={{
            background: "var(--line-soft)",
            border: "1px solid var(--line)",
            animation: "wmFadeUp .5s both .1s",
          }}
        >
          {trip.stats.map((s) => (
            <div key={s.label} className="py-4 px-2 text-center" style={{ background: "oklch(0.2 0.01 70)" }}>
              <div className="text-[22px] leading-none" style={{ fontFamily: "var(--serif)" }}>
                {s.value}
              </div>
              <div className="text-[10.5px] tracking-wider uppercase mt-1.5" style={{ color: "var(--ink-faint)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Swap trip — show dots + button */}
        <div
          className="flex items-center justify-between gap-3 mt-3.5 flex-wrap"
          style={{ animation: "wmFadeUp .5s both .12s" }}
        >
          <div className="flex items-center gap-[7px]">
            {tripTotal > 1 ? (
              <>
                {Array.from({ length: tripTotal }).map((_, i) => (
                  <span
                    key={i}
                    onClick={() => onSwap()}
                    className="rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      width: i === tripIndex ? 18 : 6,
                      height: 6,
                      background: i === tripIndex ? c.bright : "oklch(0.98 0.01 80 / 0.2)",
                    }}
                  />
                ))}
                <span className="text-[12.5px] ml-1.5" style={{ color: "var(--ink-faint)" }}>
                  Option {tripIndex + 1} of {tripTotal}
                </span>
              </>
            ) : (
              <span className="text-[12.5px]" style={{ color: "var(--ink-faint)" }}>
                Your personalized trip
              </span>
            )}
          </div>
          <SwapBtn
            c={c}
            onClick={tripTotal > 1 ? onSwap : onGenerateMore}
            label={swapLoading ? "Getting more options…" : (tripTotal > 1 && swapDisabled) ? "Next →" : "Show me another"}
            disabled={swapLoading}
          />
        </div>

        <p
          className="text-[22px] leading-relaxed mt-6"
          style={{ fontFamily: "var(--serif)", animation: "wmFadeUp .5s both .15s" }}
        >
          {trip.summary}
        </p>

        {/* Days */}
        <Section title="Day by day" delay={0.25}>
          <div className="flex flex-col gap-3">
            {trip.days.map((d, i) => (
              <DayCard key={d.n} day={d} mood={mood} idx={i} />
            ))}
          </div>
        </Section>

        {/* Tips */}
        <Section title="Good to know" delay={0.3}>
          <div className="flex flex-col gap-2.5">
            {trip.tips.map((tip, i) => (
              <div
                key={i}
                className="flex gap-3 p-3.5 rounded-[14px]"
                style={{ background: "var(--card)", border: "1px solid var(--line-soft)" }}
              >
                <span className="flex-shrink-0 text-[15px]" style={{ color: c.bright }}>
                  ✦
                </span>
                <span className="text-[14.5px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Packing */}
        <Section title="Pack light" delay={0.32}>
          <div className="flex flex-wrap gap-2">
            {trip.packing.map((p) => (
              <Chip key={p} mood={mood} active>
                {p}
              </Chip>
            ))}
          </div>
        </Section>

        {/* Send CTA */}
        <div
          className="mt-10 p-6 rounded-[22px] text-center relative overflow-hidden"
          style={{ animation: "wmFadeUp .5s both .35s" }}
        >
          <Atmosphere mood={mood} drift={false} dim />
          <div className="relative z-10">
            <h3 className="text-[28px] mb-2" style={{ fontFamily: "var(--serif)" }}>
              Love it? Make it yours.
            </h3>
            <p className="text-[14.5px] mb-5 max-w-[360px] mx-auto" style={{ color: "var(--ink-soft)" }}>
              We&apos;ll send the full itinerary, maps and bookings to your inbox.
            </p>
            <Btn mood={mood} onClick={onSend}>
              Send to my inbox
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </Btn>
            {tripTotal > 1 && (
              <div className="mt-4">
                <button
                  onClick={onSwap}
                  className="text-[13.5px] underline underline-offset-2"
                  style={{ color: "oklch(0.97 0.01 80 / 0.85)", textDecorationColor: "oklch(0.97 0.01 80 / 0.4)" }}
                >
                  Not quite right? Show me a different trip
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="h-8" />
      </Frame>
    </div>
  );
}

function Section({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <div className="mt-8" style={{ animation: `wmFadeUp .5s both ${delay}s` }}>
      <h3
        className="text-[26px] mb-4 tracking-tight"
        style={{ fontFamily: "var(--serif)", fontWeight: 400 }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function DayCard({
  day,
  mood,
  idx,
}: {
  day: ItineraryType["days"][number];
  mood: Mood;
  idx: number;
}) {
  const [open, setOpen] = useState(idx === 0);
  const c = moodColors(mood);

  return (
    <div
      className="rounded-[20px] overflow-hidden"
      style={{
        border: "1px solid var(--line)",
        background: "var(--card)",
        animation: `wmFadeUp .5s both`,
        animationDelay: `${0.05 + idx * 0.07}s`,
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3.5 p-4 text-left"
      >
        <div
          className="w-[42px] h-[42px] rounded-[13px] flex-shrink-0 grid place-items-center"
          style={{
            background: `linear-gradient(135deg, ${c.bright}, ${c.glow})`,
            color: "oklch(0.18 0.02 70)",
          }}
        >
          <div className="text-[20px] leading-none" style={{ fontFamily: "var(--serif)" }}>
            {day.n}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[11px] tracking-wider uppercase" style={{ color: "var(--ink-faint)" }}>
            Day {day.n}
          </div>
          <div className="text-[21px] leading-tight" style={{ fontFamily: "var(--serif)" }}>
            {day.title}
          </div>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ink-faint)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-400 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">
            {/* Photo placeholder */}
            <div
              className="h-[100px] rounded-[14px] mb-3.5"
              style={{ background: `linear-gradient(135deg, ${c.deep}, ${c.glow}/30%)` }}
            />
            <div className="flex flex-col">
              {day.items.map((it, i) => (
                <div
                  key={i}
                  className="flex gap-3.5 py-2.5"
                  style={{ borderTop: i ? "1px solid var(--line-soft)" : "none" }}
                >
                  <div
                    className="w-[66px] flex-shrink-0 text-[12.5px] font-semibold pt-px"
                    style={{ color: c.bright, fontVariantNumeric: "tabular-nums" }}
                  >
                    {it.time}
                  </div>
                  <div className="text-[14.5px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                    {it.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SwapBtn({ c, onClick, label, disabled = false }: { c: ReturnType<typeof moodColors>; onClick: () => void; label: string; disabled?: boolean }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      disabled={disabled}
      className="inline-flex items-center gap-2 text-[13.5px] font-semibold px-4 py-2.5 rounded-full transition-transform"
      style={{
        border: `1px solid ${c.chipBorder}`,
        background: c.chipBg,
        transform: h && !disabled ? "translateY(-1px)" : "none",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-400"
        style={{ transform: h ? "rotate(-45deg)" : "none" }}
      >
        <path d="M23 4v6h-6M1 20v-6h6" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
      </svg>
      {label}
    </button>
  );
}
