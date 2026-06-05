"use client";

import { Mood, moodColors } from "@/lib/data";
import { Atmosphere } from "@/components/ui/Atmosphere";
import { Btn } from "@/components/ui/Btn";
import { Chip } from "@/components/ui/Chip";
import { TopBar } from "@/components/ui/TopBar";
import { Frame } from "@/components/ui/Frame";

interface MoodConfirmProps {
  mood: Mood;
  userName: string;
  onContinue: () => void;
  onBack: () => void;
}

export function MoodConfirm({ mood, userName, onContinue, onBack }: MoodConfirmProps) {
  const c = moodColors(mood);

  return (
    <div className="min-h-[100dvh] relative">
      <Atmosphere mood={mood} />
      <Frame style={{ position: "relative", zIndex: 1 }}>
        <TopBar onBack={onBack} />

        <div
          className="mt-16 flex flex-col items-center text-center"
          style={{ animation: "wmFadeUp 0.6s ease both" }}
        >
          <span className="text-6xl mb-6">{mood.emoji}</span>

          <h1
            className="text-[clamp(36px,10vw,56px)] leading-[0.98] tracking-tight mb-4"
            style={{ fontFamily: "var(--serif)", fontWeight: 400 }}
          >
            {mood.name}
          </h1>

          <p
            className="text-lg leading-relaxed max-w-sm mb-4"
            style={{ color: "var(--ink-soft)" }}
          >
            {mood.feels}
          </p>

          <p
            className="text-[15px] mb-4"
            style={{ color: "var(--ink-faint)", fontStyle: "italic" }}
          >
            Sounds like you, {userName}?
          </p>

          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {mood.doing.slice(0, 4).map((d) => (
              <Chip key={d} mood={mood} active>
                {d}
              </Chip>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-3">
            {mood.go.slice(0, 3).map((g) => (
              <span
                key={g}
                className="text-sm"
                style={{ color: "var(--ink-faint)" }}
              >
                📍 {g}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Btn mood={mood} onClick={onContinue}>
              This is my mood
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
      </Frame>
    </div>
  );
}
