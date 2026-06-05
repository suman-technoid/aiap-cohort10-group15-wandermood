// WanderMood — data: moods, itineraries, loading beats

export interface Mood {
  id: string;
  emoji: string;
  name: string;
  line: string;
  feels: string;
  hue: number;
  chroma: number;
  go: string[];
  doing: string[];
  featured?: boolean;
}

export interface TripStat {
  label: string;
  value: string;
}

export interface DayItem {
  time: string;
  text: string;
}

export interface TripDay {
  n: number;
  title: string;
  photo: string;
  items: DayItem[];
}

export interface Itinerary {
  title: string;
  subtitle: string;
  place: string;
  range: string;
  hero: string;
  summary: string;
  stats: TripStat[];
  days: TripDay[];
  tips: string[];
  packing: string[];
}

export interface SampleTripData {
  traveler: {
    name: string;
    age: number;
    from: string;
    type: string;
    quote: string;
    photo: string;
  };
  title: string;
  place: string;
  blurb: string;
  stats: TripStat[];
}

export interface MoodColors {
  glow: string;
  deep: string;
  bright: string;
  soft: string;
  ink: string;
  chipBg: string;
  chipBorder: string;
}

export const MOODS: Mood[] = [
  {
    id: "unwind",
    emoji: "😌",
    name: "Unwind",
    line: "I need to switch off.",
    feels: "Slow mornings, no alarms, nothing to prove.",
    hue: 196,
    chroma: 0.09,
    go: ["Goa", "Kerala backwaters", "Bali", "Maldives", "Santorini"],
    doing: ["beach lounging", "spa", "yoga", "long café breakfasts", "sunset watching"],
  },
  {
    id: "adventure",
    emoji: "⚡",
    name: "Adventure",
    line: "I want my heart racing.",
    feels: "Adrenaline, effort, earning the view.",
    hue: 48,
    chroma: 0.15,
    go: ["Rishikesh", "Manali", "Queenstown", "Swiss Alps", "Costa Rica"],
    doing: ["trekking", "rafting", "paragliding", "scuba", "ziplining"],
  },
  {
    id: "romance",
    emoji: "❤️",
    name: "Romance",
    line: "Just the two of us.",
    feels: "Intimate, scenic, a little indulgent.",
    hue: 12,
    chroma: 0.12,
    go: ["Udaipur", "Paris", "Venice", "Kyoto", "Tuscany"],
    doing: ["candlelit dinners", "sunset cruises", "couples' spa", "vineyard tours"],
  },
  {
    id: "party",
    emoji: "🎉",
    name: "Party",
    line: "Energy and people.",
    feels: "Nightlife, music, staying out late.",
    hue: 330,
    chroma: 0.14,
    go: ["Goa", "Ibiza", "Bangkok", "Berlin", "Mykonos"],
    doing: ["clubs", "beach parties", "festivals", "bar crawls", "live gigs"],
  },
  {
    id: "culture",
    emoji: "🏛️",
    name: "Culture",
    line: "I want to wander and learn.",
    feels: "Curiosity, history, local life.",
    hue: 70,
    chroma: 0.11,
    go: ["Jaipur", "Istanbul", "Rome", "Cairo", "Kyoto"],
    doing: ["heritage walks", "museums", "food tours", "temples", "markets"],
  },
  {
    id: "nature",
    emoji: "🌿",
    name: "Nature",
    line: "Somewhere green and quiet.",
    feels: "Fresh air, big landscapes, slowing down.",
    hue: 150,
    chroma: 0.1,
    go: ["Coorg", "Munnar", "Banff", "Norway fjords", "Kruger safari"],
    doing: ["hikes", "safaris", "camping", "stargazing", "waterfalls"],
  },
  {
    id: "foodie",
    emoji: "🍜",
    name: "Foodie",
    line: "I'm here to eat.",
    feels: "The trip is the meals.",
    hue: 30,
    chroma: 0.14,
    go: ["Hyderabad", "Bangkok", "Tokyo", "Naples", "Hanoi"],
    doing: ["street-food crawls", "cooking classes", "fine dining", "tastings"],
  },
  {
    id: "solo",
    emoji: "🧘",
    name: "Solo Reset",
    line: "Time with myself.",
    feels: "Reflective, easy, safe to travel alone.",
    hue: 282,
    chroma: 0.1,
    go: ["Pondicherry", "Lisbon", "Ubud", "Chiang Mai"],
    doing: ["journaling cafés", "walking tours", "meditation", "coworking"],
  },
  {
    id: "pickmeup",
    emoji: "🌞",
    name: "Pick-me-up",
    line: "I'm feeling low — cheer me up.",
    feels: "Gentle, sunny, comforting, zero stress.",
    hue: 88,
    chroma: 0.14,
    featured: true,
    go: ["Goa", "Pondicherry", "easy warm beach towns"],
    doing: ["sunshine", "comfort food", "light nature", "nothing demanding"],
  },
];

export const MOOD_BY_ID: Record<string, Mood> = Object.fromEntries(
  MOODS.map((m) => [m.id, m])
);

