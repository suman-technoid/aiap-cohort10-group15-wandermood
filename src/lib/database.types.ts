export interface Database {
  public: {
    Tables: {
      trips: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          mood_id: string;
          mood_name: string;
          preferences: TripPreferences;
          itinerary: ItineraryData;
          status: "pending" | "sent" | "failed";
        };
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
          mood_id: string;
          mood_name: string;
          preferences: TripPreferences;
          itinerary: ItineraryData;
          status?: "pending" | "sent" | "failed";
        };
        Update: Partial<Database["public"]["Tables"]["trips"]["Insert"]>;
      };
      moods_analytics: {
        Row: {
          id: string;
          created_at: string;
          mood_id: string;
          session_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          mood_id: string;
          session_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["moods_analytics"]["Insert"]>;
      };
    };
  };
}

export interface TripPreferences {
  budget: string;
  scope: string;
  length: string;
  company: string;
}

export interface ItineraryData {
  title: string;
  subtitle: string;
  place: string;
  range: string;
  hero: string;
  summary: string;
  stats: { label: string; value: string }[];
  days: {
    n: number;
    title: string;
    photo: string;
    items: { time: string; text: string }[];
  }[];
  tips: string[];
  packing: string[];
}
