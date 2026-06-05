"use client";

import { useState, useCallback, useRef } from "react";
import {
  Mood,
  MOODS,
  MOOD_BY_ID,
  ITINERARIES,
  LOADING_BEATS,
  Itinerary,
} from "@/lib/data";
import { IntroScreen } from "@/components/screens/IntroScreen";
import { MoodGrid } from "@/components/screens/MoodGrid";
import { MoodConfirm } from "@/components/screens/MoodConfirm";
import { Loading } from "@/components/screens/Loading";
import { Preferences, PrefsState } from "@/components/screens/Preferences";
import { SampleTeaser } from "@/components/screens/SampleTeaser";
import { ItineraryScreen } from "@/components/screens/ItineraryScreen";
import { InboxScreen } from "@/components/screens/InboxScreen";

type Screen =
  | "intro"
  | "mood"
  | "confirm"
  | "loadMood"
  | "prefs"
  | "sample"
  | "itinerary"
  | "inbox";

const FLOW: Screen[] = [
  "intro",
  "mood",
  "confirm",
  "loadMood",
  "prefs",
  "sample",
  "itinerary",
  "inbox",
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [hist, setHist] = useState<Screen[]>([]);
  const [userName, setUserName] = useState("");
  const [moodId, setMoodId] = useState<string | null>(null);
  const [tripIndex, setTripIndex] = useState(0);
  const [prefs, setPrefs] = useState<PrefsState>({
    budget: "comfortable",
    scope: "domestic",
    length: "weekend",
    company: "solo",
  });
  const [animKey, setAnimKey] = useState(0);

  // AI-generated itineraries
  const [aiTrips, setAiTrips] = useState<Itinerary[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const generationDone = useRef(false);

  const mood: Mood = moodId ? MOOD_BY_ID[moodId] : MOODS[0];

  // The active trips list: AI-generated if available, fallback to static
  const trips = aiTrips.length > 0 ? aiTrips : ITINERARIES;

  const go = useCallback(
    (next: Screen, { push = true } = {}) => {
      setHist((h) => (push ? [...h, screen] : h));
      setScreen(next);
      setAnimKey((k) => k + 1);
      window.scrollTo({ top: 0 });
    },
    [screen]
  );

  const advance = useCallback(
    (opts?: { push?: boolean }) => {
      const i = FLOW.indexOf(screen);
      const next = FLOW[Math.min(i + 1, FLOW.length - 1)];
      go(next, opts);
    },
    [screen, go]
  );

  const back = () => {
    setHist((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setScreen(prev);
      setAnimKey((k) => k + 1);
      window.scrollTo({ top: 0 });
      return h.slice(0, -1);
    });
  };

  const reset = () => {
    setHist([]);
    setUserName("");
    setMoodId(null);
    setTripIndex(0);
    setAiTrips([]);
    setAiError(null);
    generationDone.current = false;
    setScreen("intro");
    setAnimKey((k) => k + 1);
    window.scrollTo({ top: 0 });
  };

  const swapTrip = () => {
    if (trips.length <= 1) {
      generateTrip(true);
      return;
    }
    setTripIndex((i) => (i + 1) % trips.length);
    setAnimKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pickMood = (m: Mood) => {
    setMoodId(m.id);
    advance();
  };

  // Generate itinerary via DeepSeek AI
  const generateTrip = async (append = false) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setAiError(null);
    generationDone.current = false;

    try {
      const currentMood = moodId ? MOOD_BY_ID[moodId] : MOODS[0];
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moodId: currentMood.id,
          moodName: currentMood.name,
          moodFeels: currentMood.feels,
          moodGo: currentMood.go,
          moodDoing: currentMood.doing,
          preferences: prefs,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate itinerary");
      }

      const data = await response.json();

      if (append) {
        setAiTrips((prev) => [...prev, data.itinerary]);
        setTripIndex((prev) => prev + 1);
        setAnimKey((k) => k + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setAiTrips([data.itinerary]);
        setTripIndex(0);
      }
    } catch (err) {
      console.error("AI generation failed:", err);
      setAiError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
      generationDone.current = true;
    }
  };

  // Start generation and go to the sample/wait screen
  const startCuration = () => {
    generateTrip();
    advance();
  };

  let view: React.ReactNode;
  switch (screen) {
    case "intro":
      view = (
        <IntroScreen
          onStart={(name) => {
            setUserName(name);
            advance();
          }}
        />
      );
      break;
    case "mood":
      view = <MoodGrid userName={userName} onPick={pickMood} onBack={back} />;
      break;
    case "confirm":
      view = (
        <MoodConfirm mood={mood} userName={userName} onContinue={() => advance()} onBack={back} />
      );
      break;
    case "loadMood":
      view = (
        <Loading
          mood={mood}
          beats={LOADING_BEATS.mood}
          duration={2200}
          onDone={() => advance({ push: false })}
        />
      );
      break;
    case "prefs":
      view = (
        <Preferences
          mood={mood}
          userName={userName}
          prefs={prefs}
          setPrefs={setPrefs}
          onContinue={startCuration}
          onBack={back}
        />
      );
      break;
    case "sample":
      view = (
        <SampleTeaser
          mood={mood}
          userName={userName}
          isGenerating={isGenerating}
          generationDone={generationDone.current}
          aiError={aiError}
          onDone={() => advance({ push: false })}
          onBack={back}
        />
      );
      break;
    case "itinerary":
      view = (
        <ItineraryScreen
          mood={mood}
          prefs={prefs}
          userName={userName}
          trip={trips[tripIndex] || ITINERARIES[0]}
          tripIndex={tripIndex}
          tripTotal={trips.length}
          onSwap={swapTrip}
          onSend={() => advance()}
          onBack={back}
        />
      );
      break;
    case "inbox":
      view = (
        <InboxScreen
          mood={mood}
          userName={userName}
          prefs={prefs}
          trip={trips[tripIndex] || ITINERARIES[0]}
          onRestart={reset}
        />
      );
      break;
    default:
      view = <IntroScreen onStart={() => advance()} />;
  }

  return <div key={animKey}>{view}</div>;
}
