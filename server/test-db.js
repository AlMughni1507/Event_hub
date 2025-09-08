const { query } = require('./db');

async function testDB() {
  try {
    console.log('Testing database connection...');
    const [result] = await query('SELECT 1 as test');
    console.log('✅ Database connection successful:', result);
    
    const [users] = await query('SELECT id, email, role, is_active FROM users WHERE role = ? LIMIT 1', ['admin']);
    console.log('✅ Admin users found:', users);
    
    if (users.length > 0) {
      console.log('Admin user details:', users[0]);
    } else {
      console.log('❌ No admin users found');
    }
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Full error:', error);
  }
}

testDB();
