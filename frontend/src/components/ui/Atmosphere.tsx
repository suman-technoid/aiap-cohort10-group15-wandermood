"use client";

import { Mood, moodAtmosphere } from "@/lib/data";

interface AtmosphereProps {
  mood: Mood;
  drift?: boolean;
  dim?: boolean;
  style?: React.CSSProperties;
}

export function Atmosphere({ mood, drift = true, dim = false, style }: AtmosphereProps) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      style={style}
    >
      <div
        className="absolute"
        style={{
          inset: "-8%",
          background: moodAtmosphere(mood, { dim }),
          animation: drift ? "wmDrift 18s ease-in-out infinite alternate" : "none",
          filter: "saturate(1.05)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 120%, oklch(0.12 0.01 70 / 0.85) 0%, transparent 55%), linear-gradient(180deg, oklch(0.12 0.01 70 / 0.35) 0%, transparent 25%, transparent 60%, oklch(0.12 0.01 70 / 0.55) 100%)",
        }}
      />
    </div>
  );
}
