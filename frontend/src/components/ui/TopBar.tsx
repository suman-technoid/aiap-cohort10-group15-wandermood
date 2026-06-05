"use client";

import { Wordmark } from "./Wordmark";

interface TopBarProps {
  onBack?: () => void;
  onLogoClick?: () => void;
  step?: number;
  total?: number;
  right?: React.ReactNode;
}

export function TopBar({ onBack, onLogoClick, step, total, right }: TopBarProps) {
  return (
    <div className="flex items-center justify-between py-5 px-1 gap-3.5">
      <div className="flex items-center gap-3.5">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Back"
            className="w-[38px] h-[38px] rounded-full grid place-items-center flex-shrink-0"
            style={{
              border: "1px solid var(--line)",
              background: "oklch(0.99 0.01 80 / 0.05)",
              color: "var(--ink-soft)",
            }}
          >
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
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <button onClick={onLogoClick} className="cursor-pointer" aria-label="Home">
          <Wordmark size={19} />
        </button>
      </div>
      {step != null && total != null ? (
        <Stepper step={step} total={total} />
      ) : (
        right
      )}
    </div>
  );
}

function Stepper({ step, total = 4 }: { step: number; total?: number }) {
  return (
    <div className="flex gap-[7px] items-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-400"
          style={{
            height: 3,
            width: i === step ? 26 : 14,
            background:
              i <= step
                ? "oklch(0.95 0.02 88)"
                : "oklch(0.98 0.01 80 / 0.18)",
          }}
        />
      ))}
    </div>
  );
}
