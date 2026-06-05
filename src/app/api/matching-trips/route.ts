import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const moodId = searchParams.get("mood");
  const budget = searchParams.get("budget");
  const scope = searchParams.get("scope");
  const length = searchParams.get("length");
  const company = searchParams.get("company");

  if (!moodId) {
    return NextResponse.json({ trips: [] });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Find trips matching the same mood and preferences
  const { data, error } = await supabase
    .from("trips")
    .select("itinerary")
    .eq("mood_id", moodId)
    .contains("preferences", { budget, scope, length, company })
    .not("itinerary", "eq", "{}")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Matching trips fetch error:", error);
    return NextResponse.json({ trips: [] });
  }

  // Extract the itinerary JSON from each row
  const trips = (data || [])
    .map((row) => row.itinerary)
    .filter((it) => it && it.title && it.days);

  return NextResponse.json({ trips });
}
