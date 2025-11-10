-- Migration: Create performers table for event lineups
-- Date: 2025-11-05
-- Description: Store performers/artists for each event with photos

CREATE TABLE IF NOT EXISTS performers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(500),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  INDEX idx_event_id (event_id),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
