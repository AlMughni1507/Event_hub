-- Migration: Set first active event as highlighted
-- This ensures homepage has a featured event

-- First, remove all highlights
UPDATE events SET is_highlighted = 0;

-- Then set the first upcoming event as highlighted
UPDATE events 
SET is_highlighted = 1 
WHERE id = (
  SELECT id FROM (
    SELECT id 
    FROM events 
    WHERE is_active = 1 
      AND status = 'published' 
      AND event_date >= CURDATE()
    ORDER BY event_date ASC 
    LIMIT 1
  ) as temp
);

-- If no upcoming events, highlight the most recent event
UPDATE events 
SET is_highlighted = 1 
WHERE is_highlighted = 0 
  AND id = (
    SELECT id FROM (
      SELECT id 
      FROM events 
      WHERE is_active = 1 
        AND status = 'published'
      ORDER BY created_at DESC 
      LIMIT 1
    ) as temp2
  )
LIMIT 1;
