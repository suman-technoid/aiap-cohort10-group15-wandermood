-- Wondermood Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trips table: stores each itinerary request sent to a user
CREATE TABLE IF NOT EXISTS trips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL,
  mood_id TEXT NOT NULL,
  mood_name TEXT NOT NULL,
  preferences JSONB NOT NULL DEFAULT '{}',
  itinerary JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed'))
);

-- Index for querying trips by email
CREATE INDEX idx_trips_email ON trips(email);

-- Index for querying trips by status (useful for retry logic)
CREATE INDEX idx_trips_status ON trips(status);

-- Index for querying trips by mood
CREATE INDEX idx_trips_mood_id ON trips(mood_id);

-- Analytics table: tracks mood selections (lightweight, no PII)
CREATE TABLE IF NOT EXISTS moods_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  mood_id TEXT NOT NULL,
  session_id TEXT NOT NULL
);

-- Index for analytics queries
CREATE INDEX idx_moods_analytics_mood_id ON moods_analytics(mood_id);
CREATE INDEX idx_moods_analytics_created_at ON moods_analytics(created_at);

-- Row Level Security (RLS)
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts to trips (for the public form)
CREATE POLICY "Allow anonymous insert" ON trips
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow anonymous inserts to moods_analytics
CREATE POLICY "Allow anonymous insert analytics" ON moods_analytics
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow service role to read/update trips (for n8n webhook status updates)
CREATE POLICY "Service role full access" ON trips
  FOR ALL
  USING (true)
  WITH CHECK (true);
