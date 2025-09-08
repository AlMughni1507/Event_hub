const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetAdminPassword() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'event_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to database');

    // Check if admin exists
    const [users] = await connection.execute(
      'SELECT id, email, role, is_active FROM users WHERE email = ?',
      ['abdul.mughni845@gmail.com']
    );

    if (users.length === 0) {
      console.log('❌ Admin user not found');
      return;
    }

    const admin = users[0];
    console.log('🔍 Found admin:', admin);

    // Hash new password
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log('🔐 New password hashed');

    // Update password
    const [result] = await connection.execute(
      'UPDATE users SET password = ?, is_active = 1, role = "admin" WHERE email = ?',
      [hashedPassword, 'abdul.mughni845@gmail.com']
    );

    console.log('✅ Password updated successfully');
    console.log('📧 Email: abdul.mughni845@gmail.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('✅ Status: active');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

resetAdminPassword();
