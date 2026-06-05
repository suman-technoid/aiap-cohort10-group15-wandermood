"use client";

import { Mood, moodColors } from "@/lib/data";
import { Atmosphere } from "@/components/ui/Atmosphere";
import { Btn } from "@/components/ui/Btn";
import { TopBar } from "@/components/ui/TopBar";
import { Frame } from "@/components/ui/Frame";

export interface PrefsState {
  budget: string;
  scope: string;
  length: string;
  company: string;
}

interface PreferencesProps {
  mood: Mood;
  userName: string;
  prefs: PrefsState;
  setPrefs: (prefs: PrefsState) => void;
  onContinue: () => void;
  onBack: () => void;
}

const BUDGET_OPTIONS = ["budget", "comfortable", "luxury"];
const SCOPE_OPTIONS = ["domestic", "international", "anywhere"];
const LENGTH_OPTIONS = ["weekend", "week", "extended"];
const COMPANY_OPTIONS = ["solo", "couple", "friends", "family"];

export function Preferences({
  mood,
  userName,
  prefs,
  setPrefs,
  onContinue,
  onBack,
}: PreferencesProps) {
  const c = moodColors(mood);

  const setPref = (key: keyof PrefsState, value: string) => {
    setPrefs({ ...prefs, [key]: value });
  };

  return (
    <div className="min-h-[100dvh] relative">
      <div className="fixed inset-0 opacity-40">
        <Atmosphere mood={mood} dim />
      </div>
      <Frame style={{ position: "relative", zIndex: 1 }}>
        <TopBar onBack={onBack} />

        <div style={{ animation: "wmFadeUp 0.5s ease both" }}>
          <h1
            className="text-[clamp(30px,8vw,44px)] leading-[1] tracking-tight mt-4 mb-2"
            style={{ fontFamily: "var(--serif)", fontWeight: 400 }}
          >
            A few details.
          </h1>
          <p className="text-[15px] mb-8" style={{ color: "var(--ink-soft)" }}>
            Help us tailor your <em className="italic">{mood.name}</em> trip, {userName}.
          </p>

          <div className="flex flex-col gap-7">
            <PrefGroup
              label="Budget"
              options={BUDGET_OPTIONS}
              value={prefs.budget}
              onChange={(v) => setPref("budget", v)}
              mood={mood}
            />
            <PrefGroup
              label="Where to"
              options={SCOPE_OPTIONS}
              value={prefs.scope}
              onChange={(v) => setPref("scope", v)}
              mood={mood}
            />
            <PrefGroup
              label="How long"
              options={LENGTH_OPTIONS}
              value={prefs.length}
              onChange={(v) => setPref("length", v)}
              mood={mood}
            />
            <PrefGroup
              label="Going with"
              options={COMPANY_OPTIONS}
              value={prefs.company}
              onChange={(v) => setPref("company", v)}
              mood={mood}
            />
          </div>

          <div className="mt-10">
            <Btn mood={mood} full onClick={onContinue}>
              Build my trip
            </Btn>
          </div>
        </div>
      </Frame>
    </div>
  );
}

function PrefGroup({
  label,
  options,
  value,
  onChange,
  mood,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  mood: Mood;
}) {
  const c = moodColors(mood);

  return (
    <div>
      <div
        className="text-[11px] font-semibold tracking-wider uppercase mb-3"
        style={{ color: "var(--ink-faint)" }}
      >
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className="px-4 py-2.5 rounded-full text-[13.5px] font-medium transition-all capitalize"
              style={{
                background: active ? c.chipBg : "oklch(0.99 0.01 80 / 0.05)",
                border: `1px solid ${active ? c.chipBorder : "var(--line-soft)"}`,
                color: active ? "var(--ink)" : "var(--ink-soft)",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
