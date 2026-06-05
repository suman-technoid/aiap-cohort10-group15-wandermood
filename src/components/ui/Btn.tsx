"use client";

import { useState } from "react";
import { Mood, moodColors } from "@/lib/data";

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "quiet";
  full?: boolean;
  mood?: Mood;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  full,
  mood,
  disabled,
  style,
}: BtnProps) {
  const [hover, setHover] = useState(false);
  const c = mood ? moodColors(mood) : null;

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    fontFamily: "var(--sans)",
    fontWeight: 600,
    fontSize: 15.5,
    letterSpacing: "0.01em",
    padding: "15px 26px",
    borderRadius: 999,
    width: full ? "100%" : "auto",
    whiteSpace: "nowrap",
    transition:
      "transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .3s, background .3s, opacity .2s",
    transform: hover && !disabled ? "translateY(-2px)" : "none",
    opacity: disabled ? 0.4 : 1,
    pointerEvents: disabled ? "none" : "auto",
    border: "none",
    cursor: "pointer",
    ...style,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: c
        ? `linear-gradient(180deg, ${c.bright}, ${c.glow})`
        : "oklch(0.97 0.01 80)",
      color: "oklch(0.16 0.02 70)",
      boxShadow: hover
        ? `0 14px 40px ${c ? c.glow : "oklch(0.9 0 0)"}/40%`
        : "0 6px 22px oklch(0 0 0 / 0.3)",
    },
    ghost: {
      background: "oklch(0.99 0.01 80 / 0.06)",
      color: "var(--ink)",
      border: "1px solid var(--line)",
      backdropFilter: "blur(8px)",
    },
    quiet: {
      background: "transparent",
      color: "var(--ink-soft)",
      padding: "12px 10px",
    },
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled}
      style={{ ...base, ...variants[variant] }}
    >
      {children}
    </button>
  );
}