export function moodColors(m: Mood): MoodColors {
  const h = m.hue;
  const c = m.chroma;
  return {
    glow: `oklch(0.62 ${c} ${h})`,
    deep: `oklch(0.34 ${c * 0.8} ${h})`,
    bright: `oklch(0.78 ${c} ${h})`,
    soft: `oklch(0.88 ${c * 0.5} ${h})`,
    ink: `oklch(0.20 ${c * 0.7} ${h})`,
    chipBg: `oklch(0.32 ${c * 0.6} ${h} / 0.55)`,
    chipBorder: `oklch(0.72 ${c} ${h} / 0.35)`,
  };
}

export function moodAtmosphere(m: Mood, { dim = false } = {}): string {
  const h = m.hue;
  const c = m.chroma;
  const a = dim ? 0.7 : 1;
  return [
    `radial-gradient(120% 90% at 18% 12%, oklch(0.72 ${c} ${h} / ${0.55 * a}) 0%, transparent 55%)`,
    `radial-gradient(110% 100% at 88% 22%, oklch(0.60 ${c} ${(h + 30) % 360} / ${0.5 * a}) 0%, transparent 50%)`,
    `radial-gradient(130% 120% at 70% 110%, oklch(0.46 ${c} ${(h + 340) % 360} / ${0.7 * a}) 0%, transparent 60%)`,
    `linear-gradient(160deg, oklch(0.30 ${c * 0.7} ${h}) 0%, oklch(0.17 ${c * 0.5} ${(h + 20) % 360}) 100%)`,
  ].join(", ");
}

export const SAMPLE_TRIP: SampleTripData = {
  traveler: {
    name: "Aarav",
    age: 27,
    from: "Bengaluru",
    type: "Solo trekking trip",
    quote:
      "I almost didn't go. Three days in, somewhere above the clouds in Manali, I realised I hadn't checked my phone since breakfast. That's when it clicked — this was exactly what I needed.",
    photo: "Aarav on the ridge at golden hour",
  },
  title: "The Switch-Off Trek",
  place: "Manali, Himachal Pradesh",
  blurb: "5 quiet days of mountain air, slow mornings and one very big view.",
  stats: [
    { label: "Days", value: "5" },
    { label: "Budget", value: "₹24k" },
    { label: "Pace", value: "Easy" },
    { label: "Best for", value: "Solo" },
  ],
};

