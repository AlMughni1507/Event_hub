const { query } = require('./db');

async function checkUsers() {
  try {
    console.log('🔍 Checking user registration status...');
    
    // Check recent user registrations
    const [users] = await query(`
      SELECT id, username, email, role, is_active, is_verified, created_at 
      FROM users 
      WHERE role = 'user' 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    console.log('\n📊 Recent User Registrations:');
    console.table(users);
    
    // Check OTP records
    const [otps] = await query(`
      SELECT email, otp_code, expires_at, created_at 
      FROM email_otps 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    console.log('\n📧 Recent OTP Records:');
    console.table(otps);
    
    // Count inactive users
    const [inactiveCount] = await query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE role = 'user' AND is_active = FALSE
    `);
    
    console.log(`\n⚠️ Inactive users: ${inactiveCount[0].count}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
    process.exit(1);
  }
}

checkUsers();
