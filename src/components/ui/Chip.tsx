"use client";

import { Mood, moodColors } from "@/lib/data";

interface ChipProps {
  children: React.ReactNode;
  mood?: Mood;
  active?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Chip({ children, mood, active, onClick, style }: ChipProps) {
  const c = mood ? moodColors(mood) : null;
  return (
    <span
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-full whitespace-nowrap transition-all"
      style={{
        cursor: onClick ? "pointer" : "default",
        background: active
          ? c
            ? c.chipBg
            : "oklch(0.97 0.01 80 / 0.16)"
          : "oklch(0.99 0.01 80 / 0.05)",
        border: `1px solid ${
          active
            ? c
              ? c.chipBorder
              : "var(--line)"
            : "var(--line-soft)"
        }`,
        color: active ? "var(--ink)" : "var(--ink-soft)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
