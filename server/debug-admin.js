const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function debugAdmin() {
  let connection;
  
  try {
    console.log('🔍 Debugging admin login issue...');
    console.log('Database config:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    // Test database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Database connection successful');

    // Check if database exists
    const [databases] = await connection.execute('SHOW DATABASES LIKE ?', [process.env.DB_NAME]);
    console.log('Database exists:', databases.length > 0 ? 'YES' : 'NO');

    if (databases.length === 0) {
      console.log('❌ Database does not exist. Creating...');
      await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      await connection.execute(`USE ${process.env.DB_NAME}`);
    }

    // Check if users table exists
    const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
    console.log('Users table exists:', tables.length > 0 ? 'YES' : 'NO');

    if (tables.length === 0) {
      console.log('❌ Users table does not exist. Please run migrations first.');
      return;
    }

    // Check admin users
    const [adminUsers] = await connection.execute('SELECT id, username, email, role, is_active FROM users WHERE role = "admin"');
    console.log('Admin users found:', adminUsers.length);
    
    if (adminUsers.length > 0) {
      console.log('Admin users:', adminUsers);
    } else {
      console.log('❌ No admin users found. Creating admin...');
      
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await connection.execute(
        'INSERT INTO users (username, email, password, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin', 'admin@gmail.com', hashedPassword, 'System Administrator', 'admin', 1]
      );
      
      console.log('✅ Admin user created:');
      console.log('Email: admin@gmail.com');
      console.log('Password: admin123');
    }

    // Test login simulation
    const testEmail = adminUsers.length > 0 ? adminUsers[0].email : 'admin@gmail.com';
    const [testUsers] = await connection.execute(
      'SELECT id, username, email, password, full_name, role, is_active FROM users WHERE email = ? AND role = "admin"',
      [testEmail]
    );

    if (testUsers.length > 0) {
      const user = testUsers[0];
      console.log('✅ Admin login test successful');
      console.log('User found:', {
        id: user.id,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      });

      // Test password verification
      const isPasswordValid = await bcrypt.compare('admin123', user.password);
      console.log('Password verification:', isPasswordValid ? 'VALID' : 'INVALID');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error errno:', error.errno);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Solution: Start MySQL/MariaDB service');
      console.log('   - Check if Laragon is running');
      console.log('   - Start MySQL service manually');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Solution: Check database credentials in .env file');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Solution: Create database "event_db"');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

debugAdmin();
