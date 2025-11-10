const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config.env' });

async function testDatabaseConnection() {
  console.log('\n🔍 TESTING DATABASE CONNECTION\n');
  console.log('='.repeat(50));
  
  // Show loaded environment variables
  console.log('\n📋 Environment Configuration:');
  console.log('  DB_HOST:', process.env.DB_HOST);
  console.log('  DB_USER:', process.env.DB_USER);
  console.log('  DB_NAME:', process.env.DB_NAME);
  console.log('  DB_PORT:', process.env.DB_PORT);
  console.log('  PORT:', process.env.PORT);
  console.log('  FRONTEND_URL:', process.env.FRONTEND_URL);
  
  let connection;
  
  try {
    console.log('\n🔌 Connecting to database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'event_db',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('✅ Database connection successful!');
    
    // Test query
    console.log('\n📊 Testing database query...');
    const [rows] = await connection.execute('SELECT DATABASE() as current_db, VERSION() as version');
    
    console.log('  Current Database:', rows[0].current_db);
    console.log('  MySQL Version:', rows[0].version);
    
    // Check tables
    console.log('\n📁 Checking tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    
    console.log(`  Found ${tables.length} tables:`);
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`  ${index + 1}. ${tableName}`);
    });
    
    // Check events count
    console.log('\n📅 Checking events...');
    const [events] = await connection.execute('SELECT COUNT(*) as total, SUM(is_active = 1) as active FROM events');
    console.log(`  Total Events: ${events[0].total}`);
    console.log(`  Active Events: ${events[0].active}`);
    
    // Check users count
    console.log('\n👥 Checking users...');
    const [users] = await connection.execute('SELECT COUNT(*) as total, SUM(role = "admin") as admins FROM users');
    console.log(`  Total Users: ${users[0].total}`);
    console.log(`  Admin Users: ${users[0].admins}`);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ ALL DATABASE TESTS PASSED!');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ DATABASE CONNECTION FAILED!');
    console.error('Error:', error.message);
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Database does not exist! Run: npm run create-db');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 MySQL server is not running! Start MySQL in Laragon.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Wrong credentials! Check DB_USER and DB_PASSWORD in config.env');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed\n');
    }
  }
}

// Test Frontend API Connection
async function testFrontendAPI() {
  console.log('\n🌐 TESTING FRONTEND → BACKEND CONNECTION\n');
  console.log('='.repeat(50));
  
  const axios = require('axios');
  const backendURL = `http://localhost:${process.env.PORT || 3000}`;
  
  console.log('  Backend URL:', backendURL);
  console.log('  Frontend expects:', 'http://localhost:3000/api');
  
  try {
    console.log('\n📡 Testing backend health...');
    const response = await axios.get(`${backendURL}/api/health`, {
      timeout: 3000
    });
    
    console.log('✅ Backend is ONLINE!');
    console.log('  Response:', response.data);
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('⚠️  Backend is OFFLINE');
      console.log('💡 Start backend with: npm run dev');
    } else {
      console.log('⚠️  Backend health check failed:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(50));
}

// Run all tests
(async () => {
  try {
    await testDatabaseConnection();
    await testFrontendAPI();
    console.log('\n✨ All tests completed!\n');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
})();
