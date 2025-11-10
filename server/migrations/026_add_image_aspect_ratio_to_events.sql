-- Migration: Add image_aspect_ratio column to events table
-- Date: 2025-11-07
-- Description: Add aspect ratio selection for event card images (9:16, 1:1, 16:9)

ALTER TABLE events 
ADD COLUMN image_aspect_ratio VARCHAR(10) DEFAULT '16:9' AFTER image;

-- Update existing events to use default 16:9 aspect ratio
UPDATE events SET image_aspect_ratio = '16:9' WHERE image_aspect_ratio IS NULL;
