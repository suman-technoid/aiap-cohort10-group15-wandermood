"use client";

import { useEffect, useState } from "react";
import { Mood, moodColors } from "@/lib/data";
import { Atmosphere } from "@/components/ui/Atmosphere";

interface LoadingProps {
  mood: Mood;
  beats: string[];
  duration: number;
  onDone: () => void;
}

export function Loading({ mood, beats, duration, onDone }: LoadingProps) {
  const [beatIdx, setBeatIdx] = useState(0);
  const c = moodColors(mood);

  useEffect(() => {
    const interval = duration / beats.length;
    const timer = setInterval(() => {
      setBeatIdx((i) => {
        if (i >= beats.length - 1) return i;
        return i + 1;
      });
    }, interval);

    const done = setTimeout(onDone, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(done);
    };
  }, [beats.length, duration, onDone]);

  return (
    <div className="min-h-[100dvh] relative flex flex-col items-center justify-center">
      <Atmosphere mood={mood} />

      <div
        className="relative z-10 flex flex-col items-center text-center px-6"
        style={{ animation: "wmFadeUp 0.5s ease both" }}
      >
        {/* Breathing mood orb with emoji — same as original prototype */}
        <div
          className="w-28 h-28 rounded-full mb-10 grid place-items-center"
          style={{
            background: `conic-gradient(from 200deg, ${c.bright}, ${c.glow}, ${c.deep}, ${c.bright})`,
            boxShadow: `0 0 60px ${c.glow}, 0 0 120px ${c.deep}`,
            animation: "wmBreathe 3s ease-in-out infinite",
          }}
        >
          <span className="text-5xl">{mood.emoji}</span>
        </div>

        {/* Beat text — cycles with fade */}
        <p
          key={beatIdx}
          className="text-[22px] leading-relaxed max-w-xs"
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            color: "var(--ink)",
            animation: "wmFadeUp 0.5s ease both",
          }}
        >
          {beats[beatIdx]}
        </p>

        {/* Shimmer progress bar */}
        <div
          className="mt-10 w-48 h-[3px] rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${c.bright}, transparent)`,
              backgroundSize: "200% 100%",
              animation: "wmShimmer 1.8s linear infinite",
            }}
          />
        </div>

        {/* Step dots */}
        <div className="flex gap-2.5 mt-6">
          {beats.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === beatIdx ? 20 : 6,
                height: 6,
                background: i <= beatIdx ? c.bright : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
