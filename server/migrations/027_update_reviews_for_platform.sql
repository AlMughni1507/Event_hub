-- Migration: Update reviews table for platform reviews (not event-specific)
-- Date: 2025-11-07
-- Description: Convert reviews from event-specific to general platform reviews

-- Drop old foreign key constraints
ALTER TABLE reviews 
DROP FOREIGN KEY IF EXISTS reviews_ibfk_1;

-- Modify table structure
ALTER TABLE reviews 
DROP COLUMN IF EXISTS event_id,
DROP KEY IF EXISTS unique_review,
ADD COLUMN full_name VARCHAR(255) NOT NULL AFTER user_id,
ADD COLUMN is_approved BOOLEAN DEFAULT FALSE AFTER is_verified,
ADD COLUMN admin_notes TEXT AFTER is_approved;

-- Create new indexes
CREATE INDEX idx_is_approved ON reviews(is_approved);
CREATE INDEX idx_rating_approved ON reviews(rating, is_approved);
