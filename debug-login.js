const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugLogin() {
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
      'SELECT id, email, password, role, is_active FROM users WHERE email = ?',
      ['abdul.mughni845@gmail.com']
    );

    if (users.length === 0) {
      console.log('❌ Admin user not found');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await connection.execute(
        'INSERT INTO users (username, email, password, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin', 'abdul.mughni845@gmail.com', hashedPassword, 'Abdul Mughni', 'admin', 1]
      );
      
      console.log('✅ Admin user created');
      console.log('📧 Email: abdul.mughni845@gmail.com');
      console.log('🔑 Password: admin123');
      
    } else {
      const admin = users[0];
      console.log('🔍 Found admin:', {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        is_active: admin.is_active
      });

      // Test password
      const testPassword = 'admin123';
      const isValid = await bcrypt.compare(testPassword, admin.password);
      console.log('🔐 Password test result:', isValid);
      
      if (!isValid) {
        console.log('🔄 Resetting password...');
        const newHashedPassword = await bcrypt.hash('admin123', 12);
        await connection.execute(
          'UPDATE users SET password = ?, role = ?, is_active = ? WHERE email = ?',
          [newHashedPassword, 'admin', 1, 'abdul.mughni845@gmail.com']
        );
        console.log('✅ Password reset successfully');
      }
    }

    console.log('\n🎯 LOGIN CREDENTIALS:');
    console.log('📧 Email: abdul.mughni845@gmail.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

debugLogin();
