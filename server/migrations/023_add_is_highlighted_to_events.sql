-- Migration: Add is_highlighted field to events table
-- Date: 2025-01-23
-- Purpose: Allow admin to set highlight event for homepage hero section

ALTER TABLE events 
ADD COLUMN is_highlighted BOOLEAN DEFAULT FALSE AFTER is_featured;

-- Add index for better query performance
CREATE INDEX idx_is_highlighted ON events(is_highlighted);

-- Only one event can be highlighted at a time
-- This will be enforced in the application logic
