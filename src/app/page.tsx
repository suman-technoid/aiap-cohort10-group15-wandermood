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
    setHasGeneratedMore(false);
    setSwapLoading(false);
    generationDone.current = false;
    setScreen("intro");
    setAnimKey((k) => k + 1);
    window.scrollTo({ top: 0 });
  };

  const [swapLoading, setSwapLoading] = useState(false);
  const [hasGeneratedMore, setHasGeneratedMore] = useState(false);

  const swapTrip = () => {
    // Cycle through options infinitely
    if (trips.length > 1) {
      setTripIndex((i) => (i + 1) % trips.length);
      setAnimKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate 2 more options (check DB first, then AI)
  const generateMoreTrips = async () => {
    if (swapLoading || hasGeneratedMore) return;
    setSwapLoading(true);

    const currentMood = moodId ? MOOD_BY_ID[moodId] : MOODS[0];
    // Collect existing trip titles to avoid duplicates
    const existingTitles = trips.map((t) => t.title.toLowerCase());

    try {
      // First, check DB for existing matching trips
      const dbRes = await fetch(
        `/api/matching-trips?mood=${currentMood.id}&budget=${prefs.budget}&scope=${prefs.scope}&length=${prefs.length}&company=${prefs.company}`
      );
      let dbTrips: Itinerary[] = [];
      if (dbRes.ok) {
        const dbData = await dbRes.json();
        dbTrips = dbData.trips || [];
      }

      // Filter out trips with same titles as existing ones
      dbTrips = dbTrips.filter(
        (t) => !existingTitles.includes(t.title.toLowerCase())
      );

      const needed = 2 - dbTrips.length;
      const newTrips: Itinerary[] = [...dbTrips.slice(0, 2)];

      // Generate remaining via AI — pass existing titles to avoid duplicates
      for (let i = 0; i < Math.max(0, needed); i++) {
        try {
          const allTitles = [...existingTitles, ...newTrips.map((t) => t.title.toLowerCase())];
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
              existingTitles: allTitles,
            }),
          });
          if (response.ok) {
            const data = await response.json();
            if (!existingTitles.includes(data.itinerary.title.toLowerCase())) {
              newTrips.push(data.itinerary);
            }
          }
        } catch {
          // Skip failed generation
        }
      }

      if (newTrips.length > 0) {
        setAiTrips((prev) => [...prev, ...newTrips]);
      }
      setHasGeneratedMore(true);
    } catch (err) {
      console.error("Generate more failed:", err);
    } finally {
      setSwapLoading(false);
    }
  };

  // Session ID for analytics (persists across the session)
  const sessionId = useRef(
    typeof window !== "undefined"
      ? sessionStorage.getItem("wm_session") || Math.random().toString(36).slice(2)
      : "ssr"
  );
  if (typeof window !== "undefined" && !sessionStorage.getItem("wm_session")) {
    sessionStorage.setItem("wm_session", sessionId.current);
  }

  const pickMood = (m: Mood) => {
    setMoodId(m.id);
    // Track mood selection in analytics
    fetch("/api/track-mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moodId: m.id, sessionId: sessionId.current }),
    }).catch(() => {});
    advance();
  };

  // Save an itinerary to Supabase
  const saveTrip = (itinerary: Itinerary) => {
    const currentMood = moodId ? MOOD_BY_ID[moodId] : MOODS[0];
    fetch("/api/save-trip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        moodId: currentMood.id,
        moodName: currentMood.name,
        preferences: prefs,
        itinerary,
      }),
    }).catch(() => {});
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
      // Save the fallback static itinerary to DB
      const fallbackTrip = ITINERARIES[Math.floor(Math.random() * ITINERARIES.length)];
      saveTrip(fallbackTrip);
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
      view = <MoodGrid userName={userName} onPick={pickMood} onBack={back} onHome={reset} />;
      break;
    case "confirm":
      view = (
        <MoodConfirm mood={mood} userName={userName} onContinue={() => advance()} onBack={back} onHome={reset} />
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
          onHome={reset}
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
          onHome={reset}
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
          onGenerateMore={generateMoreTrips}
          swapDisabled={hasGeneratedMore}
          swapLoading={swapLoading}
          onSend={() => advance()}
          onBack={back}
          onHome={reset}
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
          onHome={reset}
        />
      );
      break;
    default:
      view = <IntroScreen onStart={() => advance()} />;
  }

  return <div key={animKey}>{view}</div>;
}
