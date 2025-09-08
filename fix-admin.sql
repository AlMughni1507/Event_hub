-- Fix admin login issue
-- Update admin password with bcrypt hash for 'admin123'

UPDATE users 
SET password = '$2a$12$LQv3c1yqBwEHXk.JHHPVAuWewcQ0AcS6YwiI8u5dKPXjHkKHjw.L6',
    role = 'admin',
    is_active = 1
WHERE email = 'abdul.mughni845@gmail.com';

-- Verify the update
SELECT id, email, role, is_active, 
       CASE WHEN password = '$2a$12$LQv3c1yqBwEHXk.JHHPVAuWewcQ0AcS6YwiI8u5dKPXjHkKHjw.L6' 
            THEN 'Password Updated' 
            ELSE 'Password NOT Updated' 
       END as password_status
FROM users 
WHERE email = 'abdul.mughni845@gmail.com';
