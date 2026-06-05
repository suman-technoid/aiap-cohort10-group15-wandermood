import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, moodId, moodName, preferences, itinerary } = body;

    if (!email || !moodId || !itinerary) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Save to Supabase
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    const { data: trip, error: dbError } = await supabase
      .from("trips")
      .insert({
        email,
        mood_id: moodId,
        mood_name: moodName,
        preferences,
        itinerary,
        status: "pending",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save trip" },
        { status: 500 }
      );
    }

    // Trigger n8n webhook to send email
    try {
      const n8nPayload = {
        tripId: trip.id,
        email,
        moodName,
        moodEmoji: body.moodEmoji || "",
        preferences,
        itinerary: {
          title: itinerary.title,
          place: itinerary.place,
          range: itinerary.range,
          summary: itinerary.summary,
          stats: itinerary.stats,
          days: itinerary.days,
          tips: itinerary.tips,
          packing: itinerary.packing,
        },
      };

      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n8nPayload),
      });

      if (n8nResponse.ok) {
        // Update trip status to sent
        await supabase
          .from("trips")
          .update({ status: "sent" })
          .eq("id", trip.id);
      } else {
        console.error("n8n webhook failed:", n8nResponse.status);
        await supabase
          .from("trips")
          .update({ status: "failed" })
          .eq("id", trip.id);
      }
    } catch (webhookError) {
      console.error("n8n webhook error:", webhookError);
      // Don't fail the request — trip is saved, email can be retried
      await supabase
        .from("trips")
        .update({ status: "failed" })
        .eq("id", trip.id);
    }

    return NextResponse.json({
      success: true,
      tripId: trip.id,
    });
  } catch (error) {
    console.error("Send itinerary error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
