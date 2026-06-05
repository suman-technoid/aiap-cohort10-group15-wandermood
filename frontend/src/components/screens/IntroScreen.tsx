"use client";

import { useState } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { Btn } from "@/components/ui/Btn";
import { MOODS } from "@/lib/data";

interface IntroScreenProps {
  onStart: (name: string) => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const [name, setName] = useState("");
  const valid = name.trim().length >= 1;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, oklch(0.35 0.04 70 / 0.6) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center text-center max-w-md"
        style={{ animation: "wmFadeUp 0.8s ease both" }}
      >
        {/* Orb */}
        <div
          className="w-24 h-24 rounded-full mb-10"
          style={{
            background:
              "conic-gradient(from 200deg, oklch(0.78 0.14 88), oklch(0.66 0.12 200), oklch(0.66 0.13 330), oklch(0.78 0.14 88))",
            boxShadow: "0 0 60px oklch(0.78 0.14 88 / 0.4)",
            animation: "wmBreathe 4s ease-in-out infinite",
          }}
        />

        <Wordmark size={38} />

        <p
          className="mt-6 text-lg leading-relaxed"
          style={{ color: "var(--ink-soft)" }}
        >
          You don&apos;t need a destination. You need a feeling.
          <br />
          <span className="italic" style={{ color: "var(--ink)" }}>
            Tell us your mood — we&apos;ll plan the trip.
          </span>
        </p>

        {/* Name input */}
        <div className="mt-10 w-full max-w-xs">
          <label
            className="block text-[15px] mb-3"
            style={{ fontFamily: "var(--serif)", color: "var(--ink)" }}
          >
            What do I call thee?
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && valid && onStart(name.trim())}
            type="text"
            placeholder="Your name"
            className="w-full px-[18px] py-4 rounded-[14px] text-base text-center outline-none"
            style={{
              fontFamily: "var(--sans)",
              background: "oklch(0.99 0.01 80 / 0.06)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
            }}
          />
        </div>

        <div className="mt-6">
          <Btn onClick={() => valid && onStart(name.trim())} disabled={!valid}>
            Let&apos;s go
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Btn>
        </div>

        {/* Mood emoji rail */}
        <div className="mt-10 flex gap-3 opacity-50">
          {MOODS.slice(0, 5).map((m) => (
            <span key={m.id} className="text-2xl">
              {m.emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
