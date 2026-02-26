-- Alzhra Cinema | سينما الزهراء
-- Schema Repair / Migration Script
-- Run this in your Supabase SQL Editor

-- 1. Fix Movies Table
ALTER TABLE movies 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS genre_ar text,
ADD COLUMN IF NOT EXISTS genre_en text,
ADD COLUMN IF NOT EXISTS duration integer,
ADD COLUMN IF NOT EXISTS poster_url text,
ADD COLUMN IF NOT EXISTS description_ar text,
ADD COLUMN IF NOT EXISTS description_en text;

-- 2. Fix Showtimes Table
ALTER TABLE showtimes 
ADD COLUMN IF NOT EXISTS show_date date DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS show_time time DEFAULT '20:00:00',
ADD COLUMN IF NOT EXISTS hall_name_ar text,
ADD COLUMN IF NOT EXISTS hall_name_en text;

-- 3. Ensure RLS is enabled and policies exist
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE showtimes ENABLE ROW LEVEL SECURITY;

-- Drop old policies to avoid conflicts if they exist under different names
DROP POLICY IF EXISTS "Allow public read access for active movies" ON movies;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON movies;
DROP POLICY IF EXISTS "Allow public read access for showtimes" ON showtimes;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON showtimes;

-- 4. Re-apply Policies
CREATE POLICY "Allow public read access for active movies"
ON movies FOR SELECT
USING (is_active = true);

CREATE POLICY "Allow full access for authenticated users"
ON movies FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public read access for showtimes"
ON showtimes FOR SELECT
USING (true);

CREATE POLICY "Allow full access for authenticated users"
ON showtimes FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
