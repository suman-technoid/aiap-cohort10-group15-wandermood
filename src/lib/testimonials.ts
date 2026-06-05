// Static fallback testimonials — used when Supabase is not configured

export interface Testimonial {
  mood_id: string;
  traveler_name: string;
  trip_type: string;
  quote: string;
  trip_title: string;
  place: string;
  stats: { label: string; value: string }[];
}

export const TESTIMONIALS: Testimonial[] = [
  {
    mood_id: "unwind",
    traveler_name: "Aarav",
    trip_type: "Solo wellness trip",
    quote: "I almost didn't go. Three days in, somewhere on a houseboat in Alleppey, I realised I hadn't checked my phone since breakfast. That's when it clicked — this was exactly what I needed.",
    trip_title: "The Backwater Drift",
    place: "Alleppey, Kerala",
    stats: [{ label: "Days", value: "4" }, { label: "Budget", value: "₹19k" }, { label: "Pace", value: "Easy" }, { label: "Best for", value: "Solo" }],
  },
  {
    mood_id: "adventure",
    traveler_name: "Rohan",
    trip_type: "Friends trekking trip",
    quote: "The last 200 metres to the summit, my legs were screaming. Then I looked up and the entire valley opened up below. I actually cried. No shame.",
    trip_title: "The Ridge Walker",
    place: "Manali, Himachal Pradesh",
    stats: [{ label: "Days", value: "5" }, { label: "Budget", value: "₹24k" }, { label: "Pace", value: "Active" }, { label: "Best for", value: "Friends" }],
  },
  {
    mood_id: "romance",
    traveler_name: "Ananya & Vikram",
    trip_type: "Anniversary trip",
    quote: "We renewed our vows in a 400-year-old haveli courtyard at sunset. The owner brought out champagne. Udaipur has this way of making ordinary moments feel like cinema.",
    trip_title: "The Lake City Love Letter",
    place: "Udaipur, Rajasthan",
    stats: [{ label: "Days", value: "4" }, { label: "Budget", value: "₹35k" }, { label: "Pace", value: "Easy" }, { label: "Best for", value: "Couple" }],
  },
  {
    mood_id: "party",
    traveler_name: "Karthik",
    trip_type: "Friends trip",
    quote: "We planned nothing. Showed up in Goa, followed the music, and somehow ended up at a secret beach party at 3 AM with people from six different countries. Legendary.",
    trip_title: "The Accidental Rave",
    place: "North Goa, India",
    stats: [{ label: "Days", value: "4" }, { label: "Budget", value: "₹22k" }, { label: "Pace", value: "Wild" }, { label: "Best for", value: "Friends" }],
  },
  {
    mood_id: "culture",
    traveler_name: "Siddharth",
    trip_type: "Solo exploration",
    quote: "I got lost in the lanes of Jaipur's old city and ended up in a block-printing workshop. The artisan let me try. My hands were blue for three days and I loved every second.",
    trip_title: "The Pink City Wander",
    place: "Jaipur, Rajasthan",
    stats: [{ label: "Days", value: "4" }, { label: "Budget", value: "₹18k" }, { label: "Pace", value: "Easy" }, { label: "Best for", value: "Solo" }],
  },
  {
    mood_id: "nature",
    traveler_name: "Arjun",
    trip_type: "Solo retreat",
    quote: "I woke at 5 AM to mist rolling over the coffee plantation. No sound except birds. I made a filter coffee and just sat there for an hour. That silence healed something in me.",
    trip_title: "The Misty Morning",
    place: "Coorg, Karnataka",
    stats: [{ label: "Days", value: "3" }, { label: "Budget", value: "₹14k" }, { label: "Pace", value: "Easy" }, { label: "Best for", value: "Solo" }],
  },
  {
    mood_id: "foodie",
    traveler_name: "Rahul",
    trip_type: "Solo food crawl",
    quote: "I ate 11 different biryanis in three days. Shadab, Paradise, Bawarchi — I ranked them all. My stomach protested but my soul was full. Hyderabad is a religion.",
    trip_title: "The Biryani Pilgrimage",
    place: "Hyderabad, Telangana",
    stats: [{ label: "Days", value: "3" }, { label: "Budget", value: "₹12k" }, { label: "Pace", value: "Easy" }, { label: "Best for", value: "Solo" }],
  },
  {
    mood_id: "solo",
    traveler_name: "Ishaan",
    trip_type: "Solo reset",
    quote: "Pondicherry gave me permission to do nothing with intention. Morning coffee at the promenade, afternoon at a bookshop, evening journaling by the beach. I found myself again.",
    trip_title: "The Quiet Reboot",
    place: "Pondicherry, India",
    stats: [{ label: "Days", value: "4" }, { label: "Budget", value: "₹15k" }, { label: "Pace", value: "Easy" }, { label: "Best for", value: "Solo" }],
  },
  {
    mood_id: "pickmeup",
    traveler_name: "Nikhil",
    trip_type: "Solo recovery trip",
    quote: "I was burnt out and barely functioning. Three days in Goa — sleeping till noon, eating fish curry, floating in warm water — and I remembered what joy feels like.",
    trip_title: "The Gentle Reset",
    place: "South Goa, India",
    stats: [{ label: "Days", value: "4" }, { label: "Budget", value: "₹18k" }, { label: "Pace", value: "Lazy" }, { label: "Best for", value: "Solo" }],
  },
];

export function getTestimonialForMood(moodId: string): Testimonial {
  const matching = TESTIMONIALS.filter((t) => t.mood_id === moodId);
  if (matching.length > 0) {
    return matching[Math.floor(Math.random() * matching.length)];
  }
  // Fallback to first testimonial
  return TESTIMONIALS[0];
}
