-- Migration: Add has_certificate column to events table
-- Date: 2025-10-24
-- Description: Add certificate availability flag for events

-- Add has_certificate column
ALTER TABLE events 
ADD COLUMN has_certificate BOOLEAN DEFAULT FALSE AFTER is_free;

-- Update existing events to have no certificate by default
UPDATE events SET has_certificate = FALSE WHERE has_certificate IS NULL;

-- Add index for faster queries
CREATE INDEX idx_events_has_certificate ON events(has_certificate);

-- Verify the column was added
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    COLUMN_DEFAULT, 
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'events' 
AND COLUMN_NAME = 'has_certificate';
