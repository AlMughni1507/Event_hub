-- Create certificate templates table
CREATE TABLE IF NOT EXISTS certificate_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL,
  template_type ENUM('participation', 'achievement', 'completion') DEFAULT 'participation',
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(200),
  content TEXT,
  footer_text VARCHAR(200),
  background_color VARCHAR(7) DEFAULT '#ffffff',
  primary_color VARCHAR(7) DEFAULT '#1e3a8a',
  accent_color VARCHAR(7) DEFAULT '#fb923c',
  text_color VARCHAR(7) DEFAULT '#374151',
  logo_position ENUM('top-left', 'top-center', 'top-right') DEFAULT 'top-center',
  signature_text VARCHAR(100) DEFAULT 'Event Organizer',
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_template_type (template_type),
  INDEX idx_is_default (is_default),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

















