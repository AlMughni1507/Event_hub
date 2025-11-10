-- Restore events that were accidentally archived or deactivated
UPDATE events 
SET is_active = 1, 
    status = 'published' 
WHERE (status = 'archived' OR is_active = 0)
  AND event_date >= CURDATE();

-- Show restored events
SELECT id, title, status, is_active, event_date 
FROM events 
WHERE event_date >= CURDATE()
ORDER BY event_date ASC;
