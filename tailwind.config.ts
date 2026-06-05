import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Instrument Serif", "Georgia", "serif"],
        sans: ["Hanken Grotesk", "-apple-system", "system-ui", "sans-serif"],
      },
      colors: {
        wm: {
          bg: "oklch(0.16 0.008 70)",
          "bg-2": "oklch(0.20 0.010 70)",
          ink: "oklch(0.96 0.006 80)",
          "ink-soft": "oklch(0.80 0.008 80)",
          "ink-faint": "oklch(0.64 0.010 80)",
        },
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "none" },
        },
        fade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "none" },
        },
        drift: {
          "0%": { transform: "translate3d(0,0,0) scale(1.05)" },
          "100%": { transform: "translate3d(-2%, -1.5%, 0) scale(1.12)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease both",
        fade: "fade 0.4s ease both",
        scaleIn: "scaleIn 0.6s ease both",
        drift: "drift 18s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
export default config;
