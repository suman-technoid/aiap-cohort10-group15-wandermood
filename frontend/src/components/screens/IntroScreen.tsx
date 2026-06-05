"use client";

import { useState } from "react";
import { Btn } from "@/components/ui/Btn";
import { Wordmark } from "@/components/ui/Wordmark";

interface IntroScreenProps {
  onStart: (name: string) => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const [name, setName] = useState("");
  const valid = name.trim().length >= 1;

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden">
      {/* Animated background — smooth crossfade between mood colors */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 140% 100% at 50% 40%, rgba(210, 170, 60, 0.75) 0%, rgba(30, 25, 18, 1) 70%)",
          animation: "wmMood1 25s ease-in-out infinite",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 140% 100% at 50% 40%, rgba(80, 190, 170, 0.75) 0%, rgba(20, 28, 28, 1) 70%)",
          animation: "wmMood2 25s ease-in-out infinite",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 140% 100% at 50% 40%, rgba(200, 80, 120, 0.75) 0%, rgba(35, 18, 25, 1) 70%)",
          animation: "wmMood3 25s ease-in-out infinite",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 140% 100% at 50% 40%, rgba(100, 80, 200, 0.75) 0%, rgba(22, 18, 35, 1) 70%)",
          animation: "wmMood4 25s ease-in-out infinite",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 140% 100% at 50% 40%, rgba(80, 190, 80, 0.75) 0%, rgba(18, 28, 20, 1) 70%)",
          animation: "wmMood5 25s ease-in-out infinite",
        }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(15, 13, 10, 0.5) 100%)",
          }}
        />
      </div>

      {/* Top bar with logo */}
      <div className="relative z-10 pt-8 px-6 w-full max-w-[540px] mx-auto">
        <Wordmark size={36} />
      </div>

      {/* Content — left aligned, vertically centered */}
      <div
        className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-[540px] mx-auto px-6"
        style={{ animation: "wmFadeUp 0.8s ease both" }}
      >
        {/* Label */}
        <p
          className="text-[12px] font-semibold tracking-[0.2em] uppercase mb-6"
          style={{ color: "var(--ink-faint)" }}
        >
          Travel by feeling
        </p>

        {/* Headline */}
        <h1
          className="text-[clamp(42px,11vw,72px)] leading-[1.0] tracking-tight mb-8"
          style={{ fontFamily: "var(--serif)", fontWeight: 400 }}
        >
          How do you
          <br />
          want to <span className="italic">feel?</span>
        </h1>

        {/* Subtext */}
        <p
          className="text-[17px] leading-[1.6] max-w-[440px] mb-10"
          style={{ color: "var(--ink-soft)" }}
        >
          Tell us your mood. We&apos;ll dream up a trip that matches it — places, days and the little things, sent straight to your inbox.
        </p>

        {/* Name input */}
        <div className="max-w-xs">
          <label
            className="block text-[21px] mb-3"
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
            className="w-full px-[18px] py-4 rounded-[14px] text-base outline-none mb-5"
            style={{
              fontFamily: "var(--sans)",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
            }}
          />
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
      </div>
    </div>
  );
}
