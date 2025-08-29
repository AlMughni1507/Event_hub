const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config.env' });

async function createAdmin() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'event_db'
    });

    console.log('✅ Connected to database');

    // Check if admin already exists
    const [existingAdmins] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['abdul.mughni845@gmail.com']
    );

    if (existingAdmins.length > 0) {
      console.log('✅ Admin user already exists, updating...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      // Update existing admin
      await connection.execute(
        'UPDATE users SET password = ?, role = ?, is_active = ? WHERE email = ?',
        [hashedPassword, 'admin', true, 'abdul.mughni845@gmail.com']
      );
      
      console.log('✅ Admin user updated successfully');
    } else {
      console.log('✅ Creating new admin user...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      // Insert new admin
      const [result] = await connection.execute(
        'INSERT INTO users (username, email, password, full_name, role, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        ['admin', 'abdul.mughni845@gmail.com', hashedPassword, 'Abdul Mughni', 'admin', true]
      );

      console.log('✅ Admin user created with ID:', result.insertId);
    }

    // Verify admin user
    const [users] = await connection.execute(
      'SELECT id, username, email, role, is_active FROM users WHERE email = ?',
      ['abdul.mughni845@gmail.com']
    );

    console.log('✅ Admin user verified:', users[0]);
    console.log('✅ Admin credentials:');
    console.log('   Email: abdul.mughni845@gmail.com');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Database connection closed');
    }
  }
}

createAdmin();
