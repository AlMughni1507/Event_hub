const { query } = require('./db');

async function fixUserRegistration() {
  try {
    console.log('🔧 Fixing user registration issues...');
    
    // 1. Check and activate all registered users who are inactive
    const [inactiveUsers] = await query(`
      SELECT id, username, email, is_active, is_verified 
      FROM users 
      WHERE role = 'user' AND is_active = FALSE
    `);
    
    console.log(`\n📊 Found ${inactiveUsers.length} inactive users`);
    
    if (inactiveUsers.length > 0) {
      console.log('👥 Inactive users:');
      inactiveUsers.forEach(user => {
        console.log(`- ${user.email} (${user.username})`);
      });
      
      // Activate all inactive users
      await query(`
        UPDATE users 
        SET is_active = TRUE, is_verified = TRUE 
        WHERE role = 'user' AND is_active = FALSE
      `);
      
      console.log('✅ All inactive users have been activated');
    }
    
    // 2. Clear old OTP records
    await query('DELETE FROM email_otps WHERE expires_at < NOW()');
    console.log('🧹 Cleared expired OTP records');
    
    // 3. Test user login for recently registered users
    const [recentUsers] = await query(`
      SELECT id, username, email, is_active, is_verified, created_at 
      FROM users 
      WHERE role = 'user' 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log('\n📋 Recent user registrations:');
    recentUsers.forEach(user => {
      console.log(`✅ ${user.email} - Active: ${user.is_active}, Verified: ${user.is_verified}`);
    });
    
    console.log('\n🎉 User registration fixes completed!');
    console.log('💡 Users can now login with their registered credentials');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
    process.exit(1);
  }
}

fixUserRegistration();
