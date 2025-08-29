-- Migration: Create analytics table
-- Date: 2024-08-27

CREATE TABLE IF NOT EXISTS analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT,
    user_id INT,
    action_type ENUM('view', 'register', 'cancel', 'complete') NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_event_id (event_id),
    INDEX idx_user_id (user_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created_at (created_at)
);

-- Create analytics summary view
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_actions,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(CASE WHEN action_type = 'view' THEN 1 END) as views,
    COUNT(CASE WHEN action_type = 'register' THEN 1 END) as registrations,
    COUNT(CASE WHEN action_type = 'cancel' THEN 1 END) as cancellations,
    COUNT(CASE WHEN action_type = 'complete' THEN 1 END) as completions
FROM analytics 
GROUP BY DATE(created_at)
ORDER BY date DESC;
