-- Migration: Create certificates table
-- Date: 2024-10-17

CREATE TABLE IF NOT EXISTS certificates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    attendance_record_id INT NOT NULL,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    certificate_type ENUM('participation', 'achievement', 'completion') DEFAULT 'participation',
    status ENUM('pending', 'generated', 'issued') DEFAULT 'pending',
    generated_at TIMESTAMP NULL,
    issued_at TIMESTAMP NULL,
    certificate_url VARCHAR(500),
    template_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (attendance_record_id) REFERENCES attendance_records(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_event_id (event_id),
    INDEX idx_certificate_number (certificate_number),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
