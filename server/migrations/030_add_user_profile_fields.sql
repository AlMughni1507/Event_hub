-- Migration: Add address and education fields to users table
-- Date: 2025-11-11

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS address TEXT AFTER phone,
ADD COLUMN IF NOT EXISTS education VARCHAR(100) AFTER address;

-- Add index for education for potential filtering
ALTER TABLE users 
ADD INDEX idx_education (education);

-- Add comments
ALTER TABLE users 
MODIFY COLUMN address TEXT COMMENT 'Alamat tempat tinggal pengguna',
MODIFY COLUMN education VARCHAR(100) COMMENT 'Pendidikan terakhir (SD/SMP/SMA/D3/S1/S2/S3)';
