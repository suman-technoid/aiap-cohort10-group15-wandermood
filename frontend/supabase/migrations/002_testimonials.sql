-- Testimonials table: stores traveler stories per mood
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mood_id TEXT NOT NULL,
  traveler_name TEXT NOT NULL,
  trip_type TEXT NOT NULL,
  quote TEXT NOT NULL,
  trip_title TEXT NOT NULL,
  place TEXT NOT NULL,
  stats JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_testimonials_mood_id ON testimonials(mood_id);

-- RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read testimonials" ON testimonials
  FOR SELECT USING (true);

-- Seed testimonials for all 9 moods
INSERT INTO testimonials (mood_id, traveler_name, trip_type, quote, trip_title, place, stats) VALUES

-- Unwind
('unwind', 'Aarav', 'Solo wellness trip', 'I almost didn''t go. Three days in, somewhere on a houseboat in Alleppey, I realised I hadn''t checked my phone since breakfast. That''s when it clicked — this was exactly what I needed.', 'The Backwater Drift', 'Alleppey, Kerala', '[{"label":"Days","value":"4"},{"label":"Budget","value":"₹19k"},{"label":"Pace","value":"Easy"},{"label":"Best for","value":"Solo"}]'),

('unwind', 'Meera', 'Couple retreat', 'We told ourselves we''d "explore" but ended up spending three days between the pool, the spa, and a single restaurant we fell in love with. Best trip we ever took.', 'The Do-Nothing Escape', 'Goa, India', '[{"label":"Days","value":"5"},{"label":"Budget","value":"₹28k"},{"label":"Pace","value":"Lazy"},{"label":"Best for","value":"Couple"}]'),

-- Adventure
('adventure', 'Rohan', 'Friends trekking trip', 'The last 200 metres to the summit, my legs were screaming. Then I looked up and the entire valley opened up below. I actually cried. No shame.', 'The Ridge Walker', 'Manali, Himachal Pradesh', '[{"label":"Days","value":"5"},{"label":"Budget","value":"₹24k"},{"label":"Pace","value":"Active"},{"label":"Best for","value":"Friends"}]'),

('adventure', 'Priya', 'Solo adventure', 'I''d never done anything like rafting before. The rapids hit and I was terrified — then I was laughing. By day three I was jumping off cliffs into the Ganges.', 'The River Rush', 'Rishikesh, Uttarakhand', '[{"label":"Days","value":"4"},{"label":"Budget","value":"₹16k"},{"label":"Pace","value":"Active"},{"label":"Best for","value":"Solo"}]'),

-- Romance
('romance', 'Ananya & Vikram', 'Anniversary trip', 'We renewed our vows in a 400-year-old haveli courtyard at sunset. The owner brought out champagne. Udaipur has this way of making ordinary moments feel like cinema.', 'The Lake City Love Letter', 'Udaipur, Rajasthan', '[{"label":"Days","value":"4"},{"label":"Budget","value":"₹35k"},{"label":"Pace","value":"Easy"},{"label":"Best for","value":"Couple"}]'),

('romance', 'Sneha', 'Honeymoon', 'Paris was the cliché we didn''t know we needed. Croissants for breakfast, walks along the Seine, and a tiny wine bar we stumbled into at midnight. Pure magic.', 'The Seine Stroll', 'Paris, France', '[{"label":"Days","value":"6"},{"label":"Budget","value":"$3,200"},{"label":"Pace","value":"Easy"},{"label":"Best for","value":"Couple"}]'),

-- Party
('party', 'Karthik', 'Friends trip', 'We planned nothing. Showed up in Goa, followed the music, and somehow ended up at a secret beach party at 3 AM with people from six different countries. Legendary.', 'The Accidental Rave', 'North Goa, India', '[{"label":"Days","value":"4"},{"label":"Budget","value":"₹22k"},{"label":"Pace","value":"Wild"},{"label":"Best for","value":"Friends"}]'),

('party', 'Diya', 'Girls trip', 'Berlin doesn''t sleep and neither did we. Four nights of techno, street food at sunrise, and conversations with strangers that felt like old friends.', 'The Endless Night', 'Berlin, Germany', '[{"label":"Days","value":"5"},{"label":"Budget","value":"$2,800"},{"label":"Pace","value":"Active"},{"label":"Best for","value":"Friends"}]'),

