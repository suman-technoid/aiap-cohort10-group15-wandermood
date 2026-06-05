"use client";

interface FrameProps {
  children: React.ReactNode;
  max?: number;
  pad?: boolean;
  style?: React.CSSProperties;
}

export function Frame({ children, max = 540, pad = true, style }: FrameProps) {
  return (
    <div
      className="w-full mx-auto relative z-[1]"
      style={{
        maxWidth: max,
        padding: pad ? "0 22px 40px" : "0",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
