"use client";

import { useState } from "react";
import { Mood, moodColors, Itinerary } from "@/lib/data";
import { Atmosphere } from "@/components/ui/Atmosphere";
import { Btn } from "@/components/ui/Btn";
import { TopBar } from "@/components/ui/TopBar";
import { Frame } from "@/components/ui/Frame";
import type { PrefsState } from "./Preferences";

interface InboxScreenProps {
  mood: Mood;
  userName: string;
  prefs: PrefsState;
  trip: Itinerary;
  onRestart: () => void;
}

export function InboxScreen({ mood, userName, prefs, trip, onRestart }: InboxScreenProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const c = moodColors(mood);
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  const send = async () => {
    if (!valid || sending) return;
    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/send-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          moodId: mood.id,
          moodName: mood.name,
          moodEmoji: mood.emoji,
          preferences: prefs,
          itinerary: {
            title: trip.title,
            subtitle: trip.subtitle,
            place: trip.place,
            range: trip.range,
            hero: trip.hero,
            summary: trip.summary,
            stats: trip.stats,
            days: trip.days,
            tips: trip.tips,
            packing: trip.packing,
          },
        }),
      });

      if (response.ok) {
        setSent(true);
      } else {
        const data = await response.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[100dvh] relative flex flex-col">
      <div className="fixed inset-0 opacity-60">
        <Atmosphere mood={mood} />
      </div>
      <Frame style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
        <TopBar />
        <div className="flex-1 flex flex-col justify-center pb-12">
          {!sent ? (
            <div style={{ animation: "wmFadeUp .5s both" }}>
              <div className="text-[56px] mb-5">✉️</div>
              <h1
                className="text-[clamp(38px,10vw,58px)] leading-none tracking-tight mb-4"
                style={{ fontFamily: "var(--serif)", fontWeight: 400 }}
              >
                Almost there.
              </h1>
              <p className="text-[17px] leading-relaxed max-w-[400px] mb-8" style={{ color: "var(--ink-soft)" }}>
                Drop your email, {userName}, and your{" "}
                <em className="italic" style={{ color: "var(--ink)" }}>
                  {mood.name}
                </em>{" "}
                itinerary lands in your inbox — ready to book, ready to feel.
              </p>

              <div className="flex flex-col gap-3 max-w-[420px]">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@email.com"
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  className="w-full px-[18px] py-4 rounded-[14px] text-base outline-none"
                  style={{
                    fontFamily: "var(--sans)",
                    background: "oklch(0.99 0.01 80 / 0.06)",
                    border: `1px solid ${email && !valid ? "oklch(0.6 0.15 25)" : "var(--line)"}`,
                    color: "var(--ink)",
                  }}
                />
                <Btn mood={mood} full disabled={!valid || sending} onClick={send}>
                  {sending ? "Sending…" : "Send my itinerary"}
                </Btn>
              </div>

              {error && (
                <p className="text-[13px] mt-3" style={{ color: "oklch(0.7 0.15 25)" }}>
                  {error}
                </p>
              )}

              <p className="text-[12.5px] mt-4" style={{ color: "var(--ink-faint)" }}>
                No spam. Just this trip, and the occasional mood.
              </p>
            </div>
          ) : (
            <div style={{ animation: "wmScaleIn .6s both" }}>
              <div
                className="w-[84px] h-[84px] rounded-full mb-6 grid place-items-center"
                style={{
                  background: `linear-gradient(135deg, ${c.bright}, ${c.glow})`,
                  boxShadow: `0 16px 50px ${c.glow}/50%`,
                }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="oklch(0.18 0.02 70)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h1
                className="text-[clamp(40px,11vw,64px)] leading-[0.98] tracking-tight mb-4"
                style={{ fontFamily: "var(--serif)", fontWeight: 400 }}
              >
                You&apos;re all set.
                <br />
                <span className="italic">All eyes on your inbox.</span>
              </h1>
              <p className="text-[17px] leading-relaxed max-w-[400px] mb-8" style={{ color: "var(--ink-soft)" }}>
                Your {mood.name} trip is on its way to{" "}

                <strong className="font-semibold" style={{ color: "var(--ink)" }}>
                  {email}
                </strong>
                . Go enjoy the feeling.
              </p>
              <Btn variant="ghost" onClick={onRestart}>
                Plan another mood
              </Btn>
            </div>
          )}
        </div>
      </Frame>
    </div>
  );
}
