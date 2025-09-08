const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixAdminLogin() {
  let connection;
  
  try {
    console.log('🔧 Fixing admin login issue...');
    
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to MySQL server');

    // Create database if not exists
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'event_db'}`);
    await connection.execute(`USE ${process.env.DB_NAME || 'event_db'}`);
    
    console.log('✅ Database ready');

    // Create users table if not exists
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        role ENUM('admin', 'organizer', 'user') DEFAULT 'user',
        avatar VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_username (username),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Users table ready');

    // Check if admin exists
    const [adminUsers] = await connection.execute('SELECT id, email FROM users WHERE role = "admin"');
    
    if (adminUsers.length === 0) {
      console.log('🔧 Creating admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await connection.execute(
        'INSERT INTO users (username, email, password, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin', 'admin@gmail.com', hashedPassword, 'System Administrator', 'admin', 1]
      );
      
      console.log('✅ Admin user created successfully!');
    } else {
      console.log('✅ Admin user already exists:', adminUsers[0].email);
      
      // Update admin password to ensure it works
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await connection.execute(
        'UPDATE users SET password = ?, is_active = 1 WHERE role = "admin"',
        [hashedPassword]
      );
      
      console.log('✅ Admin password updated');
    }

    // Final verification
    const [finalCheck] = await connection.execute(
      'SELECT id, username, email, role, is_active FROM users WHERE role = "admin"'
    );

    console.log('\n🎉 ADMIN LOGIN READY!');
    console.log('==================');
    console.log('Email:', finalCheck[0].email);
    console.log('Password: admin123');
    console.log('Role:', finalCheck[0].role);
    console.log('Status:', finalCheck[0].is_active ? 'Active' : 'Inactive');
    console.log('==================');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 SOLUTION:');
      console.log('1. Start Laragon');
      console.log('2. Click "Start All" or start MySQL manually');
      console.log('3. Run this script again');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixAdminLogin();