export const ITINERARIES: Itinerary[] = [
  {
    title: "Backwater drift",
    subtitle: "Kerala backwaters, slow and golden",
    place: "Alleppey & Kumarakom, Kerala",
    range: "Thu 18 – Sun 21 Sep",
    hero: "Houseboat drifting through palm-lined backwaters at sunset",
    summary:
      "Four unhurried days on the water. No alarms, no itinerary you have to keep — just slow boats, coconut breakfasts and long golden evenings.",
    stats: [
      { label: "Length", value: "4 days" },
      { label: "Budget", value: "₹19,500" },
      { label: "Travel", value: "Domestic" },
      { label: "Pace", value: "Jiffy+" },
    ],
    days: [
      {
        n: 1,
        title: "Arrive & exhale",
        photo: "Backwater jetty, Alleppey",
        items: [
          { time: "2:00 PM", text: "Check in to a private houseboat at Alleppey jetty" },
          { time: "4:30 PM", text: "Slow cruise through narrow canals, tea on the deck" },
          { time: "7:30 PM", text: "Karimeen fish fry dinner cooked onboard" },
        ],
      },
      {
        n: 2,
        title: "Nothing on the agenda",
        photo: "Coconut breakfast on the deck",
        items: [
          { time: "8:00 AM", text: "Coconut & appam breakfast as the mist lifts" },
          { time: "11:00 AM", text: "Village walk through Kumarakom paddy fields" },
          { time: "5:00 PM", text: "Sunset kayak through the lily channels" },
        ],
      },
      {
        n: 3,
        title: "Slow & golden",
        photo: "Ayurvedic spa pavilion",
        items: [
          { time: "9:30 AM", text: "Ayurvedic massage at a lakeside spa" },
          { time: "1:00 PM", text: "Sadya banana-leaf lunch, then a long nap" },
          { time: "6:30 PM", text: "Read on the deck as the fishermen head out" },
        ],
      },
      {
        n: 4,
        title: "One last morning",
        photo: "Misty backwater dawn",
        items: [
          { time: "6:30 AM", text: "Dawn birdwatching at Kumarakom sanctuary" },
          { time: "10:00 AM", text: "Final cruise back, coffee in hand" },
          { time: "12:30 PM", text: "Check out — carry the calm home" },
        ],
      },
    ],
    tips: [
      "Carry light cotton + one warm layer for early mornings on the water.",
      "Houseboats go offline — download your music & maps before you board.",
      "Tip the boat crew in cash; ₹500–800/day is generous and kind.",
      "Monsoon tail means surprise showers — a light poncho beats an umbrella.",
    ],
    packing: [
      "Linen shirts",
      "Sandals + flip-flops",
      "Sunscreen SPF 50",
      "Reusable water bottle",
      "Mosquito repellent",
      "A paperback",
      "Power bank",
      "Light rain layer",
    ],
  },
  {
    title: "Coffee-hill hush",
    subtitle: "Coorg, misty and green",
    place: "Coorg, Karnataka",
    range: "Fri 12 – Mon 15 Sep",
    hero: "Mist rolling over a coffee estate at dawn",
    summary:
      "Three slow days in the coffee hills — cool air, plantation walks and the sound of rain on a tin roof.",
    stats: [
      { label: "Length", value: "3 days" },
      { label: "Budget", value: "₹16,800" },
      { label: "Travel", value: "Domestic" },
      { label: "Pace", value: "Easy" },
    ],
    days: [
      {
        n: 1,
        title: "Into the hills",
        photo: "Plantation homestay verandah",
        items: [
          { time: "1:00 PM", text: "Check in to a coffee-estate homestay" },
          { time: "4:00 PM", text: "Guided walk through the plantation" },
          { time: "7:30 PM", text: "Coorgi pandi curry dinner by the fire" },
        ],
      },
      {
        n: 2,
        title: "Green and quiet",
        photo: "Abbey Falls through the trees",
        items: [
          { time: "7:30 AM", text: "Birdsong & filter coffee on the verandah" },
          { time: "11:00 AM", text: "Easy trek to Abbey Falls" },
          { time: "5:00 PM", text: "Hammock and a book as the mist returns" },
        ],
      },
      {
        n: 3,
        title: "One slow goodbye",
        photo: "Estate breakfast spread",
        items: [
          { time: "8:00 AM", text: "Lazy estate breakfast" },
          { time: "10:30 AM", text: "Pick up fresh-roasted beans to take home" },
          { time: "12:00 PM", text: "Drive back, windows down" },
        ],
      },
    ],
    tips: [
      "Hills get cold after dark — pack a proper jacket, not just a hoodie.",
      "Roads are windy; carry motion-sickness tablets if you're prone.",
      "Buy coffee straight from the estate — fresher and cheaper than town.",
      "Network is patchy; tell people you'll be slow to reply.",
    ],
    packing: [
      "Warm jacket",
      "Walking shoes",
      "Rain layer",
      "Power bank",
      "Coffee flask",
      "A book",
      "Insect repellent",
      "Cosy socks",
    ],
  },
  {
    title: "Slow Goa",
    subtitle: "The unhurried north coast",
    place: "North Goa",
    range: "Thu 18 – Sun 21 Sep",
    hero: "Empty Morjim beach at golden hour",
    summary:
      "Four soft days of beach cafés, slow swims and sunsets — the quiet side of Goa, away from the crowds.",
    stats: [
      { label: "Length", value: "4 days" },
      { label: "Budget", value: "₹21,000" },
      { label: "Travel", value: "Domestic" },
      { label: "Pace", value: "Easy" },
    ],
    days: [
      {
        n: 1,
        title: "Land & slow down",
        photo: "Quiet Assagao guesthouse",
        items: [
          { time: "12:30 PM", text: "Check in to a quiet Assagao guesthouse" },
          { time: "4:30 PM", text: "Scooter to Morjim for a first swim" },
          { time: "7:00 PM", text: "Beach-shack dinner, feet in the sand" },
        ],
      },
      {
        n: 2,
        title: "Café and sea",
        photo: "Garden café breakfast",
        items: [
          { time: "9:00 AM", text: "Long breakfast at a garden café" },
          { time: "12:00 PM", text: "Hammock and swim at Ashwem" },
          { time: "6:00 PM", text: "Sunset at Mandrem with a cold drink" },
        ],
      },
      {
        n: 3,
        title: "Drift",
        photo: "Beach yoga at sunrise",
        items: [
          { time: "8:00 AM", text: "Yoga on the sand" },
          { time: "1:00 PM", text: "Goan fish thali lunch" },
          { time: "5:30 PM", text: "Kayak the calm Chapora backwater" },
        ],
      },
      {
        n: 4,
        title: "Last swim",
        photo: "Empty beach morning walk",
        items: [
          { time: "7:00 AM", text: "Empty-beach morning walk" },
          { time: "10:00 AM", text: "Final café breakfast" },
          { time: "1:00 PM", text: "Pack up, salt still in your hair" },
        ],
      },
    ],
    tips: [
      "Rent a scooter — it's the only sane way to hop between beaches.",
      "North Goa's quiet beaches (Morjim, Ashwem, Mandrem) beat the busy south for unwinding.",
      "Carry cash; many beach shacks don't take cards.",
      "Slap on reef-safe sunscreen before the swim, not after.",
    ],
    packing: [
      "Swimwear",
      "Flip-flops",
      "Reef-safe SPF 50",
      "Light cottons",
      "Sunglasses",
      "Power bank",
      "Dry bag",
      "A novel",
    ],
  },
];

export const LOADING_BEATS = {
  mood: [
    "Tuning into your mood…",
    "Reading the room…",
    "Setting the scene…",
  ],
  curate: [
    "Pulling threads of a perfect trip…",
    "Checking the light at golden hour…",
    "Pacing your days just right…",
    "Folding in the little luxuries…",
  ],
  send: ["Wrapping it up with a bow…", "Sealing the envelope…"],
};
