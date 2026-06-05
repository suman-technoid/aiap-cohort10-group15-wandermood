"use client";

import { Mood, MOODS, moodColors, moodAtmosphere } from "@/lib/data";
import { TopBar } from "@/components/ui/TopBar";
import { Frame } from "@/components/ui/Frame";

interface MoodGridProps {
  userName: string;
  onPick: (mood: Mood) => void;
  onBack: () => void;
}

export function MoodGrid({ userName, onPick, onBack }: MoodGridProps) {
  return (
    <div className="min-h-[100dvh]">
      <Frame>
        <TopBar onBack={onBack} />

        <div className="mt-4 mb-6" style={{ animation: "wmFadeUp 0.5s ease both" }}>
          <h1
            className="text-[clamp(32px,8vw,48px)] leading-[0.98] tracking-tight"
            style={{ fontFamily: "var(--serif)", fontWeight: 400 }}
          >
            {userName}, how do you
            <br />
            want to <span className="italic">feel?</span>
          </h1>
          <p className="mt-3 text-[15px]" style={{ color: "var(--ink-soft)" }}>
            Pick the mood that calls to you right now.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {MOODS.map((mood, i) => (
            <MoodCard key={mood.id} mood={mood} idx={i} onPick={onPick} />
          ))}
        </div>
      </Frame>
    </div>
  );
}

function MoodCard({
  mood,
  idx,
  onPick,
}: {
  mood: Mood;
  idx: number;
  onPick: (m: Mood) => void;
}) {
  const c = moodColors(mood);

  return (
    <button
      onClick={() => onPick(mood)}
      className="relative overflow-hidden rounded-[18px] text-left transition-transform duration-200 hover:-translate-y-0.5"
      style={{
        border: "1px solid var(--line)",
        background: "var(--card)",
        animation: `wmFadeUp 0.5s ease both`,
        animationDelay: `${0.05 + idx * 0.04}s`,
        minHeight: 130,
      }}
    >
      {/* Atmosphere background */}
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: moodAtmosphere(mood, { dim: true }) }}
      />

      <div className="relative z-10 p-4 flex flex-col justify-end h-full min-h-[130px]">
        <span className="text-2xl mb-2">{mood.emoji}</span>
        <div
          className="text-[17px] leading-tight mb-1"
          style={{ fontFamily: "var(--serif)" }}
        >
          {mood.name}
        </div>
        <div className="text-[12.5px]" style={{ color: "var(--ink-soft)" }}>
          {mood.line}
        </div>
      </div>

      {/* Glow on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${c.glow}/30%, transparent)`,
        }}
      />
    </button>
  );
}
