import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { moodId, moodName, preferences, itinerary } = body;

    if (!moodId || !itinerary) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase.from("trips").insert({
      email: "",
      mood_id: moodId,
      mood_name: moodName || "",
      preferences: preferences || {},
      itinerary,
      status: "pending",
    }).select("id").single();

    if (error) {
      console.error("Save trip error:", error.message, error.details, error.hint);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(">>> Trip saved to DB:", data.id, "mood:", moodId);
    return NextResponse.json({ success: true, tripId: data.id });
  } catch (err) {
    console.error("Save trip exception:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
