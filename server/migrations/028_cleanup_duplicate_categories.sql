-- Migration: Clean up duplicate categories
-- Date: 2025-11-07
-- Description: Remove duplicate categories and keep only the original 6

-- Delete duplicate categories (keep only the first occurrence of each name)
DELETE c1 FROM categories c1
INNER JOIN categories c2 
WHERE c1.id > c2.id 
AND c1.name = c2.name;

-- Ensure all remaining categories are active
UPDATE categories SET is_active = TRUE WHERE is_active IS NULL;
