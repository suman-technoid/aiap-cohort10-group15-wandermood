-- Allow anonymous updates on trips (needed for adding email after generation)
CREATE POLICY "Allow anonymous update" ON trips
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow anonymous select on trips (needed to find existing trip)
CREATE POLICY "Allow anonymous select" ON trips
  FOR SELECT
  USING (true);
