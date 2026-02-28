-- Alzhra Cinema | Multi-Genre Migration
-- Run this in the Supabase SQL Editor

-- 1. Add the new genres column as an array of text
ALTER TABLE movies 
ADD COLUMN IF NOT EXISTS genres text[] DEFAULT '{}';

-- 2. Migrate existing single-genre data (English) into the new array
-- This assumes genre_en contains values like 'Action', 'Drama', etc.
UPDATE movies 
SET genres = ARRAY[genre_en]
WHERE genres = '{}' AND genre_en IS NOT NULL;

-- 3. (Optional) If you want to drop old columns later, keep them for now for safety.
-- ALTER TABLE movies DROP COLUMN genre_ar;
-- ALTER TABLE movies DROP COLUMN genre_en;

-- 4. Verify the change by selecting a few rows
-- SELECT title_en, genre_en, genres FROM movies LIMIT 5;