-- Culture
('culture', 'Siddharth', 'Solo exploration', 'I got lost in the lanes of Jaipur''s old city and ended up in a block-printing workshop. The artisan let me try. My hands were blue for three days and I loved every second.', 'The Pink City Wander', 'Jaipur, Rajasthan', '[{"label":"Days","value":"4"},{"label":"Budget","value":"₹18k"},{"label":"Pace","value":"Easy"},{"label":"Best for","value":"Solo"}]'),

('culture', 'Nandini', 'Family trip', 'Watching my kids'' eyes widen at the Hagia Sophia — that was worth the entire trip. They still talk about the spice market and the ice cream man who did tricks.', 'The Istanbul Chapter', 'Istanbul, Turkey', '[{"label":"Days","value":"6"},{"label":"Budget","value":"$2,400"},{"label":"Pace","value":"Moderate"},{"label":"Best for","value":"Family"}]'),

-- Nature
('nature', 'Arjun', 'Solo retreat', 'I woke at 5 AM to mist rolling over the coffee plantation. No sound except birds. I made a filter coffee and just sat there for an hour. That silence healed something in me.', 'The Misty Morning', 'Coorg, Karnataka', '[{"label":"Days","value":"3"},{"label":"Budget","value":"₹14k"},{"label":"Pace","value":"Easy"},{"label":"Best for","value":"Solo"}]'),

('nature', 'Kavya', 'Couple trip', 'We saw a leopard on the first morning safari. Our guide said he hadn''t seen one in two weeks. Kruger gave us exactly the wildness we were craving.', 'The Wild Dawn', 'Kruger, South Africa', '[{"label":"Days","value":"5"},{"label":"Budget","value":"$3,500"},{"label":"Pace","value":"Moderate"},{"label":"Best for","value":"Couple"}]'),

-- Foodie
('foodie', 'Rahul', 'Solo food crawl', 'I ate 11 different biryanis in three days. Shadab, Paradise, Bawarchi — I ranked them all. My stomach protested but my soul was full. Hyderabad is a religion.', 'The Biryani Pilgrimage', 'Hyderabad, Telangana', '[{"label":"Days","value":"3"},{"label":"Budget","value":"₹12k"},{"label":"Pace","value":"Easy"},{"label":"Best for","value":"Solo"}]'),

('foodie', 'Tara', 'Friends trip', 'We took a cooking class in a Bangkok alley — mortar and pestle, proper Thai basil, the works. That green curry I made? Still the best thing I''ve ever eaten.', 'The Street Food Gospel', 'Bangkok, Thailand', '[{"label":"Days","value":"5"},{"label":"Budget","value":"₹32k"},{"label":"Pace","value":"Easy"},{"label":"Best for","value":"Friends"}]'),

-- Solo Reset
('solo', 'Ishaan', 'Solo reset', 'Pondicherry gave me permission to do nothing with intention. Morning coffee at the promenade, afternoon at a bookshop, evening journaling by the beach. I found myself again.', 'The Quiet Reboot', 'Pondicherry, India', '[{"label":"Days","value":"4"},{"label":"Budget","value":"₹15k"},{"label":"Pace","value":"Easy"},{"label":"Best for","value":"Solo"}]'),

('solo', 'Aditi', 'Solo trip', 'I was scared to travel alone. Then Lisbon happened — the trams, the pastéis, the rooftop sunsets. I had dinner alone and loved it. That was the moment I became free.', 'The Solo Sunrise', 'Lisbon, Portugal', '[{"label":"Days","value":"5"},{"label":"Budget","value":"$1,800"},{"label":"Pace","value":"Easy"},{"label":"Best for","value":"Solo"}]'),

-- Pick-me-up
('pickmeup', 'Nikhil', 'Solo recovery trip', 'I was burnt out and barely functioning. Three days in Goa — sleeping till noon, eating fish curry, floating in warm water — and I remembered what joy feels like.', 'The Gentle Reset', 'South Goa, India', '[{"label":"Days","value":"4"},{"label":"Budget","value":"₹18k"},{"label":"Pace","value":"Lazy"},{"label":"Best for","value":"Solo"}]'),

('pickmeup', 'Riya', 'Weekend escape', 'I drove to Pondicherry on a whim after a terrible week. The French Quarter, the colours, the quiet — it was like the universe gave me a hug. I came back a different person.', 'The Colour Cure', 'Pondicherry, India', '[{"label":"Days","value":"3"},{"label":"Budget","value":"₹12k"},{"label":"Pace","value":"Easy"},{"label":"Best for","value":"Solo"}]');
