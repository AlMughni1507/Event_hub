-- Migration: Add is_active column to events table
-- Date: 2024-12-29

ALTER TABLE events ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Update existing records to set is_active based on status
UPDATE events SET is_active = TRUE WHERE status = 'published';
UPDATE events SET is_active = FALSE WHERE status IN ('draft', 'cancelled', 'completed');

-- Add index for performance
CREATE INDEX idx_is_active ON events(is_active);
