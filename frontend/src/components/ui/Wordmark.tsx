"use client";

export function Wordmark({ size = 22, dim = false }: { size?: number; dim?: boolean }) {
  return (
    <div
      className="inline-flex items-center select-none"
      style={{
        fontFamily: "var(--serif)",
        fontSize: size,
        letterSpacing: "-0.01em",
        color: dim ? "var(--ink-faint)" : "var(--ink)",
        gap: size * 0.34,
      }}
    >
      <span
        className="inline-block flex-shrink-0 rounded-full"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          background:
            "conic-gradient(from 200deg, oklch(0.78 0.14 88), oklch(0.66 0.12 200), oklch(0.66 0.13 330), oklch(0.78 0.14 88))",
          boxShadow: "0 0 14px oklch(0.78 0.14 88 / 0.5)",
        }}
      />
      <span>
        wander<span className="italic">mood</span>
      </span>
    </div>
  );
}
