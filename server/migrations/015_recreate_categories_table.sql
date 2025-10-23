-- Migration: Recreate categories table with fresh data
-- File: 015_recreate_categories_table.sql

-- Drop existing categories table if exists
DROP TABLE IF EXISTS categories;

-- Create new categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7) DEFAULT '#007bff',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert essential categories data (7 specified categories)
INSERT INTO categories (name, description, icon, color, is_active) VALUES
('Conference & Summit', 'Professional conferences, business summits, dan keynote sessions dengan speaker terkemuka', 'fas fa-users-cog', '#3730a3', TRUE),
('Workshop & Training', 'Hands-on workshops, skill development training, dan sesi pembelajaran interaktif', 'fas fa-tools', '#047857', TRUE),
('Exhibition & Expo', 'Trade shows, product exhibitions, dan pameran industri dengan vendor terpercaya', 'fas fa-store', '#c2410c', TRUE),
('Education', 'Educational seminars, academic conferences, dan learning sessions', 'fas fa-graduation-cap', '#7c3aed', TRUE),
('Food', 'Culinary events, food festivals, dan gastronomic experiences', 'fas fa-utensils', '#ea580c', TRUE),
('Art & Culture', 'Art exhibitions, cultural events, dan creative showcases', 'fas fa-palette', '#7c2d12', TRUE),
('Health & Wellness', 'Health seminars, wellness workshops, dan fitness events', 'fas fa-heartbeat', '#059669', TRUE);

-- Update events table to ensure foreign key consistency
UPDATE events SET category_id = 1 WHERE category_id NOT IN (SELECT id FROM categories);
