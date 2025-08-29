const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config.env' });

async function testAdminLogin() {
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

    // Test admin credentials
    const testEmail = 'abdul.mughni845@gmail.com';
    const testPassword = 'admin123';

    // Find admin user
    const [users] = await connection.execute(
      'SELECT id, username, email, password, full_name, role, is_active FROM users WHERE email = ? AND role = "admin"',
      [testEmail]
    );

    console.log('🔍 Users found:', users.length);

    if (users.length === 0) {
      console.log('❌ Admin user not found');
      return;
    }

    const user = users[0];
    console.log('🔍 User found:', { 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      is_active: user.is_active,
      username: user.username,
      full_name: user.full_name
    });

    // Check if account is active
    if (!user.is_active) {
      console.log('❌ Admin account is deactivated');
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(testPassword, user.password);
    console.log('🔍 Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return;
    }

    console.log('✅ Admin login test successful!');
    console.log('✅ Admin credentials are working correctly');
    console.log('✅ Ready for frontend login');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Database connection closed');
    }
  }
}

testAdminLogin();
