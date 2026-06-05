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
      <Atmosphere mood={mood} dim />

      <div
        className="relative z-10 flex flex-col items-center text-center px-6"
        style={{ animation: "wmFadeUp 0.5s ease both" }}
      >
        {/* Spinner */}
        <div
          className="w-12 h-12 rounded-full mb-8"
          style={{
            border: `2px solid oklch(0.98 0.01 80 / 0.15)`,
            borderTopColor: c.bright,
            animation: "wmSpin 1s linear infinite",
          }}
        />

        {/* Beat text */}
        <p
          key={beatIdx}
          className="text-lg"
          style={{
            fontFamily: "var(--serif)",
            color: "var(--ink-soft)",
            animation: "wmFadeUp 0.4s ease both",
          }}
        >
          {beats[beatIdx]}
        </p>

        {/* Progress dots */}
        <div className="flex gap-2 mt-8">
          {beats.map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                background:
                  i <= beatIdx ? c.bright : "oklch(0.98 0.01 80 / 0.2)",
                transform: i === beatIdx ? "scale(1.4)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
