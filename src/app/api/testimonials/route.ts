import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const moodId = searchParams.get("mood");

  if (!moodId) {
    return NextResponse.json({ error: "mood parameter required" }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("mood_id", moodId);

  if (error) {
    console.error("Testimonials fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }

  // Pick a random testimonial from the results
  if (data && data.length > 0) {
    const random = data[Math.floor(Math.random() * data.length)];
    return NextResponse.json({ testimonial: random });
  }

  return NextResponse.json({ testimonial: null });
}
